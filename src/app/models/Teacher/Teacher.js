import Sequelize, { Model } from 'sequelize';

class Teacher extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        bio: Sequelize.STRING,
        expertise_area: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'teachers',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Teacher;
