import { Collection } from 'mongodb';
import { dbConnection } from './mongoConnection.js';

/**
 *
 * @param {string} collection
 * @returns {() => Promise<Collection<import('mongodb').Document>>}
 */
const getCollectionFn = (collection: string) => {
  let _col: Collection<Document> | undefined = undefined;

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

export default {
  comments: getCollectionFn('comments'),
  users: getCollectionFn('users'),
};
