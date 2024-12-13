import { users } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';
import { ObjectId } from 'mongodb';


import * as R from 'ramda';
import { getArticlesByTags, getDocumentByID } from './articles';

export async function getNotifications(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
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
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        notifications: notificationCopy,
      },
    }
  );

  return user.notifications.map((notif) => {
    return {
      _id: notif._id.toString(),
      friendId: notif.friendId.toString(),
      articleId: notif.articleId.toString(),
      read: notif.read,
    };
  });
}

export async function getUserProfileData(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }
  // 5 Recent Comments
  const recentComments = user.comments.slice(-5).map((comment) => {
    return comment
  });
  const recentArticles = user.favoriteArticles.slice(-5).map((article) => {
    return article
  });
  // All friends. 
  const friends = user.friends.map((friend) => {
    return friend.name
  });
  const trends = user.trends.map((trend) => {
    return trend
  });
  const userData = {
    username: user.username,
    recentComments: recentComments,
    recentArticles: recentArticles,
    friends: friends,
    trends: trends
  }
  return userData;
}

export async function getFavoriteArticles(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  return user.favoriteArticles.map((article) => {
    return article;
  });
}

export async function getUserById(id: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  return user;
}

export async function addTrend(userId: string, trend: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  if (user.trends.includes(trend))
    throw 'Trend already exists';

  user.trends.push(trend);

  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        trends: user.trends,
      },
    }
  );

  return user.trends;
}

export async function removeTrend(userId: string, trend: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  if (!user.trends.includes(trend))
    throw 'Trend not found';

  user.trends = user.trends.filter((t) => t !== trend);

  await usersCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(userId),
    },
    {
      $set: {
        trends: user.trends,
      },
    }
  );

  return user.trends;
}

export async function getFollowingFeed(userId: string) {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  let articles = (await getArticlesByTags(user.trends))?.map((article) => {
    return {
      _id: article?._id,
      title: article?.title,
      author: article?.author,
      publishedAt: article?.publishedAt
    }
  });

  for (const friend of user.friends) {
    const friendArticles = await getFavoriteArticles(friend._id.toString());

    for (const article of friendArticles) {
      const fullArticle = await getDocumentByID(article);
      articles?.push({
        _id: article,
        title: fullArticle?.title,
        author: fullArticle?.author,
        publishedAt: fullArticle?.publishedAt
      });
    }
  }

  return articles;
}