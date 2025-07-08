import Sequelize, { Model } from 'sequelize';
import Module from './Module';

class Section extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        module_id: Sequelize.INTEGER,
        section_order: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'sections',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Module, { foreignKey: 'module_id', as: 'module' });
  }
}

export default Section;
