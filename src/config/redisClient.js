// redisClient.js
import { createClient } from 'redis';

const client = createClient({
  url: 'redis://localhost:6379' // configure conforme sua instância Redis
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await client.connect();
})(); // Lembre-se que este método é assíncrono

export default client;
