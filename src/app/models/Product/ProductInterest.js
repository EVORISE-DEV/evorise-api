import Sequelize, { Model } from 'sequelize';

class ProductInterest extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        product_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'products_interest',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default ProductInterest;
