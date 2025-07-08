import Sequelize, { Model } from 'sequelize';

class ContentInterest extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        content_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'contents_interest',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Content, { foreignKey: 'content_id', as: 'content' });
  }
}

export default ContentInterest;
