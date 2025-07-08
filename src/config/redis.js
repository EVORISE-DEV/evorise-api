import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1', // Endereço do Redis (localhost)
  port: 6379, // Porta padrão do Redis
  keyPrefix: 'session:', // Prefixo para as chaves (opcional)
});

export default redis;
