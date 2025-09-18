import * as Yup from 'yup';
import Video from '../../models/Video/Video';
import Section from '../../models/Section/Section';

class VideoController {

  async index(req, res) {
    try {

      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.limit) || 10;
      const offset = (page - 1) * pageSize;


      const { rows: videos, count: total } = await Video.findAndCountAll({
        include: [
          { model: Section, as: 'section', attributes: [ 'id', 'title'], order: [['id', 'ASC']], },
        ],
        limit: pageSize,
        offset,
      });

      return res.json({
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        pageSize: pageSize,
        totalVideos: total,
        videos,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar vídeos' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      url: Yup.string().required(),
      access_level: Yup.string(),
      video_order: Yup.number(),
      section_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { section_id } = req.body;

    const section = await Section.findByPk(section_id);
    if (!section) {
      return res.status(404).json({ error: 'Seção não encontrada' });
    }

    try {
      const video = await Video.create({ ...req.body });

      return res.status(201).json(video);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar vídeo' });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      url: Yup.string(),
      access_level: Yup.string().oneOf(['free', 'premium']),
      video_order: Yup.number().integer(),
      section_id: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    try {
      const video = await Video.findByPk(id);

      if (!video) {
        return res.status(404).json({ error: 'Vídeo não encontrado' });
      }

      const  section_id  = video.section_id;

      const section = await Section.findByPk(section_id);
      if (!section) {
        return res.status(404).json({ error: 'Seção não encontrada' });
      }

      await video.update(req.body);

      return res.json(video);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar vídeo' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const video = await Video.findByPk(id);
      if (!video) {
        return res.status(404).json({ error: 'Vídeo não encontrado' });
      }

      await video.destroy();
      return res.json({ message: 'Vídeo removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover vídeo' });
    }
  }
}

export default new VideoController();
