import { users } from "../config/mongoCollections";
import { StatusError } from "../utils/Error";
import { ObjectId } from "mongodb";
import { Notification } from "../types/mongo";
import { PushOperator } from "mongodb";
import { getArticlesByTags, getDocumentByID } from "./articles";
export async function getUserProfileData(userId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  // 5 Recent Comments
  const recentComments = user.comments.slice(-5).map((comment) => {
    return comment;
  });
  const recentArticles = user.favoriteArticles.slice(-5).map((article) => {
    return article;
  });
  // All friends.
  const friends = user.friends.map((friend) => {
    return friend.username;
  });
  const trends = user.trends.map((trend) => {
    return trend;
  });
  const userData = {
    username: user.username,
    recentComments: recentComments,
    recentArticles: recentArticles,
    friends: friends,
    trends: trends,
  };
  return userData;
}
export async function getFavoriteArticles(userId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  return user.favoriteArticles;
}
export async function addNotification(
  type: string,
  userId: string,
  message: string,
) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found in addNotification.");
  }
  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $push: {
        notifications: { type, message, timestamp: new Date().toISOString() },
      } as unknown as PushOperator<Notification>,
    },
  );
}
export async function getNotifications(userId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found in getNotifications");
  }
  console.log("Notifications: ", user.notifications);
  return user.notifications;
}
export async function getUserById(id: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  return user;
}
export async function addTrend(userId: string, trend: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  if (user.trends.includes(trend)) throw "Trend already exists";
  user.trends.push(trend);
  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        trends: user.trends,
      },
    },
  );
  return user.trends;
}
export async function removeTrend(userId: string, trend: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  if (!user.trends.includes(trend)) throw "Trend not found";
  user.trends = user.trends.filter((t) => t !== trend);
  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        trends: user.trends,
      },
    },
  );
  return user.trends;
}
export async function getFollowingFeed(userId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  let articles = (await getArticlesByTags(user.trends))?.map((article: any) => {
    return {
      _id: article?._id,
      title: article?.title,
      author: article?.author,
      publishedAt: article?.publishedAt,
    };
  });
  for (const friend of user.friends) {
    const friendArticles = await getFavoriteArticles(friend._id.toString());
    for (const article of friendArticles) {
      const fullArticle = await getDocumentByID(article);
      articles?.push({
        _id: article,
        title: fullArticle?.title,
        author: fullArticle?.author,
        publishedAt: fullArticle?.publishedAt,
      });
    }
  }
  return articles;
}
export async function getFriends(userId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  const friends = user.friends.map((friend) => {
    return friend._id.toString();
  });
  return friends;
}
export async function checkFriendshipStatus(userId: string, friendId: string) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  const friend = user.friends.find(
    (friend) => friend._id.toString() === friendId,
  );
  return friend !== undefined;
}
