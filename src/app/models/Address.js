import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        address_name: Sequelize.STRING,
        country: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'addresses',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'address_id', as: 'user' });
  }
}

export default Address;
