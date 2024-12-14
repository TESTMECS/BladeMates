import { array } from 'zod';
import { dbConnection, closeConnection } from '../src/config/mongoConnection';
import { follow, unfollow } from '../src/data/friend';
import { users } from '../src/config/mongoCollections';
import { ObjectId } from 'mongodb';

(async () => {
  const db = await dbConnection();
  if (!db) {
    throw new Error('Error: No database connection created');
  }

  const usersCollection = await users();

  const idsArray: ObjectId[] = await usersCollection
    .find({}, { projection: { _id: 1 } })
    .map((doc) => doc._id)
    .toArray();

  for (let i = 0; i < idsArray.length; i++) {
    for (let j = 0; j < idsArray.length; j++) {
      if (i !== j) {
        //console.log(await usersCollection.findOne({ _id: idsArray[i] }));
        await follow(idsArray[i].toString(), idsArray[j].toString());
      }
    }
  }

  for (let i = 0; i < idsArray.length; i++) {
    const randomIndex = Math.floor(Math.random() * idsArray.length);
    if (randomIndex !== i) {
      await unfollow(idsArray[i].toString(), idsArray[randomIndex].toString());
    }
  }

  console.log('follow task complete');

  await closeConnection();
})();
