import * as Yup from 'yup';
import ProductReview from '../models/ProductReview';
import User from '../models/User';
import Product from '../models/Product';

class ProductReviewController {
  async index(req, res) {
    try {
      const reviews = await ProductReview.findAll({
        attributes: ['id', 'rating', 'description', 'user_id', 'product_id'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.json(reviews);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar avaliações de produtos.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido'),
      product_id: Yup.number().required('O ID do produto é obrigatório'),
      rating: Yup.number().min(1).max(5).required('A avaliação é obrigatória'),
      description: Yup.string().required('A descrição é obrigatória'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const review = await ProductReview.create(req.body);
    return res.json(review);
  }

  async update(req, res) {
    const { id } = req.params;
    const review = await ProductReview.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    await review.update(req.body);
    return res.json(review);
  }

  async delete(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id);

      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      await review.destroy();
      return res.status(200).json({ message: 'Avaliação removida com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover avaliação de produto' });
    }
  }
}

export default new ProductReviewController();
