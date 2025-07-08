import * as Yup from 'yup';
import Section from '../models/Section';
import Module from '../models/Module';
import Video from '../models/Video';

class SectionController {
  // List all sections
  async index(req, res) {
    try {
      const sections = await Section.findAll({
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id', 'title'],
          },
        ],
        order: [['section_order', 'ASC']],
      });
      return res.json(sections);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar seções' });
    }
  }

  // Create a new section
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      module_id: Yup.number().integer().required(),
      section_order: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { module_id } = req.body;

    // Verifica se o módulo existe
    const module = await Module.findByPk(module_id);
    if (!module) {
      return res.status(404).json({ error: 'Módulo não encontrado' });
    }

    try {
      const section = await Section.create({ ...req.body });
      return res.status(201).json(section);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar seção' });
    }
  }

  // Update a section by id
  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      module_id: Yup.number().integer(),
      section_order: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const section = await Section.findByPk(id);
      if (!section) {
        return res.status(404).json({ error: 'Seção não encontrada' });
      }


      const  module_id  = section.module_id;

      const module = await Module.findByPk(module_id);
      if (!module) {
        return res.status(404).json({ error: 'Módulo não encontrado' });
      }

      await section.update(req.body);
      return res.json(section);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar seção' });
    }
  }

  // Delete a section by id
  async delete(req, res) {
    const { id } = req.params;

    try {
      const section = await Section.findByPk(id);
      if (!section) {
        return res.status(404).json({ error: 'Seção não encontrada' });
      }

      // Busca todos os vídeos associados
      const associatedVideos = await Video.findAll({
        where: { section_id: id },
        attributes: ['id', 'title', 'video_order', 'access_level', 'url'],
      });

      if (associatedVideos.length > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir: existem vídeos associados a esta seção',
          videos: associatedVideos,
        });
      }

      await section.destroy();
      return res.json({ message: 'Seção removida com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover seção' });
    }
  }
}

export default new SectionController();
