import Sequelize, { Model } from 'sequelize';

class ContentCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'contents_categories',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Content, { foreignKey: 'category_id', as: 'contents' });
  }
}

export default ContentCategory;
