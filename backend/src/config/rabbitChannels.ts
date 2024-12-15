import { rabbitConnection } from "./rabbitConnection";

const createChannel = async () => {
  const connection = await rabbitConnection();

  if (!connection) {
    throw new Error("RabbitMQ connection not found");
  }

  const channel = await connection.createChannel();
  const exchangeName = "notification_exchange";
  const exchangeType = "fanout";
  await channel.assertExchange(exchangeName, exchangeType, { durable: true });
  return { channel, exchangeName };
};

let _notifications = createChannel();

export const notifications = () => _notifications;
