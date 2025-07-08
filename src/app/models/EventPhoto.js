import Sequelize, { Model } from 'sequelize';

class EventPhoto extends Model {
  static init(sequelize) {
    super.init(
      {
        path: Sequelize.STRING,
        caption: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'event_photos',
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });
  }
}

export default EventPhoto;
