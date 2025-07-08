import * as Yup from 'yup';
import Teacher from '../models/Teacher';
import User from '../models/User';

class TeacherController {
  async index(req, res) {
    try {
      const teachers = await Teacher.findAll({
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        ],
      });
      return res.json(teachers);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar professores' });
    }
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      user_id: Yup.string().uuid().required(),
      bio: Yup.string().required(),
      expertise_area: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { user_id, bio,  expertise_area} = req.body;

    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    try {
      const teacher = await Teacher.create({
        ...req.body
      });
      return res.json(teacher);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar professor' });
    }
  }

  async update(req, res) {

    const { id } = req.params;

    const schema = Yup.object().shape({
      user_id: Yup.string().uuid(),
      bio: Yup.string(),
      expertise_area: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      await teacher.update(req.body);
      return res.json(teacher);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar professor' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      await teacher.destroy();
      return res.json({ message: 'Professor removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover professor' });
    }
  }

  async searchByUser(req, res) {

    const { user_id } = req.params;

    try {
      const teacher = await Teacher.findOne({
        where: {user_id: user_id},
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        ],
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      return res.json(teacher);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar professores por conteúdo' });
    }
  }
}

export default new TeacherController();
