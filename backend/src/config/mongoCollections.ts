import { Collection, OptionalId } from 'mongodb';
import { dbConnection } from './mongoConnection.js';

const getCollectionFn = <T>(collection: string) => {
  let _col: Collection<OptionalId<T>> | undefined = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      if (!db) throw 'Error: cannot connect to db';
      _col = db.collection(collection);
    }

    return _col;
  };
};

/**
 *
 * @param {string} collection
 */
export const dropCollectionFn = async (collection: string) => {
  const db = await dbConnection();
  if (!db) throw 'Error: cannot connect to db';
  await db.dropCollection(collection);
};

// Note: You will need to change the code below to have the collection required by the assignment!

export const comments = getCollectionFn('comments');
export const users = getCollectionFn('users');
