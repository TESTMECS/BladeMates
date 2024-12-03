export type Notification = {
  _id: ObjectId;
  friendId: ObjectId;
  articleId: ObjectId;
  read: boolean;
};

export type User = {
  _id: ObjectId;
  username: string;
  hashedPassword: string;

  comments: ObjectId[];
  favoriteArticles: ObjectId[];
  friends: { _id: ObjectId; name: string }[];
  trends: string[];
  notifications: Notification[];
};

export type UserOptionalId = Omit<User, '_id'> & Partial<Pick<User, '_id'>>;
