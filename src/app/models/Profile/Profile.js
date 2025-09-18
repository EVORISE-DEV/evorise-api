import Sequelize, { Model } from 'sequelize';

class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'profiles',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'profile_id', as: 'users' });
  }
}

export default Profile;
