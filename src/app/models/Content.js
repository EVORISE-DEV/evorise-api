import Sequelize, { Model } from 'sequelize';

class Content extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        price: Sequelize.DECIMAL,
        discount: Sequelize.DECIMAL,
        user_id: Sequelize.UUID,
      },
      {
        sequelize,
        tableName: 'contents',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.ContentCategory, { foreignKey: 'category_id', as: 'category' });
    this.belongsToMany(models.ContentTopic, {
      through: models.ContentTopicRelation,
      foreignKey: 'content_id',
      as: 'topics',
    });
  }
}

export default Content;
