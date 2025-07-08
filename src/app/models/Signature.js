import Sequelize, { Model } from 'sequelize';

class Signature extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        discount: Sequelize.FLOAT,
      },
      {
        sequelize,
        tableName: 'signatures',
      }
    );
    return this;
  }
}

export default Signature;
