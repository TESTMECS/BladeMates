import amqp from "amqplib";
import { config } from "../config/rabbitMQConfig";
import { getFriendsFromId } from "../data/auth";
import { addNotification, checkFriendshipStatus } from "../data/user";
export async function emitFollow(followerId: string, followeeId: string) {
  let connection: amqp.Connection | null = null;

  let channel: amqp.Channel | null = null;
  let followeeChannel: amqp.Channel | null = null;
  try {
    // console.log(
    //   `[DEBUG] Starting emitFollow for follower ${followerId}, followee ${followeeId}`,
    // );

    // Setup a consumer BEFORE publishing the message for follower
    const followerConsumePromise = new Promise<void>(async (resolve, _) => {
      connection = await amqp.connect(config.url);
      channel = await connection.createChannel();
      channel.prefetch(1);
      // Assert the exchange
      await channel.assertExchange(config.exchangeName, config.exchangeType, {
        durable: true,
      });
      // Create a queue for the follower
      const { queue: followerQueue } = await channel.assertQueue(
        `follow.${followerId}.${followeeId}`,
        {
          durable: true,
        },
      );
      // console.log(
      //   `[DEBUG] Created queue for follower ${followerId}: `,
      //   followerQueue,
      // );
      // Bind the queue to the exchange with the specific routing key
      const followerRoutingKey = `follow.${followerId}.${followeeId}`;
      await channel.bindQueue(
        followerQueue,
        config.exchangeName,
        followerRoutingKey,
      );
      // console.log(
      //   `[DEBUG] Bound queue for follower ${followerId} with routing key: ${followerRoutingKey}`,
      // );

      // Setup the consumer for follower
      channel.consume(
        followerQueue,
        async (msg) => {
          if (msg) {
            console.log(
              `[DEBUG] Received message for follower ${followerId} with routing key: ${msg.fields.routingKey}`,
            );
            // console.log(`[DEBUG] Message content: ${msg.content.toString()}`);
            // Process the message
            await addNotification("follow", followerId, msg.content.toString());
            // channel?.ack(msg);
            resolve(); // Resolve the promise when message is consumed
          }
        },
        { noAck: true },
      );
      // Publish the message for follower
      const message = `${followerId} followed ${followeeId}`;
      channel.publish(
        config.exchangeName,
        followerRoutingKey,
        Buffer.from(message),
        {
          persistent: true,
        },
      );
      // console.log(
      //   `[DEBUG] Published message for follower ${followerId}: ${message}`,
      // );
    });
    // Wait for the follower message to be consumed
    await followerConsumePromise;
  } catch (error) {
    console.log(error);
  }
  try {
    // Setup a consumer for followee
    const followeeConsumePromise = new Promise<void>(async (resolve, _) => {
      // Reuse the existing connection and channel
      if (!connection) throw new Error("Connection is null");
      followeeChannel = await connection.createChannel();
      followeeChannel.prefetch(1);
      // Create a queue for the followee
      const { queue: followeeQueue } = await followeeChannel.assertQueue(
        `follow.${followeeId}`,
        {
          durable: true,
        },
      );
      // console.log(
      //   `[DEBUG] Created queue for followee ${followeeId}: `,
      //   followeeQueue,
      // );
      // Bind the queue to the exchange with the specific routing key
      const followeeRoutingKey = `follow.${followeeId}.${followerId}`;
      await followeeChannel.bindQueue(
        followeeQueue,
        config.exchangeName,
        followeeRoutingKey,
      );
      // console.log(
      //   `[DEBUG] Bound queue for followee ${followeeId} with routing key: ${followeeRoutingKey}`,
      // );
      // Setup the consumer for followee
      followeeChannel.consume(
        followeeQueue,
        async (msg) => {
          if (msg) {
            console.log(
              `[DEBUG] Received message for followee ${followeeId} with routing key: ${msg.fields.routingKey}`,
            );
            // console.log(`[DEBUG] Message content: ${msg.content.toString()}`);
            // Process the message
            await addNotification("follow", followeeId, msg.content.toString());
            // followeeChannel?.ack(msg);
            resolve(); // Resolve the promise when message is consumed
          }
        },
        { noAck: true },
      );
      // Publish the message for followee
      const message = `${followerId} followed ${followeeId}`;
      followeeChannel.publish(
        config.exchangeName,
        followeeRoutingKey,
        Buffer.from(message),
        { persistent: true },
      );
      // console.log(
      //   `[DEBUG] Published message for followee ${followeeId}: ${message}`,
      // );
    });
    // Wait for the followee message to be consumed
    await followeeConsumePromise;
  } catch (error) {
    console.log(`[ERROR] In emitFollow:`, error);
  }
}
export async function emitUnfollow(followerId: string, followeeId: string) {
  let connection: amqp.Connection | null = null;
  let channel: amqp.Channel | null = null;
  let followeeChannel: amqp.Channel | null = null;
  try {
    // Setup a consumer BEFORE publishing the message for follower
    const followerConsumePromise = new Promise<void>(async (resolve, _) => {
      connection = await amqp.connect(config.url);
      channel = await connection.createChannel();
      channel.prefetch(1);
      // Assert the exchange
      await channel.assertExchange(config.exchangeName, config.exchangeType, {
        durable: true,
      });
      // Create a queue for the follower
      const { queue: followerQueue } = await channel.assertQueue(
        `unfollow.${followerId}.${followeeId}`,
        {
          durable: true,
        },
      );
      // Bind the queue to the exchange with the specific routing key
      const followerRoutingKey = `unfollow.${followerId}.${followeeId}`;
      await channel.bindQueue(
        followerQueue,
        config.exchangeName,
        followerRoutingKey,
      );

      // Setup the consumer for follower
      channel.consume(
        followerQueue,
        async (msg) => {
          if (msg) {
            // Process the message
            await addNotification(
              "unfollow",
              followerId,
              msg.content.toString(),
            );
            resolve(); // Resolve the promise when message is consumed
          }
        },
        { noAck: true },
      );
      // Publish the message for follower
      const message = `${followerId} unfollowed ${followeeId}`;
      channel.publish(
        config.exchangeName,
        followerRoutingKey,
        Buffer.from(message),
      );
    });
    // Wait for the follower message to be consumed
    await followerConsumePromise;
    // Setup a consumer for followee
    const followeeConsumePromise = new Promise<void>(async (resolve, _) => {
      // Reuse the existing connection and channel
      if (!connection) throw new Error("Connection is null");
      followeeChannel = await connection?.createChannel();
      followeeChannel.prefetch(1);
      // Create a queue for the followee
      const { queue: followeeQueue } = await followeeChannel.assertQueue(
        `unfollow.${followeeId}.${followerId}`,
        {
          durable: true,
        },
      );
      // Bind the queue to the exchange with the specific routing key
      const followeeRoutingKey = `unfollow.${followeeId}.${followerId}`;
      await followeeChannel.bindQueue(
        followeeQueue,
        config.exchangeName,
        followeeRoutingKey,
      );
      // Setup the consumer for followee
      followeeChannel.consume(
        followeeQueue,
        async (msg) => {
          if (msg) {
            // Process the message
            await addNotification(
              "unfollow",
              followeeId,
              msg.content.toString(),
            );
            resolve(); // Resolve the promise when message is consumed
          }
        },
        { noAck: true },
      );
      // Unbind the favorite queue for the followee
      const favoriteRoutingKey = `favorite.${followeeId}`;
      await followeeChannel.unbindQueue(
        `favorite.${followerId}`,
        config.exchangeName,
        favoriteRoutingKey,
      );
      // Publish the message for followee
      const message = `${followerId} unfollowed ${followeeId}`;
      followeeChannel.publish(
        config.exchangeName,
        followeeRoutingKey,
        Buffer.from(message),
      );
    });
    // Wait for the followee message to be consumed
    await followeeConsumePromise;
  } catch (error) {
    console.error(error);
  }
}
export async function emitFavorite(userId: string, articleId: string) {
  let connection: amqp.Connection | null = null;
  let channel: amqp.Channel | null = null;

  // console.log(
  //   `[DEBUG] Starting emitFavorite for user ${userId}, article ${articleId}`,
  // );

  try {
    // Setup a consumer BEFORE publishing the message
    const consumePromise = new Promise<void>(async (resolve, _) => {
      connection = await amqp.connect(config.url);
      channel = await connection.createChannel();

      // Assert the exchange
      await channel.assertExchange(config.exchangeName, config.exchangeType, {
        durable: true,
      });

      // Create a queue for this specific user
      const { queue } = await channel.assertQueue(`favorite.${userId}`, {
        durable: true,
      });
      // console.log(`[DEBUG] Created queue for user ${userId}: `, queue);

      // Bind the queue to the exchange with the specific routing key
      const userRoutingKey = `favorite.${userId}`;
      await channel.bindQueue(queue, config.exchangeName, userRoutingKey);

      // Get friends
      const friendIds = await getFriendsFromId(userId);
      // console.log(`[DEBUG] Friends for user ${userId}: `, friendIds);
      let activeFriends: any[] = [];
      if (friendIds.length > 0) {
        const currentFriends = await Promise.all(
          friendIds.map(async (friendId) => {
            const isStillFriends = await checkFriendshipStatus(
              userId,
              friendId.toString(),
            );

            // console.log(
            //   `[DEBUG] Friendship status between ${userId} and ${friendId}: ${isStillFriends}`,
            // );

            return isStillFriends ? friendId : null;
          }),
        );

        activeFriends = currentFriends.filter((friend) => friend !== null);

        // console.log(`[DEBUG] Active friends for user ${userId}: `, activeFriends);

        if (activeFriends.length > 0) {
          for (const friendId of activeFriends) {
            const friendRoutingKey = `favorite.${friendId.toString()}`;
            // console.log(`[DEBUG] Binding queue for routing key: ${friendRoutingKey}`,);
            await channel.bindQueue(
              queue,
              config.exchangeName,
              friendRoutingKey,
            );
          }
        }
      }
      // Setup the consumer
      channel.consume(queue, async (msg) => {
        if (msg) {
          // console.log(`[DEBUG] Received message with routing key: ${msg.fields.routingKey}`,);
          // console.log(`[DEBUG] Message content: ${msg.content.toString()}`);

          const routingKey = msg.fields.routingKey;

          // Re-check friendship status
          const updatedFriendIds = await getFriendsFromId(userId);
          const matchingFriendId = updatedFriendIds.find(
            (friendId) => routingKey === `favorite.${friendId.toString()}`,
          );

          // console.log(`[DEBUG] Updated friend IDs: `, updatedFriendIds);
          // console.log(`[DEBUG] Matching friend ID: `, matchingFriendId);
          // console.log(`[DEBUG] User routing key: ${userRoutingKey}`);
          // console.log(`[DEBUG] Current routing key: ${routingKey}`);

          if (routingKey === userRoutingKey || matchingFriendId !== undefined) {
            // console.log(`[DEBUG] Adding notification for message`);
            await addNotification("favorite", userId, msg.content.toString());
            // console.log(`[DEBUG] Adding notification for friends`);
            // console.log(`[DEBUG] Friend IDs: `, updatedFriendIds);
            for (const friendId of updatedFriendIds) {
              // console.log(`[DEBUG] Adding notification for friend ${friendId}`);
              await addNotification(
                "favorite",
                friendId.toString(),
                msg.content.toString(),
              );
            }
          }

          channel?.ack(msg);
          resolve();
        }
      });

      // Publish the message
      channel.publish(
        config.exchangeName,
        userRoutingKey,
        Buffer.from(`${userId} favorited ${articleId}`),
      );
    });

    // Wait for the message to be consumed
    await consumePromise;
  } catch (error) {
    console.error(`[ERROR] In emitFavorite:`, error);
  }
}
