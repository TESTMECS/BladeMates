import { Db, MongoClient } from 'mongodb';
import { mongoConfig } from './settings';

let _connection: MongoClient | undefined = undefined;
let _db: Db | undefined = undefined;

/**
 *
 * @returns {Promise<Db>}
 */
const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  if (_connection) await _connection.close();
  else throw 'Mongo Connection not found';
};

export { dbConnection, closeConnection };
