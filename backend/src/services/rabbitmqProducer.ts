import { notifications } from "../config/rabbitChannels";
import { addNotification } from "../data/user";

export async function sendNotification(userId: string, message: string) {
  try {
    const queue = `notification-${userId}`;
    const { channel, exchangeName } = await notifications();
    // Assert the queue for the user, ensuring it is durable
    await channel.assertQueue(queue, { durable: true });
    // Prepare the message
    const msg = JSON.stringify({ data: message });
    // Send the message to the user's specific queue
    channel.publish(exchangeName, "", Buffer.from(msg));
    console.log(" [x] Sent to all users: %s", message);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
const userSubscriptions = new Map();
export async function subscribeUser(
  userId: string,
  followUserIds: string[] = [],
) {
  try {
    const { channel, exchangeName } = await notifications();
    // Ensure the user is subscribed to their own queue if not already
    const userQueue = `notification-${userId}`;
    if (!userSubscriptions.has(userQueue)) {
      await channel.assertQueue(userQueue, { durable: true });
      await channel.bindQueue(userQueue, exchangeName, "");
      userSubscriptions.set(userQueue, new Set());
    }
    if (followUserIds.length !== 0) {
      // Bind the user’s queue to the followee's queues if not already bound
      for (let followUserId of followUserIds) {
        const followUserQueue = `notification-${followUserId}`;

        if (!userSubscriptions.get(userQueue).has(followUserQueue)) {
          await channel.bindQueue(userQueue, exchangeName, followUserQueue);
          userSubscriptions.get(userQueue).add(followUserQueue);
          console.log(
            `User ${userId} is now subscribed to ${followUserId}'s notifications.`,
          );
        }
      }
    }
    // Start consuming notifications from the user's queue if it's the first time
    consumeNotifications(userId, async (notification: string) => {
      // Store the notification in the database.
      await addNotification(userId, notification);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
async function consumeNotifications(userId: string, callback: Function) {
  try {
    const { channel } = await notifications();
    const userQueue = `notification-${userId}`;
    // Only start consuming the user's queue if it's the first time
    if (!userSubscriptions.has(userQueue)) {
      await channel.assertQueue(userQueue, { durable: true });
      userSubscriptions.set(userQueue, true); // Mark as consumed
    }
    // Start consuming messages
    channel.consume(userQueue, (msg) => {
      if (msg) {
        const notification = JSON.parse(msg.content.toString());
        console.log(`User ${userId} received notification:`, notification);
        // Call the provided callback to send the notification to the socket
        callback(notification);
        // Acknowledge the message after processing
        channel.ack(msg);
      }
    });
    console.log(`User ${userId} is now receiving notifications.`);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
export async function unsubscribeUser(
  userId: string,
  unfollowUserIds: string[] = [],
) {
  try {
    const { channel, exchangeName } = await notifications();
    // Ensure the user is unsubscribed from their own queue
    const userQueue = `notification-${userId}`;
    // Check if the user has any subscriptions to unfollowed users
    for (let unfollowUserId of unfollowUserIds) {
      const unfollowUserQueue = `notification-${unfollowUserId}`;
      // If the user is subscribed to this queue, unbind it
      if (userSubscriptions.get(userQueue)?.has(unfollowUserQueue)) {
        await channel.unbindQueue(userQueue, exchangeName, unfollowUserQueue);
        userSubscriptions.get(userQueue).delete(unfollowUserQueue);
        console.log(
          `User ${userId} has unsubscribed from ${unfollowUserId}'s notifications.`,
        );
      }
    }
    // If the user has no more active subscriptions, cancel their consumer
    if (userSubscriptions.get(userQueue)?.size === 0) {
      channel.cancel(userQueue);
      userSubscriptions.delete(userQueue);
      console.log(`User ${userId} has unsubscribed from all notifications.`);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
