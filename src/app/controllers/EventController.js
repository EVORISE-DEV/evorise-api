// src/app/controllers/EventController.js

import * as Yup from 'yup';
import Event from '../models/Event';
import EventDistance from '../models/EventDistance';

class EventController {
  // List all events
  async index(req, res) {
    try {
      const events = await Event.findAll({
        include: [
          { association: 'distances', attributes: ['id', 'distance'] },
          { association: 'photos', attributes: ['id', 'path', 'caption']}
        ],
        order: [
          [{model: EventDistance, as: 'distances'}, 'distance', 'ASC'],
          ['date', 'DESC'],
          ['time', 'ASC']
        ],
        distinct: true,      // evita duplicatas quando houver vários distances por event
        subQuery: false,
      });
      return res.json(events);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar eventos' });
    }
  }

  // Create a new event
  async store(req, res) {
    const schema = Yup.object().shape({
      title:       Yup.string().required(),
      description: Yup.string(),
      local:       Yup.string(),
      date:        Yup.date().required(),
      time:        Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const event = await Event.create(req.body);
      return res.status(201).json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar evento' });
    }
  }

  // Update an existing event
  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      title:       Yup.string().required(),
      description: Yup.string().required(),
      local:       Yup.string(),
      date:        Yup.date().required(),
      time:        Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      await event.update(req.body);
      return res.json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  }

  // Delete an event
  async delete(req, res) {
    const { id } = req.params;

    try {
      const event = await Event.findByPk(id, {
        include: [{ association: 'distances', attributes: ['id', 'distance'] }],
      });
      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      if (event.distances && event.distances.length > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir: existem distâncias associadas a este evento',
          distances: event.distances,
        });
      }

      await event.destroy();
      return res.json({ message: 'Evento removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover evento' });
    }
  }
}

export default new EventController();
