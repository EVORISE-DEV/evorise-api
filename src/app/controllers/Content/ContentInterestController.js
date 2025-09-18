import ContentInterest from '../../models/Content/ContentInterest';
import * as Yup from 'yup';

class ContentInterestController {
  async index(req, res) {
    const interests = await ContentInterest.findAll();
    return res.json(interests);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido').required(),
      content_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const interest = await ContentInterest.create(req.body);
    return res.json(interest);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido'),
      content_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const interest = await ContentInterest.findByPk(id);
    if (!interest) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    const updatedInterest = await interest.update(req.body);
    return res.json(updatedInterest);
  }

  async delete(req, res) {
    const { id } = req.params;

    const interest = await ContentInterest.findByPk(id);
    if (!interest) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    await interest.destroy();
    return res.status(204).send();
  }
}

export default new ContentInterestController();
