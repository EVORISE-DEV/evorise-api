import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import authAdmin from './app/middlewares/authAdmin';

import UserController from './app/controllers/User/UserController';
import ProfileController from './app/controllers/Profile/ProfileController';
import ContactController from './app/controllers/Contact/ContactController';
import AddressController from './app/controllers/Address/AddressController';
import SignatureController from './app/controllers/Signature/SignatureController';
import ContentController from './app/controllers/Content/ContentController';
import ContentCartController from './app/controllers/Content/ContentCartController';
import ContentTopicController from './app/controllers/Content/ContentTopicController';
import ContentReviewController from './app/controllers/Content/ContentReviewController';
import ContentInterestController from './app/controllers/Content/ContentInterestController';
import ProductController from './app/controllers/Product/ProductController';
import ProductCartController from './app/controllers/Product/ProductCartController';
import ProductInterestController from './app/controllers/Product/ProductInterestController';
import ProductReviewController from './app/controllers/Product/ProductReviewController';''
import UserScoreController from './app/controllers/User/UserScoreController';
import SessionController from './app/controllers/Session/SessionController';
import TeacherController from './app/controllers/Teacher/TeacherController';
import CartController from './app/controllers/Cart/CartController';
import PointsController from './app/controllers/Point/PointsController';
import LevelController from './app/controllers/Level/LevelController';
import ModuleController from './app/controllers/Module/ModuleController';
import SectionController from './app/controllers/Section/SectionController';
import VideoController from './app/controllers/Video/VideoController';
import passport from './config/clientGoogle';
import EventController from './app/controllers/Event/EventController';
import EventDistanceController from './app/controllers/Event/EventDistanceController';
import EventPhotoController from './app/controllers/Event/EventPhotoController';
import uploadMiddleware from './app/middlewares/uploadMiddleware';
import ResetPasswordController from './app/controllers/ResetPassword/ResetPasswordController';

const routes = new Router();




// routes.get('/user_Google', passport.authenticate('google', { scope: ['profile', 'email'] }),);
//=================== Google Auth ====================
routes.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: 'http://localhost:4200/',
  })
);


//=================== User Registration ====================
routes.post('/register', UserController.store);

//=================== Admin Routes ====================
routes.get('/users', authAdmin, UserController.index);

//=================== Login ====================
routes.post('/sessions', SessionController.store);
routes.post('/logout', SessionController.logout);


//================== Reset Password ====================
routes.post('/forgot-password', ResetPasswordController.store);
routes.post('/reset-password/:token', ResetPasswordController.update);

//=================== Events ====================
routes.get('/events', EventController.index);

// ==================== AUTHENTICATED ROUTES ====================
routes.use(authMiddleware);

//===================== Cart ====================
routes.get('/cart', CartController.getCart);
routes.post('/cart/add', CartController.addItem);
//===================== Points ===================
routes.post('/points/add', PointsController.addPoints);
routes.get('/points/ranking', PointsController.getRanking);
// ==================== Session ====================
routes.get('/me', SessionController.getMe);
routes.get('/sessions/validate', SessionController.validateSession);
// ==================== USERS ====================
// routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.updateData);
routes.get('/users/:id', UserController.getUserById);
routes.delete('/users/:id', UserController.deleteTransaction);

// ==================== PROFILES ====================
routes.get('/profiles', ProfileController.index);
routes.post('/profiles', ProfileController.store);
routes.put('/profiles/:id', ProfileController.update);
routes.delete('/profiles/:id', ProfileController.delete);

// ==================== CONTACTS ====================
routes.get('/contacts', ContactController.index);
routes.post('/contacts', ContactController.store);
routes.put('/contacts/:id', ContactController.update);
routes.delete('/contacts/:id', ContactController.delete);

// ==================== ADDRESSES ====================
routes.get('/addresses', AddressController.index);
routes.post('/addresses', AddressController.store);
routes.put('/addresses/:id', AddressController.update);
routes.delete('/addresses/:id', AddressController.delete);

// ==================== SIGNATURES ====================
routes.get('/signatures', SignatureController.index);
routes.post('/signatures', SignatureController.store);
routes.put('/signatures/:id', SignatureController.update);
routes.delete('/signatures/:id', SignatureController.delete);

// ==================== CONTENTS ====================
routes.get('/contents', ContentController.index);
routes.post('/contents', ContentController.store);
routes.put('/contents/:id', ContentController.update);
routes.delete('/contents/:id', ContentController.delete);

// ==================== CONTENT TOPICS ====================
routes.get('/content-topics', ContentTopicController.index);
routes.post('/content-topics', ContentTopicController.store);
routes.put('/content-topics/:id', ContentTopicController.update);
routes.delete('/content-topics/:id', ContentTopicController.delete);

// ==================== CONTENT INTERESTS ====================
routes.get('/content-interests', ContentInterestController.index);
routes.post('/content-interests', ContentInterestController.store);
routes.put('/content-interests/:id', ContentInterestController.update);
routes.delete('/content-interests/:id', ContentInterestController.delete);

// ==================== CONTENT REVIEWS ====================
routes.get('/content-reviews', ContentReviewController.index);
routes.post('/content-reviews', ContentReviewController.store);
routes.put('/content-reviews/:id', ContentReviewController.update);
routes.delete('/content-reviews/:id', ContentReviewController.delete);

// ==================== CONTENT CARTS ====================
routes.get('/content-carts', ContentCartController.index);
routes.post('/content-carts', ContentCartController.store);
routes.put('/content-carts/:id', ContentCartController.update);
routes.delete('/content-carts/:id', ContentCartController.delete);

// ==================== PRODUCTS ====================
routes.get('/products', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

// ==================== PRODUCT CARTS ====================
routes.get('/product-carts', ProductCartController.index);
routes.post('/product-carts', ProductCartController.store);
routes.put('/product-carts/:id', ProductCartController.update);
routes.delete('/product-carts/:id', ProductCartController.delete);

// ==================== PRODUCT INTERESTS ====================
routes.get('/product-interests', ProductInterestController.index);
routes.post('/product-interests', ProductInterestController.store);
routes.put('/product-interests/:id', ProductInterestController.update);
routes.delete('/product-interests/:id', ProductInterestController.delete);

// ==================== PRODUCT REVIEWS ====================
routes.get('/product-reviews', ProductReviewController.index);
routes.post('/product-reviews', ProductReviewController.store);
routes.put('/product-reviews/:id', ProductReviewController.update);
routes.delete('/product-reviews/:id', ProductReviewController.delete);

// ==================== USER SCORES ====================
routes.get('/user-scores', UserScoreController.index);
routes.post('/user-scores', UserScoreController.store);
routes.put('/user-scores/:id', UserScoreController.update);
routes.delete('/user-scores/:id', UserScoreController.delete);

// ==================== TEACHERS ====================
routes.get('/teachers', TeacherController.index);
routes.post('/teachers', TeacherController.store);
routes.put('/teachers/:id', TeacherController.update);
routes.delete('/teachers/:id', TeacherController.delete);
routes.get('/teachers/user/:user_id', TeacherController.searchByUser);


//========================== LEVELS ====================
routes.get('/levels', LevelController.index);
routes.post('/levels', LevelController.store);
routes.put('/levels/:id', LevelController.update);
routes.delete('/levels/:id', LevelController.delete);

// ==================== MODULES ====================
routes.get('/modules', ModuleController.index);
routes.post('/modules', ModuleController.store);
routes.put('/modules/:id', ModuleController.update);
routes.delete('/modules/:id', ModuleController.delete);

// ==================== SECTIONS ====================
routes.get('/sections', SectionController.index);
routes.post('/sections', SectionController.store);
routes.put('/sections/:id', SectionController.update);
routes.delete('/sections/:id', SectionController.delete);

// ==================== VIDEOS ====================
routes.get('/videos', VideoController.index);
routes.post('/videos', VideoController.store);
routes.put('/videos/:id', VideoController.update);
routes.delete('/videos/:id', VideoController.delete);

// ==================== EVENTS ====================
routes.post('/events', EventController.store);
routes.put('/events/:id', EventController.update);
routes.delete('/events/:id', EventController.delete);

//==================== EVENT DISTANCES ====================
routes.get('/events/:eventId/distances', EventDistanceController.index);
routes.post('/events/:eventId/distances', EventDistanceController.store);
routes.put('/events/distances/:id', EventDistanceController.update);
routes.delete('/events/distances/:id', EventDistanceController.delete);

//==================== EVENT PHOTOS ====================
routes.get('/events/:eventId/photos', EventPhotoController.index);
routes.post('/events/:eventId/photos', uploadMiddleware.single('upload/events'), EventPhotoController.store);
routes.put('/events/photos/:id', EventPhotoController.update);
routes.delete('/events/photos/:id', EventPhotoController.delete);


export default routes;
