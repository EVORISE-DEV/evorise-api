import Sequelize, { Model } from 'sequelize';

class Level extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'levels',
      }
    );
  }

}

export default Level;
