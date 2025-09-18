import fs from 'fs';
import path from 'path';
import Book from '../../models/Book/Book';
import BookPhoto from '../../models/Book/BookPhoto'

//Criar BookPhoto e ajustar models e controllers para pastas separadas
class BookPhotoController {

  async index(req, res) {
    const { bookId } = req.params;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    const photos = await BookPhoto.findAll({
      where: { book_id: bookId },
      attributes: ['id', 'path', 'caption', 'created_at'],
      order: [['created_at', 'ASC']],
    });
    return res.json(photos);
  }

  // Faz upload e cria registro
  async store(req, res) {
    const { bookId } = req.params;
    const book = await Book.findByPk(bookId);
    if (!book) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    // Monta o caminho relativo: 'events/<filename>'
    const relativePath = path.posix.join(
      'books',
      'covers',
      req.file.filename
    );

    try {
      const photo = await BookPhoto.create({
        book_id: bookId,
        path: relativePath,
        caption: req.body.caption || null,
      });
      return res.status(201).json(photo);
    } catch (err) {
      fs.unlinkSync(req.file.path);
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar foto' });
    }
  }


  async storeMultiple(req, res) {
    const { bookId } = req.params;
    const book = await Book.findByPk(bookId);
    if (!book) {

      (req.files || []).forEach(file => fs.unlinkSync(file.path));
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    // Cria um array de objetos para bulkCreate
    const records = req.files.map(file => {
      const relativePath = path.posix.join('events', file.filename);
      return {
        book_id: bookId,
        path: relativePath,
        caption: req.body.caption || null,
      };
    });

    try {
      const photos = await BookPhoto.bulkCreate(records, { returning: true });
      return res.status(201).json(photos);
    } catch (err) {

      req.files.forEach(file => fs.unlinkSync(file.path));
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar fotos' });
    }
  }



  // Atualiza legenda/caption
  async update(req, res) {
    const { id } = req.params;
    const photo = await BookPhoto.findByPk(id);
    if (!photo) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }
    try {
      await photo.update({ caption: req.body.caption });
      return res.json(photo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar legenda' });
    }
  }

  // Deleta foto e arquivo
  async delete(req, res) {
    const { id } = req.params;
    const photo = await BookPhoto.findByPk(id);
    if (!photo) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    // Apaga o arquivo físico em uploads/events/…
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'uploads',
      photo.path
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await photo.destroy();
    return res.json({ message: 'Foto removida com sucesso' });
  }
}

export default new BookPhotoController();
