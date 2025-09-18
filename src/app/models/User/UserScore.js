import Sequelize, { Model } from 'sequelize';

class UserScore extends Model {
  static init(sequelize) {
    super.init(
      {
        pace_km_3: Sequelize.FLOAT,
        pace_km_5: Sequelize.FLOAT,
        pace_km_10: Sequelize.FLOAT,
        distance_km: Sequelize.FLOAT,
        point: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'user_scores',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default UserScore;
