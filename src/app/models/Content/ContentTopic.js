import Sequelize, { Model } from 'sequelize';
import ContentTopicRelation from './ContentTopicRelation';

class ContentTopic extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        img: Sequelize.STRING,
        files: Sequelize.JSON, // Caso haja múltiplos arquivos associados ao tópico
      },
      {
        sequelize,
        tableName: 'contents_topics',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Content, {
      through: ContentTopicRelation,
      foreignKey: 'topic_id',
      as: 'contents'
    });
  }
}

export default ContentTopic;
