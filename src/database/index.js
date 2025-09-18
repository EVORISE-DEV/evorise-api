import Sequelize, { Model } from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User/User';
import Profile from '../app/models/Profile/Profile';
import Content from '../app/models/Content/Content';
import ContentCart from '../app/models/Content/ContentCart';
import ContentReview from '../app/models/Content/ContentReview';
import ContentInterest from '../app/models/Content/ContentInterest';
import Contact from '../app/models/Contact/Contact';
import Product from '../app/models/Product/Product';
import ProductCart from '../app/models/Product/ProductCart';
import ProductReview from '../app/models/Product/ProductReview';
import ProductInterest from '../app/models/Product/ProductInterest';
import UserScore from '../app/models/User/UserScore';
import ContentTopic from '../app/models/Content/ContentTopic';
import Address from '../app/models/Address/Address';
import Signature from '../app/models/Signature/Signature';
import ContentTopicRelation from '../app/models/Content/ContentTopicRelation';
import ContentCategory from '../app/models/Content/ContentCategory';
import ProductCategory from '../app/models/Product/ProductCategory';
import Teacher from '../app/models/Teacher/Teacher';
import Module from '../app/models/Module/Module';
import Video from '../app/models/Video/Video';
import Section from '../app/models/Section/Section';
import Level from '../app/models/Level/Level';
import EventDistance from '../app/models/Event/EventDistance';
import Event from '../app/models/Event/Event';
import EventPhoto from '../app/models/Event/EventPhoto';

const models = [
  User, Address, Contact, Content,  ContentCart, ContentReview, ContentTopic,
  ContentInterest, Product, ProductCart, ProductReview, ProductInterest, ContentTopicRelation,
  UserScore, Signature, Profile, ContentCategory, ProductCategory, Teacher, Module, Video, Section, Level, Event, EventDistance, EventPhoto
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => {
      model.init(this.connection);
    });

    models.map((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
