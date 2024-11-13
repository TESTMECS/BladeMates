import { dbConnection, closeConnection } from '../src/config/mongoConnection';
import { register } from '../src/data/auth';


(async () => {
  const db = await dbConnection();
  if (!db) {
    throw new Error('Error: No database connection created');
  }

  await db.dropDatabase();

  for (let i = 0; i < 10; i++) {
    const res = await register(`User${i}`, `Password@${i}`);
  }

  console.log('Seed complete');

  await closeConnection();
})();

