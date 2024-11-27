import { users } from '../config/mongoCollections';
import { validateWithType, StatusError, validate } from '../utils/Error';

import { ObjectId, PushOperator } from 'mongodb';
import { userSchema } from '../validation/user';

import { User } from '../types/mongo';
import { sendNotification } from '../services/rabbitmqProducer';

/**
 * A function that adds a notification to all users who have followed the user with id `userId`
 * @param userId
 * @param articleId
 */
const addNotifications = async (userId: string, articleId: string) => {
  // sendNotification(userId);

  const usersCollection = await users();

  const followers = await usersCollection
    .find({
      friends: { $elemMatch: { _id: new ObjectId(userId) } },
    })
    .toArray();

  for (const follower of followers) {
    const followerData = validateWithType<User>(userSchema, follower, 500);

    const notification = {
      _id: new ObjectId(),
      friendId: new ObjectId(userId),
      articleId: new ObjectId(articleId),
      read: false,
    };

    const insertedInfo = await usersCollection.updateOne(
      {
        _id: followerData._id,
      },
      {
        $push: {
          notifications: notification,
        } as unknown as PushOperator<User>,
      }
    );

    if (insertedInfo.modifiedCount === 0) {
      throw new StatusError(500, 'Failed to add notification');
    }

    sendNotification(followerData._id.toHexString());
  }
};

export async function favoriteArticle(
  userId: string,
  articleId: string
): Promise<string[]> {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  const userData = validateWithType<User>(userSchema, user, 500);

  const favoriteArticles = userData.favoriteArticles;

  const articleExists = favoriteArticles.findIndex(
    (value) => value.toString() === articleId
  );

  if (articleExists === -1) {
    favoriteArticles.push(new ObjectId(articleId));
  } else {
    throw new StatusError(400, 'Article already favorited');
  }

  const insertedInfo = await usersCollection.updateOne(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: {
        favoriteArticles: favoriteArticles,
      },
    }
  );

  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to favorite article');
  }

  addNotifications(userId, articleId);

  return favoriteArticles.map((value) => value.toHexString());
}

export async function unfavoriteArticle(
  userId: string,
  articleId: string
): Promise<string[]> {
  const usersCollection = await users();

  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null) {
    throw new StatusError(404, 'User not found');
  }

  const userData = validateWithType<User>(userSchema, user, 500);

  const favoriteArticles = userData.favoriteArticles;

  const articleExists = favoriteArticles.findIndex(
    (value) => value.toString() === articleId
  );

  if (articleExists === -1) {
    throw new StatusError(400, 'Article not favorited');
  } else {
    favoriteArticles.splice(articleExists, 1);
  }

  const insertedInfo = await usersCollection.updateOne(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: {
        favoriteArticles: favoriteArticles,
      },
    }
  );

  if (insertedInfo.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to unfavorite article');
  }

  return favoriteArticles.map((value) => value.toHexString());
}
