import amqp from 'amqplib/callback_api';

import { rabbitConnection } from '../config/rabbitConnection';

export async function sendNotification(message: string) {
  try {
    const queue = 'notification';
    const connection = await rabbitConnection();
    const channel = await connection?.createChannel();
    channel?.assertQueue(queue, { durable: false });
    channel?.sendToQueue(queue, Buffer.from(message));
    console.log(' [x] Sent %s', message);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
