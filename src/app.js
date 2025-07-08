// app.js

import express from 'express';
import cors from 'cors';
import routes from './routes';

// Importando nossa database
import './database';

import * as dotenv from 'dotenv';
import multer from 'multer';

import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; // Instale com: npm install jsonwebtoken
import passport from './config/clientGoogle'; // Importe a configuração do Passport
import session from 'express-session'; // Para utilizar sessões

dotenv.config();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://192.168.0.62:4200'],
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
        this.app.use(cors(corsOptions));
        this.app.use(express.json());

        this.app.use(session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false}
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

      //   const storage = multer.memoryStorage(); // Armazenar os arquivos em memória
      //   const upload = multer({
      //     storage: storage,
      //     limits: {
      //         fileSize: 5 * 1024 * 1024, // 15MB (ajuste conforme necessário)
      //     },
      // });

      //   // Middleware para lidar com dados de formulário multipart
      //   this.app.use(upload.array('anexos[]'));
    }

    routes() {
        this.app.use(routes);
    }

    listen(port, callback) {
        // Crie um servidor HTTP a partir do Express app
        const httpServer = http.createServer(this.app);

        // Inicialize o Socket.io no servidor HTTP
        const io = new Server(httpServer, {
          cors: {
            origin: ['http://localhost:4200', 'http://192.168.0.62:4200'], // Substitua pela origem específica do seu frontend Angular
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
          },
        });



        // Defina eventos do Socket.io
        io.on('connection', (socket) => {
          console.log(`Usuário conectado: ${socket.id}`);

          // Envie o menu inicial quando o usuário se conecta
          const welcomeMessage = {
            user: 'Assistente',
            message: `Olá! 😊 Como posso ajudar você hoje? Escolha uma das opções abaixo:

                        1.\n\n Agendamento\n
                        2. Suporte Técnico\n
                        3. Falar com um atendente\n
                        4. Horário de Funcionamento`,
            timestamp: new Date(),
            isAssistant: true,
          };
          console.log('Enviando mensagem do assistente:', welcomeMessage.message);
          socket.emit('receive_message', welcomeMessage);

          // Escuta por mensagens enviadas pelo cliente
          socket.on('send_message', (data) => {
            console.log(`Mensagem recebida de ${socket.id}:`, data);
            const userMessage = {
              user: data.user,
              message: data.message,
              timestamp: new Date(),
              isAssistant: false,
            };
            // io.emit('receive_message', userMessage);
            //console.log('Enviando mensagem do usuário:', userMessage.message);

            // Lógica do assistente para responder ao usuário
            this.handleAssistantResponse(data, socket, io);
          });

          // Escuta o evento de desconexão
          socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
          });
        });

        // Inicie o servidor HTTP
        httpServer.listen(port, callback);
    }

    /**
     * Função para gerenciar as respostas do assistente com base na mensagem do usuário
     * @param data Dados da mensagem enviada pelo usuário
     * @param socket Socket do usuário
     * @param io Instância do Socket.io
     */
    handleAssistantResponse(data, socket, io) {
        console.log(`Handling assistant response for message: ${data.message}`);
        const message = data.message.trim();

        if (message === '1') {
            // Agendamento
            const redirectMessage = {
                user: 'Assistente',
                message: 'Redirecionando para o agendamento... 🗓️',
                timestamp: new Date(),
                isAssistant: true,
            };
            socket.emit('receive_message', redirectMessage);
            socket.emit('redirect', { destination: 'agendamento' });

        } else if (message === '2') {
            // Suporte Técnico
            const supportMessage = {
                user: 'Assistente',
                message: 'Conectando você ao suporte técnico... 🔧',
                timestamp: new Date(),
                isAssistant: true,
            };
            socket.emit('receive_message', supportMessage);
            socket.emit('redirect', { destination: 'suporte-tecnico' });

        } else if (message === '3') {
            // Falar com um atendente
            const attendantMessage = {
                user: 'Assistente',
                message: 'Aguarde enquanto conectamos você a um atendente... 👩‍💼👨‍💼',
                timestamp: new Date(),
                isAssistant: true,
            };
            socket.emit('receive_message', attendantMessage);
            socket.emit('redirect', { destination: 'atendente' });

        }
        // **Opção 4** — Horário de Funcionamento
        else if (message === '4') {
            const scheduleMessage = {
                user: 'Assistente',
                message: 'Nosso horário de funcionamento é de segunda a sexta, das 09h às 19h. ⏰',
                timestamp: new Date(),
                isAssistant: true,
            };
            socket.emit('receive_message', scheduleMessage);

        } else {
            // Mensagem inválida
            const invalidMessage = {
                user: 'Assistente',
                message: 'Não entendi, por favor, escolha uma das opções do menu. 😊\n\n1. Agendamento\n2. Suporte Técnico\n3. Falar com um atendente\n4. Horário de Funcionamento',
                timestamp: new Date(),
                isAssistant: true,
            };
            socket.emit('receive_message', invalidMessage);
        }
    }

}

export default new App();
