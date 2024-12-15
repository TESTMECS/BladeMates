import { ObjectId, PullOperator, PushOperator } from "mongodb";
import { sendNotification } from "../services/rabbitmqProducer";
import { users } from "../config/mongoCollections";
import { StatusError } from "../utils/Error";
import { User } from "../types/mongo";

export async function follow(
  followeeId: string,
  followerId: string,
): Promise<void> {
  const usersCollection = await users();
  const followee = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(followeeId),
  });
  const follower = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(followerId),
  });
  if (followee === null) {
    throw new StatusError(404, "User not found");
  }
  if (follower === null) {
    throw new StatusError(404, "User to follow does not exist");
  }
  if (followeeId === followerId) {
    throw new StatusError(400, "Cannot follow yourself");
  }
  if (
    followee.friends.filter((friends) => friends._id.toString() === followerId)
      .length > 0
  ) {
    throw new StatusError(400, "Already following user");
  }
  const insertedInfo = await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(followeeId),
    },
    {
      $push: {
        friends: {
          _id: ObjectId.createFromHexString(followerId),
          username: follower.username,
        },
      } as unknown as PushOperator<User>,
    },
  );
  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, "Failed to add follow");
  }
  const insertedInfo2 = await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(followerId),
    },
    {
      $push: {
        friends: {
          _id: ObjectId.createFromHexString(followeeId),
          username: followee.username,
        },
      } as unknown as PushOperator<User>,
    },
  );
  if (insertedInfo2.modifiedCount === 0) {
    throw new StatusError(500, "Failed to add follow");
  }
  // sendNotification(followerId, `${userId} followed ${userToFollow}!`);
}

export async function unfollow(
  userId: string,
  friendId: string,
): Promise<void> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  const friend = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(friendId),
  });

  if (user === null) {
    throw new StatusError(404, "User not found");
  }

  if (friend === null) {
    throw new StatusError(404, "Friend not found");
  }

  if (
    user.friends.filter((friends) => friends._id.toString() === friendId)
      .length === 0
  ) {
    throw new StatusError(
      400,
      "Can not unfollow a user that has never been followed",
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
    },
  );

  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, "Failed to unfollow");
  }

  console.log(`Unfollowed ${friendId}`);
}
