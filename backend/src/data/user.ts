import { users } from "../config/mongoCollections";
import { StatusError } from "../utils/Error";
import { ObjectId } from "mongodb";
import * as R from "ramda";
// Get notifications from mongodb
// export async function getNotifications(userId: string) {
//   const usersCollection = await users();
//
//   const user = await usersCollection.findOne({
//     _id: ObjectId.createFromHexString(userId),
//   });
//
//   if (user === null) {
//     throw new StatusError(404, "User not found");
//   }
//
//   // Update user object to have all notifications as read after returning the notifications array
//   let notificationCopy = R.identity(user.notifications);
//   notificationCopy = notificationCopy.map((notification) => {
//     notification.read = true;
//     return notification;
//   });
//
//   await usersCollection.updateOne(
//     {
//       _id: ObjectId.createFromHexString(userId),
//     },
//     {
//       $set: {
//         notifications: notificationCopy,
//       },
//     },
//   );
//
//   return user.notifications.map((notif) => {
//     return {
//       _id: notif._id.toString(),
//       friendId: notif.friendId.toString(),
//       articleId: notif.articleId,
//       read: notif.read,
//     };
//   });
// }

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
    return friend.name;
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
