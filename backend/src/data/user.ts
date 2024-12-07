import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';
import { ObjectId } from 'mongodb';

import * as R from 'ramda';

export async function getNotifications(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  // Update user object to have all notifications as read after returning the notifications array
  let notificationCopy = R.identity(user.notifications);
  notificationCopy = notificationCopy.map((notification) => {
    notification.read = true;
    return notification;
  });

  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        notifications: notificationCopy,
      },
    }
  );

  return user.notifications.map((notif) => {
    return {
      _id: notif._id.toString(),
      friendId: notif.friendId.toString(),
      articleId: notif.friendId.toString(),
      read: notif.read,
    };
  });
}
