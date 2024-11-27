import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';
import { ObjectId } from 'mongodb';

import * as R from 'ramda';

export async function getNotifications(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
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
      _id: new ObjectId(userId),
    },
    {
      $set: {
        notifications: notificationCopy,
      },
    }
  );

  return user.notifications;
}
