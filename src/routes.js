import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import authAdmin from './app/middlewares/authAdmin';

import UserController from './app/controllers/UserController';
import ProfileController from './app/controllers/ProfileController';
import ContactController from './app/controllers/ContactController';
import AddressController from './app/controllers/AddressController';
import SignatureController from './app/controllers/SignatureController';
import ContentController from './app/controllers/ContentController';
import ContentCartController from './app/controllers/ContentCartController';
import ContentTopicController from './app/controllers/ContentTopicController';
import ContentReviewController from './app/controllers/ContentReviewController';
import ContentInterestController from './app/controllers/ContentInterestController';
import ProductController from './app/controllers/ProductController';
import ProductCartController from './app/controllers/ProductCartController';
import ProductInterestController from './app/controllers/ProductInterestController';
import ProductReviewController from './app/controllers/ProductReviewController';''
import UserScoreController from './app/controllers/UserScoreController';
import SessionController from './app/controllers/SessionController';
import TeacherController from './app/controllers/TeacherController';
import CartController from './app/controllers/CartController';
import PointsController from './app/controllers/PointsController';
import LevelController from './app/controllers/LevelController';
import ModuleController from './app/controllers/ModuleController';
import SectionController from './app/controllers/SectionController';
import VideoController from './app/controllers/VideoController';
import passport from './config/clientGoogle';
import auth from './config/auth';
import EventController from './app/controllers/EventController';
import EventDistanceController from './app/controllers/EventDistanceController';
import EventPhotoController from './app/controllers/EventPhotoController';
import uploadMiddleware from './app/middlewares/uploadMiddleware';

const routes = new Router();

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
//routes.post('/usersBy', UserController.userShowBy);
// routes.get('/user_Google/me', UserController.indexGoogle);
// passo 1 – inicia fluxo OAuth
routes.get('/user_Google', passport.authenticate('google', { scope: ['profile', 'email'] }),);
// 2) Rota de callback para onde o Google redireciona
routes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  SessionController.storeGoogle
);


routes.post('/sessions', SessionController.store);

routes.get('/events', EventController.index);
// Todas rotas abaixo desse middleware precisa estar autenticado
routes.use(authMiddleware);
// Rotas para o carrinho de compras
routes.get('/cart', CartController.getCart);          // Recupera o carrinho completo do usuário
routes.post('/cart/add', CartController.addItem);       // Adiciona um item ao carrinho
// Você pode adicionar outras rotas, como remover item ou limpar o carrinho

// Rotas para o sistema de pontos
routes.post('/points/add', PointsController.addPoints);       // Adiciona pontos ao usuário
routes.get('/points/ranking', PointsController.getRanking);     // Recupera o ranking dos usuários

// ==================== Session ====================
routes.delete('/sessions', SessionController.logout);
routes.get('/sessions/validate', SessionController.validateSession);
// ==================== USERS ====================
routes.get('/users', UserController.index);
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

routes.get('/teachers', TeacherController.index);
routes.post('/teachers', TeacherController.store);
routes.put('/teachers/:id', TeacherController.update);
routes.delete('/teachers/:id', TeacherController.delete);

// 🔍 Nova rota para buscar professores por conteúdo
routes.get('/teachers/user/:user_id', TeacherController.searchByUser);

//routes.use(authAdmin);


// Levels
routes.get('/levels', LevelController.index);
routes.post('/levels', LevelController.store);
routes.put('/levels/:id', LevelController.update);
routes.delete('/levels/:id', LevelController.delete);

// Modules
routes.get('/modules', ModuleController.index);
routes.post('/modules', ModuleController.store);
routes.put('/modules/:id', ModuleController.update);
routes.delete('/modules/:id', ModuleController.delete);

// Sections
routes.get('/sections', SectionController.index);
routes.post('/sections', SectionController.store);
routes.put('/sections/:id', SectionController.update);
routes.delete('/sections/:id', SectionController.delete);

// Videos
routes.get('/videos', VideoController.index);
routes.post('/videos', VideoController.store);
routes.put('/videos/:id', VideoController.update);
routes.delete('/videos/:id', VideoController.delete);

// Events

routes.post('/events', EventController.store);
routes.put('/events/:id', EventController.update);
routes.delete('/events/:id', EventController.delete);

// Event Distances
routes.get('/events/:eventId/distances', EventDistanceController.index);
routes.post('/events/:eventId/distances', EventDistanceController.store);
routes.put('/events/distances/:id', EventDistanceController.update);
routes.delete('/events/distances/:id', EventDistanceController.delete);

// Event Photos
routes.get('/events/:eventId/photos', EventPhotoController.index);
routes.post('/events/:eventId/photos', uploadMiddleware.single('upload/events'), EventPhotoController.store);
routes.put('/events/photos/:id', EventPhotoController.update);
routes.delete('/events/photos/:id', EventPhotoController.delete);


export default routes;
