import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';
import { ObjectId } from 'mongodb';

export async function getNotifications(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  return user.notifications;
}
