// src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carrega as variáveis do .env para process.env
dotenv.config();

// Cria a instância do Sequelize com as variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_DATABASE,     // Nome do banco de dados
  process.env.DB_USERNAME,     // Nome de usuário do banco de dados
  process.env.DB_PASSWORD,     // Senha do banco de dados
  {
    dialect: process.env.DB_DIALECT, // Dialeto do banco de dados (mysql, postgres, etc.)
    host: process.env.DB_HOST,       // Host do banco de dados
    port: process.env.DB_PORT,       // Porta do banco de dados
    define: {
      timestamps: true,              // Adiciona os campos de createdAt e updatedAt automaticamente
      underscored: true,             // Usa snake_case nos nomes das colunas
      underscoredAll: true,          // Aplica para todas as tabelas
    },
  }
);

export default sequelize;
