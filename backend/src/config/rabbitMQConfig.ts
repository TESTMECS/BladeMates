import { rabbitMQConfig } from "./settings";
export const config = {
  url: rabbitMQConfig.url, // Replace with your RabbitMQ connection string
  exchangeName: "notifications",
  exchangeType: "topic",
};
