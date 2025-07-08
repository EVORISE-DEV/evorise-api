import Sequelize, { Model } from 'sequelize';

class ContentTopicRelation extends Model {
  static init(sequelize) {
    super.init(
      {
        content_id: Sequelize.INTEGER,
        content_topic_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'contents_topics_relations',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Content, {
      foreignKey: 'content_id',
      as: 'content',
    });

    this.belongsTo(models.ContentTopic, {
      foreignKey: 'content_topic_id',
      as: 'topic',
    });
  }
}

export default ContentTopicRelation;
