import Sequelize, { Model } from 'sequelize';

class ContentCart extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        content_id: Sequelize.INTEGER,
        content_qtt: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'contents_carts',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Content, { foreignKey: 'content_id', as: 'content' });
  }
}

export default ContentCart;
