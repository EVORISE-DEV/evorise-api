// app.js
import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import './database';

import * as dotenv from 'dotenv';
import multer from 'multer';

import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import passport from './config/clientGoogle';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

const DEFAULT_ORIGINS = [
  'http://localhost:4200',
  'http://localhost:3000',
  'http://192.168.0.62:4200',
  'http://172.16.51.168:4200',
];

// Permite definir origens via CORS_ORIGINS="http://a,http://b"
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : DEFAULT_ORIGINS;

const corsOptions = {
  origin: CORS_ORIGINS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Se estiver atrás de proxy (Docker, Nginx, etc.), habilite para cookies secure funcionarem
    this.app.set('trust proxy', 1);

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.use(
      '/uploads/events',
      express.static(path.resolve(__dirname, '..', 'upload', 'events')),
    );

    const SESSION_SECRET = process.env.SESSION_SECRET || 'please-change-me';

    this.app.use(session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Em produção, com HTTPS + proxy configurado, ative secure
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      },
    }));

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Se quiser habilitar upload global depois, descomente abaixo:
    // const storage = multer.memoryStorage();
    // const upload = multer({
    //   storage,
    //   limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    // });
    // this.app.use(upload.array('anexos[]'));
  }

  routes() {
    // Healthcheck rápido (útil para Compose/ingress)
    this.app.get('/health', (req, res) => res.status(200).send('OK'));

    this.app.use(routes);

    // 404 básico
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });
  }

  listen(port, callback) {
    const httpServer = http.createServer(this.app);

    const io = new Server(httpServer, {
      cors: {
        origin: CORS_ORIGINS,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.id}`);

      const welcomeMessage = {
        user: 'Assistente',
        message: `Olá! 😊 Como posso ajudar você hoje? Escolha uma das opções abaixo:

1. Agendamento
2. Suporte Técnico
3. Falar com um atendente
4. Horário de Funcionamento`,
        timestamp: new Date(),
        isAssistant: true,
      };
      socket.emit('receive_message', welcomeMessage);

      socket.on('send_message', (data) => {
        console.log(`Mensagem recebida de ${socket.id}:`, data);
        this.handleAssistantResponse(data, socket, io);
      });

      socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });

    httpServer.listen(port, callback);
  }

  /**
   * Regras simples do assistente
   */
  handleAssistantResponse(data, socket, io) {
    const message = String(data?.message || '').trim();

    if (message === '1') {
      socket.emit('receive_message', {
        user: 'Assistente',
        message: 'Redirecionando para o agendamento... 🗓️',
        timestamp: new Date(),
        isAssistant: true,
      });
      socket.emit('redirect', { destination: 'agendamento' });
      return;
    }

    if (message === '2') {
      socket.emit('receive_message', {
        user: 'Assistente',
        message: 'Conectando você ao suporte técnico... 🔧',
        timestamp: new Date(),
        isAssistant: true,
      });
      socket.emit('redirect', { destination: 'suporte-tecnico' });
      return;
    }

    if (message === '3') {
      socket.emit('receive_message', {
        user: 'Assistente',
        message: 'Aguarde enquanto conectamos você a um atendente... 👩‍💼👨‍💼',
        timestamp: new Date(),
        isAssistant: true,
      });
      socket.emit('redirect', { destination: 'atendente' });
      return;
    }

    if (message === '4') {
      socket.emit('receive_message', {
        user: 'Assistente',
        message: 'Nosso horário de funcionamento é de segunda a sexta, das 09h às 19h. ⏰',
        timestamp: new Date(),
        isAssistant: true,
      });
      return;
    }

    // Resposta padrão
    socket.emit('receive_message', {
      user: 'Assistente',
      message:
        'Não entendi, por favor, escolha uma das opções do menu. 😊\n\n1. Agendamento\n2. Suporte Técnico\n3. Falar com um atendente\n4. Horário de Funcionamento',
      timestamp: new Date(),
      isAssistant: true,
    });
  }
}

export default new App();
