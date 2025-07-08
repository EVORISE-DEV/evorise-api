import Sequelize, { Model } from 'sequelize';

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        telephone: Sequelize.STRING,
        smartphone: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'contacts',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'contact_id', as: 'user' });
  }
}

export default Contact;
