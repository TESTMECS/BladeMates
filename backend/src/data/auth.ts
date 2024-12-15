import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections";
import { StatusError } from "../utils/Error";
// There is no need to check parameter for error because typescript checks it for us. The only time we need to check parameter for error if it is a runtime type error (e.g. user entering wrong values) instead of a type error that occurs during development (since typescript guards against that).
export async function login(
  username: string,
  password: string,
): Promise<string> {
  const encryptedPassword = await bcrypt.hash(password, 10);

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    username: username,
  });
  if (
    user === null ||
    (await bcrypt.compare(password, user.hashedPassword)) === false
  ) {
    console.error(user?.hashedPassword, encryptedPassword);
    throw new StatusError(404, "Invalid username or password");
  }
  return user._id.toString();
}
export async function register(
  username: string,
  password: string,
): Promise<string> {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const usersCollection = await users();
  const existingUser = await usersCollection.findOne({ username: username });
  if (existingUser !== null) {
    throw new StatusError(400, "User already exists");
  }
  const newUser = {
    username: username,
    hashedPassword: encryptedPassword,
    comments: [],
    favoriteArticles: [],
    friends: [],
    trends: [],
    notifications: [],
  };
  const insertedInfo = await usersCollection.insertOne(newUser);
  return insertedInfo.insertedId.toString();
}

export async function getUsernameFromId(userId: string): Promise<string> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  return user.username;
}
export async function getFriendsFromId(
  userId: string,
): Promise<{ _id: string; username: string }[]> {
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });
  if (user === null) {
    throw new StatusError(404, "User not found");
  }
  return user.friends;
}
