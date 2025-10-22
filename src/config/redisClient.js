// src/lib/redisClient.js
import { createClient } from 'redis';

const {
  REDIS_URL,
  REDIS_HOST = 'redis',        // nome do serviço no docker-compose
  REDIS_PORT = '6379',
  REDIS_DB   = '0',
} = process.env;

const url = REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`;

const client = createClient({
  url,
  socket: {
    // força IPv4 e uma estratégia de reconexão simples
    family: 4,
    reconnectStrategy: (retries) => Math.min(1000 + retries * 200, 5000),
  },
});

client.on('error', (err) => console.error('[redis] error:', err?.message || err));
client.on('ready', () => console.log('[redis] READY at', url));

let connecting;
export async function ensureRedis() {
  if (client.isOpen) return client;
  if (!connecting) {
    connecting = client.connect().catch((e) => {
      console.error('[redis] connect failed:', e?.message || e);
      connecting = null;
      throw e;
    });
  }
  await connecting;
  return client;
}

// uso ESM default para manter compatibilidade com seus imports existentes
export default client;
