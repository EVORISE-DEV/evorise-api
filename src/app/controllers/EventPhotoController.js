import fs from 'fs';
import path from 'path';
import Event from '../models/Event';
import EventPhoto from '../models/EventPhoto';

class EventPhotoController {
  // Lista fotos de um evento
  async index(req, res) {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    const photos = await EventPhoto.findAll({
      where: { event_id: eventId },
      attributes: ['id', 'path', 'caption', 'created_at'],
      order: [['created_at', 'ASC']],
    });
    return res.json(photos);
  }

  // Faz upload e cria registro
  async store(req, res) {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    // Monta o caminho relativo: 'events/<filename>'
    const relativePath = path.posix.join(
      'events',
      req.file.filename
    );

    try {
      const photo = await EventPhoto.create({
        event_id: eventId,
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

  // Faz upload e cria múltiplos registros
  async storeMultiple(req, res) {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      // remove arquivos enviados em caso de erro
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
        event_id: eventId,
        path: relativePath,
        caption: req.body.caption || null, // ou captions separados no body
      };
    });

    try {
      const photos = await EventPhoto.bulkCreate(records, { returning: true });
      return res.status(201).json(photos);
    } catch (err) {
      // em caso de falha, remove todos os arquivos
      req.files.forEach(file => fs.unlinkSync(file.path));
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar fotos' });
    }
  }



  // Atualiza legenda/caption
  async update(req, res) {
    const { id } = req.params;
    const photo = await EventPhoto.findByPk(id);
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
    const photo = await EventPhoto.findByPk(id);
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

export default new EventPhotoController();
