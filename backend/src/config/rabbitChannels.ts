import { rabbitConnection } from './rabbitConnection';

const createChannel = async () => {
  const connection = await rabbitConnection();

  if (!connection) {
    throw new Error('RabbitMQ connection not found');
  }

  return await connection.createChannel();
};

let _notifications = createChannel();

export const notifications = () => _notifications;
