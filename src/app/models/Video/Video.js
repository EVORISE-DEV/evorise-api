import Sequelize, { Model } from 'sequelize';
import Section from '../Section/Section';
import Teacher from '../Teacher/Teacher';

class Video extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        url: Sequelize.STRING,
        access_level: Sequelize.STRING,
        video_order: Sequelize.INTEGER,
        section_id: Sequelize.INTEGER,
        cover_path: Sequelize.STRING,
        summary: Sequelize.STRING,
        teacher_id: Sequelize.INTEGER,
        cover_url: {
          type: Sequelize.VIRTUAL,
          get() {
            const raw = this.getDataValue('cover_path');
            if (!raw) return null;

            // normaliza barras do Windows e remove barras iniciais
            const normalized = String(raw).replace(/\\/g, '/').replace(/^\/+/, '');

            // Em prod usa CDN; no dev usa a API local
            const isProd = process.env.NODE_ENV === 'production';
            const cdnBase = process.env.CDN_EVENTS_BASE; // ex.: https://cdn.evoriseapi.com/events
            const apiBase = process.env.APP_URL_COVERS || 'http://localhost:3333/uploads/videos';
            const base = isProd && cdnBase ? cdnBase : apiBase;

            return `${base}/${normalized}`;
          },
        },

      },
      {
        sequelize,
        tableName: 'videos',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Section, { foreignKey: 'section_id', as: 'section' });
    this.belongsTo(models.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
  }
}

export default Video;
