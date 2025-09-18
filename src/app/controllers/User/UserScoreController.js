import * as Yup from 'yup';
import UserScore from '../../models/User/UserScore';
import User from '../../models/User/User';

class UserScoreController {
  async index(req, res) {
    try {
      const scores = await UserScore.findAll({
        attributes: ['id', 'pace_km_3', 'pace_km_5', 'pace_km_10', 'distance_km', 'point'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
        order: [['point', 'DESC']], // Ordena pelo maior número de pontos
      });

      return res.json(scores);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pontuações dos usuários.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido').required(),
      pace_km_3: Yup.number().required(),
      pace_km_5: Yup.number().required(),
      pace_km_10: Yup.number().required(),
      distance_km: Yup.number().required(),
      point: Yup.number().integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const userExists = await User.findByPk(req.body.user_id);
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    const userScore = await UserScore.create(req.body);
    return res.json(userScore);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      pace_km_3: Yup.number(),
      pace_km_5: Yup.number(),
      pace_km_10: Yup.number(),
      distance_km: Yup.number(),
      point: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const userScore = await UserScore.findByPk(req.params.id);
    if (!userScore) {
      return res.status(404).json({ error: 'Pontuação não encontrada.' });
    }

    await userScore.update(req.body);
    return res.json(userScore);
  }

  async delete(req, res) {
    try {
      const userScore = await UserScore.findByPk(req.params.id);
      if (!userScore) {
        return res.status(404).json({ error: 'Pontuação não encontrada.' });
      }

      await userScore.destroy();
      return res.status(200).json({ message: 'Pontuação removida com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover pontuação.' });
    }
  }
}

export default new UserScoreController();
