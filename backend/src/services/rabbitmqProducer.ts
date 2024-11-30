import amqp from 'amqplib/callback_api';

import { rabbitConnection } from '../config/rabbitConnection';
import { notifications } from '../config/rabbitChannels';

export async function sendNotification(
  userId: string,
  message: string = 'New notification'
) {
  try {
    const queue = `notification-${userId}`;
    const channel = await notifications();
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(' [x] Sent %s', message);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
