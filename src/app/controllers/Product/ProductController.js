import * as Yup from 'yup';
import ProductCategory from '../../models/Product/ProductCategory';
import Product from '../../models/Product/Product';

class ProductController {
  /**
   * Listar todos os produtos com suas categorias
   */
  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'name'], // Retorna apenas o nome da categoria
          },
        ],
      });

      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  }

  /**
   * Criar um novo produto e associar a uma categoria
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome do produto é obrigatório'),
      description: Yup.string().required('A descrição é obrigatória'),
      price: Yup.number().required('O preço é obrigatório'),
      discount: Yup.number().min(0).optional(),
      category_id: Yup.number().required('A categoria é obrigatória'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { name, description, price, discount, category_id } = req.body;

    try {
      // Verifica se a categoria existe antes de salvar o produto
      const categoryExists = await ProductCategory.findByPk(category_id);
      if (!categoryExists) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      const product = await Product.create({ name, description, price, discount, category_id });

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  /**
   * Atualizar um produto existente
   */
  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().optional(),
      description: Yup.string().optional(),
      price: Yup.number().optional(),
      discount: Yup.number().min(0).optional(),
      category_id: Yup.number().optional(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Se for atualizar a categoria, verifica se ela existe
      if (req.body.category_id) {
        const categoryExists = await ProductCategory.findByPk(req.body.category_id);
        if (!categoryExists) {
          return res.status(404).json({ error: 'Categoria não encontrada' });
        }
      }

      await product.update(req.body);

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  /**
   * Excluir um produto
   */
  async delete(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.destroy();

      return res.status(200).json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover produto' });
    }
  }
}

export default new ProductController();
