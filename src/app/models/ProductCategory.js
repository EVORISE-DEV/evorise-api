import Sequelize, { Model } from 'sequelize';

class ProductCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'products_categories',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
  }
}

export default ProductCategory;
