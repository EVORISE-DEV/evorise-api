import * as Yup from 'yup';
import ContentCart from '../../models/Content/ContentCart';
import User from '../../models/User/User';
import Content from '../../models/Content/Content';

class ContentCartController {
  async index(req, res) {
    try {
      const carts = await ContentCart.findAll({
        attributes: ['id', 'content_qtt', 'user_id', 'content_id'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Content,
            as: 'content',
            attributes: ['id', 'title', 'description', 'price'],
          },
        ],
      });

      return res.json(carts);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar carrinho de conteúdos.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido'),
      content_id: Yup.number().required('O ID do conteúdo é obrigatório'),
      content_qtt: Yup.number().min(1).required('A quantidade é obrigatória'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const cartItem = await ContentCart.create(req.body);

    return res.json(cartItem);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      content_qtt: Yup.number().min(1).required('A quantidade é obrigatória'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const cartItem = await ContentCart.findByPk(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado' });
    }

    await cartItem.update(req.body);

    return res.json(cartItem);
  }

  async delete(req, res) {
    try {
      const cartItem = await ContentCart.findByPk(req.params.id);

      if (!cartItem) {
        return res.status(404).json({ error: 'Item do carrinho não encontrado' });
      }

      await cartItem.destroy();

      return res.status(200).json({ message: 'Item removido do carrinho com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover item do carrinho' });
    }
  }
}

export default new ContentCartController();
