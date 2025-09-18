import * as Yup from 'yup';
import Content from '../../models/Content/Content';
import ContentTopic from '../../models/Content/ContentTopic';
import ContentTopicRelation from '../../models/Content/ContentTopicRelation';
import ContentCategory from '../../models/Content/ContentCategory'; // Importamos o modelo de categoria

class ContentController {
  /**
   * Listar todos os conteúdos com seus tópicos e categorias associadas
   */
  async index(req, res) {
    try {
      const contents = await Content.findAll({
        include: [
          {
            model: ContentTopic,
            as: 'topics',
            through: { attributes: [] }, // Não retorna os campos da tabela pivot
          },
          {
            model: ContentCategory,
            as: 'category',
            attributes: ['id', 'name'], // Traz apenas o nome da categoria
          },
        ],
      });

      return res.json(contents);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar conteúdos' });
    }
  }

  /**
   * Criar um novo conteúdo e associar tópicos e categoria (opcionalmente)
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().required(),
      discount: Yup.number().optional(),
      user_id: Yup.string().uuid().required(),
      category_id: Yup.number().required('A categoria é obrigatória'),
      topics: Yup.array().of(Yup.number()).optional(), // Array de IDs dos tópicos opcionais
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { title, description, price, discount, user_id, category_id, topics } = req.body;

    try {
      // Verifica se a categoria existe antes de salvar
      const categoryExists = await ContentCategory.findByPk(category_id);
      if (!categoryExists) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      const content = await Content.create({
        title,
        description,
        price,
        discount,
        user_id,
        category_id, // Salva a categoria no conteúdo
      });

      // Se houver tópicos informados, associar ao conteúdo
      if (topics && topics.length > 0) {
        const topicRelations = topics.map(topicId => ({
          content_id: content.id,
          content_topic_id: topicId,
        }));
        await ContentTopicRelation.bulkCreate(topicRelations);
      }

      return res.json(content);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar conteúdo' });
    }
  }

  /**
   * Atualizar um conteúdo existente
   */
  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string().optional(),
      description: Yup.string().optional(),
      price: Yup.number().optional(),
      discount: Yup.number().optional(),
      user_id: Yup.string().uuid().optional(),
      category_id: Yup.number().optional(),
      topics: Yup.array().of(Yup.number()).optional(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const content = await Content.findByPk(id);
      if (!content) {
        return res.status(404).json({ error: 'Conteúdo não encontrado' });
      }

      // Se for atualizar a categoria, verifica se ela existe
      if (req.body.category_id) {
        const categoryExists = await ContentCategory.findByPk(req.body.category_id);
        if (!categoryExists) {
          return res.status(404).json({ error: 'Categoria não encontrada' });
        }
      }

      await content.update(req.body);

      // Atualizar tópicos associados, se forem enviados
      if (req.body.topics) {
        await ContentTopicRelation.destroy({ where: { content_id: id } });
        const topicRelations = req.body.topics.map(topicId => ({
          content_id: id,
          content_topic_id: topicId,
        }));
        await ContentTopicRelation.bulkCreate(topicRelations);
      }

      return res.json(content);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar conteúdo' });
    }
  }

  /**
   * Excluir um conteúdo e suas relações
   */
  async delete(req, res) {
    const { id } = req.params;

    try {
      const content = await Content.findByPk(id);
      if (!content) {
        return res.status(404).json({ error: 'Conteúdo não encontrado' });
      }

      // Remover relações de tópicos antes de deletar o conteúdo
      await ContentTopicRelation.destroy({ where: { content_id: id } });
      await content.destroy();

      return res.json({ message: 'Conteúdo excluído com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir conteúdo' });
    }
  }
}

export default new ContentController();
