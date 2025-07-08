import ProductCart from '../models/ProductCart';
import * as Yup from 'yup';

class ProductCartController {
  async index(req, res) {
    const cartItems = await ProductCart.findAll();
    return res.json(cartItems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('O ID do usuário deve ser um UUID válido').required(),
      product_id: Yup.number().required(),
      product_qtt: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const cartItem = await ProductCart.create(req.body);
    return res.json(cartItem);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      product_qtt: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const cartItem = await ProductCart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const updatedCartItem = await cartItem.update(req.body);
    return res.json(updatedCartItem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const cartItem = await ProductCart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    return res.status(204).send();
  }
}

export default new ProductCartController();
