import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        surname: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        contact_id: Sequelize.INTEGER,
        address_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        reset_password_token: Sequelize.STRING,
        reset_password_expires: Sequelize.DATE,

      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profile' });
    this.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'contact' });
    this.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
    this.belongsTo(models.Signature, { foreignKey: 'signature_id', as: 'signature' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
