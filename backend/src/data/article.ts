import { users } from '../config/mongoCollections';
import { validateWithType, StatusError, validate } from '../utils/Error';

import { ObjectId } from 'mongodb';
import { userSchema } from '../validation/user';

import { User } from '../types/mongo';

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

  return favoriteArticles.map((value) => value.toHexString());
}
