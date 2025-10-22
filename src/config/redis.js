// src/lib/redis.js
const Redis = require('ioredis');

const {
  REDIS_URL,
  REDIS_HOST = 'redis',
  REDIS_PORT = '6379',
  REDIS_DB   = '0',
  REDIS_PASSWORD,        // opcional se usar host/port
} = process.env;

// Cria instância (URL tem precedência)
const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      family: 4,                 // força IPv4
      lazyConnect: true,         // não conecta até chamarmos connect()
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (retries) => Math.min(1000 + retries * 200, 5000), // 1s..5s
      reconnectOnError: (err) => {
        // Reconeça em MOVED/ASK/READONLY ou erros de socket
        const msg = err?.message || '';
        return /READONLY|ETIMEDOUT|ECONNRESET|MOVED|ASK/i.test(msg);
      },
    })
  : new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      db:   Number(REDIS_DB),
      password: REDIS_PASSWORD,   // opcional
      family: 4,
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (retries) => Math.min(1000 + retries * 200, 5000),
      reconnectOnError: (err) => {
        const msg = err?.message || '';
        return /READONLY|ETIMEDOUT|ECONNRESET|MOVED|ASK/i.test(msg);
      },
    });

// Logs úteis
redis.on('error', (err) => {
  console.error('[redis] error:', err?.message || err);
});

redis.on('connect', () => {
  // ioredis sinaliza que o socket abriu
  console.log('[redis] socket conectado (aguardando READY)...');
});

redis.on('ready', () => {
  console.log('[redis] READY — conectado e pronto para comandos');
});

redis.on('close', () => {
  console.warn('[redis] conexão fechada');
});

redis.on('reconnecting', (time) => {
  console.warn(`[redis] reconectando em ~${time}ms`);
});

// Conecta explicitamente (por estarmos com lazyConnect)
(async () => {
  try {
    // Em ioredis v5+, connect() existe; em v4 ele conecta automaticamente,
    // por isso usamos o optional chaining.
    await redis.connect?.();
  } catch (e) {
    console.error('[redis] connect() failed:', e?.message || e);
  }
})();

/**
 * Helper: aguarda READY (útil no bootstrap da app)
 * @param {number} timeoutMs
 */
async function awaitReady(timeoutMs = 15000) {
  if (redis.status === 'ready') return true;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error('redis READY timeout'));
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(t);
      cleanup();
      resolve(true);
    };
    const onError = (err) => {
      clearTimeout(t);
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      redis.off('ready', onReady);
      redis.off('error', onError);
    };

    redis.once('ready', onReady);
    redis.once('error', onError);
  });
}

// Encerramento limpo
async function shutdown() {
  try {
    console.log('[redis] encerrando conexão...');
    // quit() encerra graciosamente; fallback para disconnect()
    if (typeof redis.quit === 'function') {
      await redis.quit();
    } else {
      redis.disconnect();
    }
  } catch (e) {
    console.error('[redis] erro ao encerrar:', e?.message || e);
    redis.disconnect();
  }
}

// Se quiser encerrar junto com o processo:
process.on('SIGINT',  () => shutdown().finally(() => process.exit(0)));
process.on('SIGTERM', () => shutdown().finally(() => process.exit(0)));

module.exports = { redis, awaitReady, shutdown };
