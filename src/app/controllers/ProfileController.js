import * as Yup from 'yup';
import Profile from '../models/Profile';

class ProfileController {
  async index(req, res) {
    try {
      const profiles = await Profile.findAll({
        attributes: ['id', 'name'],
      });

      return res.json(profiles);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar perfis.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const profileExists = await Profile.findOne({ where: { name: req.body.name } });

    if (profileExists) {
      return res.status(400).json({ error: 'Perfil já existe' });
    }

    const profile = await Profile.create(req.body);

    return res.json(profile);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const profile = await Profile.findByPk(req.params.id);

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    await profile.update(req.body);

    return res.json(profile);
  }

  async delete(req, res) {
    try {
      const profile = await Profile.findByPk(req.params.id);

      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      await profile.destroy();

      return res.status(200).json({ message: 'Perfil deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar perfil' });
    }
  }
}

export default new ProfileController();
