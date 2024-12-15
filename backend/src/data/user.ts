import { users } from "../config/mongoCollections";
import { StatusError } from "../utils/Error";
import { ObjectId } from "mongodb";

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
