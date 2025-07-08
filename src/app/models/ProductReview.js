import Sequelize, { Model } from 'sequelize';

class ProductReview extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        product_id: Sequelize.INTEGER,
        rating: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'products_reviews',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default ProductReview;
