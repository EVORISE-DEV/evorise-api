import * as Yup from 'yup';
import ContentTopic from '../../models/Content/ContentTopic';
import Content from '../../models/Content/Content';
import ContentTopicRelation from '../../models/Content/ContentTopicRelation';

class ContentTopicController {
  async index(req, res) {
    try {
      const topics = await ContentTopic.findAll();
      return res.json(topics);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tópicos' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      img: Yup.string().optional(),
      files: Yup.string().optional(),
      content_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { name, description, img, files, content_id } = req.body;

    try {
      // Verifica se o conteúdo existe antes de criar o tópico
      const content = await Content.findByPk(content_id);
      if (!content) {
        return res.status(404).json({ error: 'Conteúdo não encontrado' });
      }

      const topic = await ContentTopic.create({ name, description, img, files });

      // Cria a relação do tópico com o conteúdo
      await ContentTopicRelation.create({ content_id, content_topic_id: topic.id });

      return res.json(topic);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar tópico' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().optional(),
      description: Yup.string().optional(),
      img: Yup.string().optional(),
      files: Yup.string().optional(),
      content_id: Yup.number().optional(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { id } = req.params;
    const { name, description, img, files, content_id } = req.body;

    try {
      const topic = await ContentTopic.findByPk(id);

      if (!topic) {
        return res.status(404).json({ error: 'Tópico não encontrado' });
      }

      // Atualiza os dados do tópico
      await topic.update({ name, description, img, files });

      // Se content_id foi enviado, atualiza a relação no ContentTopicRelation
      if (content_id) {
        const contentExists = await Content.findByPk(content_id);
        if (!contentExists) {
          return res.status(404).json({ error: 'Conteúdo associado não encontrado' });
        }

        // Atualiza ou cria a relação
        const relationExists = await ContentTopicRelation.findOne({ where: { content_topic_id: id } });

        if (relationExists) {
          await relationExists.update({ content_id });
        } else {
          await ContentTopicRelation.create({ content_id, content_topic_id: id });
        }
      }

      return res.json(topic);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar tópico' });
    }
  }

  async searchByContent(req, res) {
    const { contentId } = req.params;

    try {
      const content = await Content.findByPk(contentId, {
        include: {
          model: ContentTopic,
          as: 'topics',
          through: { attributes: [] },
        },
      });

      if (!content) {
        return res.status(404).json({ error: 'Conteúdo não encontrado' });
      }

      return res.json(content.topics);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tópicos do conteúdo' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const topic = await ContentTopic.findByPk(id);

      if (!topic) {
        return res.status(404).json({ error: 'Tópico não encontrado' });
      }

      await ContentTopicRelation.destroy({ where: { content_topic_id: id } });
      await topic.destroy();

      return res.json({ message: 'Tópico excluído com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir tópico' });
    }
  }
}

export default new ContentTopicController();
