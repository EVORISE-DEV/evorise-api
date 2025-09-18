import Sequelize, { Model } from 'sequelize';

class EventPhoto extends Model {
  static init(sequelize) {
    super.init(
      {
        event_id: Sequelize.INTEGER,
        path: Sequelize.STRING,
        caption: Sequelize.STRING,
        cover_url: {
          type: Sequelize.VIRTUAL,
          get() {
            const raw = this.getDataValue('path');
            if (!raw) return null;

            // normaliza barras do Windows e remove barras iniciais
            const normalized = String(raw).replace(/\\/g, '/').replace(/^\/+/, '');

            // Em prod usa CDN; no dev usa a API local
            const isProd = process.env.NODE_ENV === 'production';
            const cdnBase = process.env.CDN_EVENTS_BASE; // ex.: https://cdn.evoriseapi.com/events
            const apiBase = process.env.APP_URL_EVENTS || 'http://localhost:3333/uploads';
            const base = isProd && cdnBase ? cdnBase : apiBase;

            return `${base}/${normalized}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'event_photos',
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });
  }
}

export default EventPhoto;
