export const mongoConfig = {
  serverUrl: process.env.MONGO_SERVER_URL || 'mongodb://localhost:27017/',
  database: 'TechTrends',
};

export const redisConfig = {
  url: process.env.REDIS_SERVER_URL || 'redis://localhost:6379',
};
