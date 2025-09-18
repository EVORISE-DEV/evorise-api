import Sequelize, { Model } from 'sequelize';
import Book from './Book';

class BookPhoto extends Model {
  static init(sequelize) {
    super.init(
      {
        book_id: Sequelize.INTEGER,
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
            const cdnBase = process.env.CDN_EVENTS_BASE; // ex.: https://cdn.evoriseapi.com/books
            const apiBase = process.env.APP_URL_EVENTS || 'http://localhost:3333/uploads';
            const base = isProd && cdnBase ? cdnBase : apiBase;

            return `${base}/${normalized}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'book_photos',
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book',
    });
  }
}

export default BookPhoto;
