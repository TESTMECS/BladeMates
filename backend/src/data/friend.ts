import { ObjectId, PullOperator, PushOperator } from 'mongodb';

import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';
import { User } from '../types/mongo';

export async function follow(userId: string, friendId: string): Promise<void> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  const friend = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(friendId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  if (friend === null) {
    throw new StatusError(404, 'User to follow does not exist');
  }

  if (userId === friendId) {
    throw new StatusError(400, 'Cannot follow yourself');
  }

  if (
    user.friends.filter((friends) => friends._id.toString() === friendId)
      .length > 0
  ) {
    throw new StatusError(400, 'Already following user');
  }

  const insertedInfo = await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $push: {
        friends: {
          _id: ObjectId.createFromHexString(friendId),
          username: friend.username,
        },
      } as unknown as PushOperator<User>,
    }
  );

  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to add follow');
  }
}

export async function unfollow(
  userId: string,
  friendId: string
): Promise<void> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  const friend = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(friendId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  if (friend === null) {
    throw new StatusError(404, 'Friend not found');
  }

  if (
    user.friends.filter((friends) => friends._id.toString() === friendId)
      .length === 0
  ) {
    throw new StatusError(
      400,
      'Can not unfollow a user that has never been followed'
    );
  }

  const insertedInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(userId) },
    {
      $pull: {
        friends: {
          _id: ObjectId.createFromHexString(friendId),
        },
      } as unknown as PullOperator<User>,
    }
  );

  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to unfollow');
  }

  console.log(`Unfollowed ${friendId}`);
}
