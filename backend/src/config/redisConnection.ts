import Redis, { Redis as RedisType } from 'ioredis';
import { redisConfig } from './settings';

let client: RedisType | null = null;

const redisConnection = async (): Promise<RedisType | null> => {
  try {
    if (!client) {
      client = new Redis(redisConfig.url);
      client.on('error', (err) => {
        console.error('Redis error:', err);
        client = null;
      });
    }
    return client;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const closeRedisConnection = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

export { redisConnection, closeRedisConnection };