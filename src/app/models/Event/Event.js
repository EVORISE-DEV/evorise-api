import Sequelize, { Model } from 'sequelize';
import EventDistance from './EventDistance';

class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        local: Sequelize.STRING,
        date: Sequelize.DATEONLY,
        time: Sequelize.TIME,
      },
      {
        sequelize,
        tableName: 'events',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.EventDistance, {
      foreignKey: 'event_id',
      as: 'distances',
    });
    this.hasMany(models.EventPhoto, {
      foreignKey: 'event_id',
      as: 'photos',
    });
  }
}

export default Event;
