// src/app/controllers/EventDistanceController.js

import * as Yup from 'yup';
import { Op } from 'sequelize';
import Event from '../../models/Event/Event';
import EventDistance from '../../models/Event/EventDistance';

class EventDistanceController {
  // List all distances for an event
  async index(req, res) {
    const { eventId } = req.params;
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      const distances = await EventDistance.findAll({
        where: { event_id: eventId },
        order: [['distance', 'ASC']],
      });
      return res.json(distances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar distâncias' });
    }
  }

  // Create a new distance for an event
  async store(req, res) {
    const { eventId } = req.params;
    const schema = Yup.object().shape({
      distance: Yup.number().integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      const dist = await EventDistance.create({
        event_id: eventId,
        distance: req.body.distance,
      });
      return res.status(201).json(dist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar distância' });
    }
  }

  // Update a distance by id
  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      distance: Yup.number().integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const dist = await EventDistance.findByPk(id);
      if (!dist) {
        return res.status(404).json({ error: 'Distância não encontrada' });
      }

      await dist.update({ distance: req.body.distance });
      return res.json(dist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar distância' });
    }
  }

  // Delete a distance by id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const dist = await EventDistance.findByPk(id);
      if (!dist) {
        return res.status(404).json({ error: 'Distância não encontrada' });
      }

      await dist.destroy();
      return res.json({ message: 'Distância removida com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover distância' });
    }
  }
}

export default new EventDistanceController();
