import { users } from "../config/mongoCollections";
import { validateWithType, StatusError, validate } from "../utils/Error";
import { ObjectId, PushOperator } from "mongodb";
import { userSchema } from "../validation/user";
import { User } from "../types/mongo";
import { sendNotification } from "../services/rabbitmqProducer";
/**
 * A function that adds a notification to all users who have followed the user with id `userId`
 * @param userId
 * @param articleId
 */
const addNotifications = async (userId: string, articleId: string) => {
  sendNotification(userId, `${userId} favorited ${articleId}!`);
  const usersCollection = await users();
  const followers = await usersCollection
    .find({
      friends: { $elemMatch: { _id: new ObjectId(userId) } },
    })
    .toArray();
  // const notification = {
  //   _id: new ObjectId(),
  //   friendId: new ObjectId(userId),
  //   articleId: articleId,
  //   read: false,
  // };
  const followerIds = followers.map((follower) => follower._id);
  if (followerIds.length === 0) {
    return;
  }
  // const insertedInfo = await usersCollection.updateMany(
  //   {
  //     _id: { $in: followerIds },
  //   },
  //   {
  //     $push: {
  //       notifications: notification,
  //     } as unknown as PushOperator<User>,
  //   },
  // );
  // if (insertedInfo.modifiedCount === 0) {
  //   throw new StatusError(500, "Failed to add notifications to database.");
  // }
  for (const follower of followers) {
    console.log("Sending notification to", follower._id.toHexString());
    sendNotification(
      follower._id.toHexString(),
      `${userId} favorited ${articleId}!`,
    );
  }
};
export async function favoriteArticle(
  userId: string,
  articleId: string,
): Promise<string[]> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  const userData = validateWithType<User>(userSchema, user, 500);
  const favoriteArticles = userData.favoriteArticles;
  const articleExists = favoriteArticles.findIndex(
    (value) => value === articleId,
  );
  if (articleExists === -1) {
    favoriteArticles.push(articleId);
  } else {
    throw new StatusError(400, "Article already favorited");
  }
  const insertedInfo = await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        favoriteArticles: favoriteArticles,
      },
    },
  );
  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, "Failed to favorite article");
  }
  addNotifications(userId, articleId);
  return favoriteArticles;
}
export async function unfavoriteArticle(
  userId: string,
  articleId: string,
): Promise<string[]> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  const userData = validateWithType<User>(userSchema, user, 500);
  const favoriteArticles = userData.favoriteArticles;
  const articleExists = favoriteArticles.findIndex(
    (value) => value === articleId,
  );
  if (articleExists === -1) {
    throw new StatusError(400, "Article not favorited");
  } else {
    favoriteArticles.splice(articleExists, 1);
  }
  const insertedInfo = await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        favoriteArticles: favoriteArticles,
      },
    },
  );
  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, "Failed to unfavorite article");
  }

  return favoriteArticles;
}
