import * as Yup from 'yup';
import Module from '../../models/Module/Module';
import Level from '../../models/Level/Level';
import Section from '../../models/Section/Section';

class ModuleController {
  // List all modules
  async index(req, res) {
    try {
      const modules = await Module.findAll({
        include: [
          {
            model: Level,
            as: 'level',
            attributes: ['id', 'name'],
          },
        ],
        order: [['module_order', 'ASC']],
      });
      return res.json(modules);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar módulos' });
    }
  }

  // Create a new module
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      level_id: Yup.number().integer().required(),
      module_order: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { level_id } = req.body;

    // Verifica se o nível existe
    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({ error: 'Nível não encontrado' });
    }

    try {
      const module = await Module.create({ ...req.body });
      return res.status(201).json(module);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar módulo' });
    }
  }

  // Update module by id
  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      level_id: Yup.number().integer(),
      module_order: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const module = await Module.findByPk(id);
      if (!module) {
        return res.status(404).json({ error: 'Módulo não encontrado' });
      }

      const level_id = module.level_id;

      const level = await Level.findByPk(level_id);
      if (!level) {
        return res.status(404).json({ error: 'Nível não encontrado' });
      }

      await module.update(req.body);
      return res.json(module);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar módulo' });
    }
  }

  // Delete module by id
  async delete(req, res) {
    const { id } = req.params;

    try {
      const module = await Module.findByPk(id);
      if (!module) {
        return res.status(404).json({ error: 'Módulo não encontrado' });
      }


      // Busca todas as seções associadas
      const associatedSections = await Section.findAll({
        where: { module_id: id },
        attributes: ['id', 'title', 'section_order'],
      });

      if (associatedSections.length > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir: existem seções associadas a este módulo',
          sections: associatedSections,
        });
      }

      await module.destroy();
      return res.json({ message: 'Módulo removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover módulo' });
    }
  }
}

export default new ModuleController();
