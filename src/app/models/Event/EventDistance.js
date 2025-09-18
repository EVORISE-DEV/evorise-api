import Sequelize, { Model } from 'sequelize';

class EventDistance extends Model {
  static init(sequelize) {
    super.init(
      {
        event_id: Sequelize.INTEGER,
        distance: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'event_distances',
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

export default EventDistance;
