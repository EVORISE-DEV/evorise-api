import Sequelize, { Model } from 'sequelize';

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        link: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'books',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.BookPhoto, {
      foreignKey: 'book_id',
      as: 'photos',
    });
  }
}

export default Book;
