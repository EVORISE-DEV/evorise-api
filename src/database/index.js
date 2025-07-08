import Sequelize, { Model } from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Profile from '../app/models/Profile';
import Content from '../app/models/Content';
import ContentCart from '../app/models/ContentCart';
import ContentReview from '../app/models/ContentReview';
import ContentInterest from '../app/models/ContentInterest';
import Contact from '../app/models/Contact';
import Product from '../app/models/Product';
import ProductCart from '../app/models/ProductCart';
import ProductReview from '../app/models/ProductReview';
import ProductInterest from '../app/models/ProductInterest';
import UserScore from '../app/models/UserScore';
import ContentTopic from '../app/models/ContentTopic';
import Address from '../app/models/Address';
import Signature from '../app/models/Signature';
import ContentTopicRelation from '../app/models/ContentTopicRelation';
import ContentCategory from '../app/models/ContentCategory';
import ProductCategory from '../app/models/ProductCategory';
import Teacher from '../app/models/Teacher';
import Module from './../app/models/Module';
import Video from './../app/models/Video';
import Section from '../app/models/Section';
import Level from '../app/models/Level';
import EventDistance from '../app/models/EventDistance';
import Event from '../app/models/Event';
import EventPhoto from '../app/models/EventPhoto';

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
