// CartController.js
import client from '../../config/redisClient';
import Product from '../models/Product'; // Seu model do produto

class CartController {
  // Adiciona um item ao carrinho usando um HASH
  async addItem(req, res) {
    try {
      // Correção aqui:
      // Em vez de "const { userId } = req.userId", faça:
      const userId = req.userId;

      const { productId, quantity } = req.body;
      const cartKey = `cart:${userId}`;

      // Verifica se o produto existe no banco de dados
      const product = await Product.findByPk(productId);
      //console.log(product);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Converte productId e quantity
      const field = String(productId);               // campo do Hash deve ser string
      const increment = parseInt(quantity, 10);      // hIncrBy exige um número inteiro

      if (Number.isNaN(increment)) {
        return res
          .status(400)
          .json({ error: 'Quantidade inválida. Envie um número inteiro.' });
      }

      // Incrementa a quantidade do produto no carrinho de forma atômica
      await client.hIncrBy(cartKey, field, increment);
      return res.json({ message: 'Item adicionado ao carrinho' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao adicionar item ao carrinho.' });
    }
  }

  // Retorna o carrinho completo do usuário
  async getCart(req, res) {
    try {
      const { userId } = req;
      const cartKey = `cart:${userId}`;

      // Recupera todos os itens do carrinho (o resultado é um objeto onde as keys são os productId's)
      const cart = await client.hGetAll(cartKey);
      return res.json({ cart });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar carrinho.' });
    }
  }
}

export default new CartController();
