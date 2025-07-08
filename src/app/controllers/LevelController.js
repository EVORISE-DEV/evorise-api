import * as Yup from 'yup';
import User from '../models/User';
import Level from '../models/Level';
import Module from '../models/Module';

class LevelController {
  async index(req, res) {
    try {
      const levels = await Level.findAll({
      });
      return res.json(levels);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar niveis' });
    }
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { name } = req.body;

    const levelExists = await User.findOne({
      where: {name: name}
    });
    if (levelExists) {
      return res.status(404).json({ error: 'Nivel já existe' });
    }

    try {
      const level = await Level.create({
        ...req.body
      });
      return res.json(level);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar nivel' });
    }
  }

  async update(req, res) {

    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const level = await Level.findByPk(id);
      if (!level) {
        return res.status(404).json({ error: 'Nivel não encontrado' });
      }

      await level.update(req.body);
      return res.json(level);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar nivel' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const level = await Level.findByPk(id);
      if (!level) {
        return res.status(404).json({ error: 'Nivel não encontrado' });
      }


      // Busca todos os módulos associados
      const associatedModules = await Module.findAll({
        where: { level_id: id },
        attributes: ['id', 'title', 'module_order'],
      });

      if (associatedModules.length > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir: existem módulos associados a este nível',
          modules: associatedModules,
        });
      }

      await level.destroy();
      return res.json({ message: 'Nivel removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover nivel' });
    }
  }

}

export default new LevelController();
