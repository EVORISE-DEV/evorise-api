import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        price: Sequelize.FLOAT,
        discount: Sequelize.FLOAT,
      },
      {
        sequelize,
        tableName: 'products',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProductCategory, { foreignKey: 'category_id', as: 'category' });
    this.hasMany(models.ProductReview, { foreignKey: 'product_id', as: 'reviews' });
    this.hasMany(models.ProductCart, { foreignKey: 'product_id', as: 'carts' });
    this.hasMany(models.ProductInterest, { foreignKey: 'product_id', as: 'interests' });
  }
}

export default Product;
