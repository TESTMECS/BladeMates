import bcrypt from 'bcryptjs';

import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';

export async function follow(
    UserID: object,
    FriendID: object
  ): Promise<string> {
    
    const usersCollection = await users();
    const user = await usersCollection.findOne({
      _id: UserID,
    });
    const friend = await usersCollection.findOne({
      _id: FriendID,
    });

    if (user === null) {
      throw new StatusError(404, 'User not found');
    }

    if (friend === null) {
      throw new StatusError(404, 'Friend not found');
    }

    await usersCollection.updateOne(
      { _id: UserID },
      { $addToSet: { friends: FriendID } }
    );

    return FriendID.toString();
}

export async function unfollow(
    UserID: object,
    FriendID: object
  ): Promise<string> {
    
    const usersCollection = await users();
    const user = await usersCollection.findOne({
      _id: UserID,
    });
    const friend = await usersCollection.findOne({
      _id: FriendID,
    });

    if (user === null) {
      throw new StatusError(404, 'User not found');
    }

    if (friend === null) {
      throw new StatusError(404, 'Friend not found');
    }

    await usersCollection.updateOne(
      { _id: UserID },
      { $pull: { friends: FriendID } }
    );

    return FriendID.toString();
}
