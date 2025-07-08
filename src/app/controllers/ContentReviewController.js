import ContentReview from '../models/ContentReview';
import * as Yup from 'yup';

class ContentReviewController {
  async index(req, res) {
    const reviews = await ContentReview.findAll();
    return res.json(reviews);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido').required(),
      content_id: Yup.number().required(),
      rating: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const review = await ContentReview.create(req.body);
    return res.json(review);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      rating: Yup.number(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const review = await ContentReview.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updatedReview = await review.update(req.body);
    return res.json(updatedReview);
  }

  async delete(req, res) {
    const { id } = req.params;

    const review = await ContentReview.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    return res.status(204).send();
  }
}

export default new ContentReviewController();
