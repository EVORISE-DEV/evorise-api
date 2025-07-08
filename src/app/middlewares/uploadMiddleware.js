import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Função geradora de storage com destino dinâmico
function createStorage(destinationFolderRelative) {
  // 🔒 Resolve o caminho para o destino final com base na raiz do projeto
  const finalPath = path.resolve(process.cwd(), destinationFolderRelative);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      // Cria a pasta se não existir
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }

      cb(null, finalPath);
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  });
}

// Função genérica que retorna upload configurado com destino específico
function getUploader(destinationRelative) {
  const storage = createStorage(destinationRelative);
  return multer({
    storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpg',
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de arquivo inválido.'));
      }
    }
  });
}

// Middleware para upload único com destino configurável
function single(destinationRelative) {
  const absolutePath = path.resolve(process.cwd(), destinationRelative);

  return (req, res, next) => {
    const upload = getUploader(destinationRelative).single('photo');

    upload(req, res, err => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'Imagem muito grande' });
        }
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const filePath = path.join(absolutePath, req.file.filename);
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: 'Arquivo vazio' });
      }

      next();
    });
  };
}

// Middleware para múltiplos arquivos com destino configurável
function multiple(destinationRelative) {
  const absolutePath = path.resolve(process.cwd(), destinationRelative);

  return (req, res, next) => {
    const upload = getUploader(destinationRelative).array('photos', 10);

    upload(req, res, err => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'Uma das imagens está muito grande' });
        }
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      req.files = req.files.filter(file => {
        const filePath = path.join(absolutePath, file.filename);
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          fs.unlinkSync(filePath);
          return false;
        }
        return true;
      });

      if (req.files.length === 0) {
        return res.status(400).json({ error: 'Todos os arquivos estavam vazios' });
      }

      next();
    });
  };
}

export default { single, multiple };
