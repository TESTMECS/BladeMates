import redis from 'redis';
import { redisConfig } from './settings';

// let client = null;

const client = redis.createClient(redisConfig);
let connected = false;

const redisConnection = async () => {
  try {
    if (!connected) {
      await client.connect();
      connected = true;
    }

    return client;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const closeRedisConnection = async () => {
  await client.quit();
};

export { redisConnection, closeRedisConnection };
