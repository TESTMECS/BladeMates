import { ObjectId, PullOperator, PushOperator } from "mongodb";
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
  // Send following Notification
}
export async function unfollow(
  unfollowerId: string,
  unfolloweeId: string,
): Promise<void> {
  const usersCollection = await users();
  const unfollower = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(unfollowerId),
  });
  const unfollowee = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(unfolloweeId),
  });
  if (unfollower === null) {
    throw new StatusError(404, "User not found");
  }
  if (unfollowee === null) {
    throw new StatusError(404, "Friend not found");
  }
  if (
    unfollower.friends.filter(
      (friends) => friends._id.toString() === unfolloweeId,
    ).length === 0
  ) {
    throw new StatusError(
      400,
      "Can not unfollow a user that has never been followed",
    );
  }
  // remove friend from unfollower
  const insertedInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(unfollowerId) },
    {
      $pull: {
        friends: {
          _id: ObjectId.createFromHexString(unfolloweeId),
        },
      } as unknown as PullOperator<User>,
    },
  );
  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, "Failed to unfollow");
  }
  // remove friend from unfollowee
  const insertedInfo2 = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(unfolloweeId) },
    {
      $pull: {
        friends: {
          _id: ObjectId.createFromHexString(unfollowerId),
        },
      } as unknown as PullOperator<User>,
    },
  );
  if (insertedInfo2.modifiedCount === 0) {
    throw new StatusError(500, "Failed to unfollow");
  }
  // send notification to the person being unfollowed.
}
