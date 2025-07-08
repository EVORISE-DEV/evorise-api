import Sequelize, { Model } from 'sequelize';
import Section from './Section';

class Video extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        url: Sequelize.STRING,
        access_level: Sequelize.STRING,
        video_order: Sequelize.INTEGER,
        section_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'videos',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Section, { foreignKey: 'section_id', as: 'section' });
  }
}

export default Video;
