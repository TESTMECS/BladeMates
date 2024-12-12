import * as redis from 'redis';
import { redisConfigV2 } from './settings';
import Redis from 'ioredis';

// let client = null;

const client = new Redis(
  redisConfigV2.url,
);
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
  connected = false;
  await client.quit();
};

export { redisConnection, closeRedisConnection };
