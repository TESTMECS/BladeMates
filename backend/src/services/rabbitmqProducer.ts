import { notifications } from "../config/rabbitChannels";

export async function sendNotification(userId: string, message: string) {
  try {
    const queue = `notification-${userId}`;
    const channel = await notifications();
    channel.assertQueue(queue, { durable: true });
    const msg = JSON.stringify({ data: message });
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", message);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
