import Sequelize, { Model } from 'sequelize';

class Module extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        level_id: Sequelize.INTEGER,
        module_order: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'modules',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
  }
}

export default Module;
