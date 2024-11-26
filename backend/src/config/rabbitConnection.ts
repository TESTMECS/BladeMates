import amqp from 'amqplib';

import { rabbitMQConfig } from './settings';

let connection: null | amqp.Connection = null;

const rabbitConnection = async () => {
  try {
    if (connection === null) {
      connection = await amqp.connect(rabbitMQConfig.url);
      connection.on('error', function (err) {
        console.log('AMQP:Error:', err);
      });
      connection?.on('close', () => {
        connection = null;
      });
    }

    return connection;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const closeRabitConnection = async () => {
  await connection?.close();
};

export { rabbitConnection, closeRabitConnection };
