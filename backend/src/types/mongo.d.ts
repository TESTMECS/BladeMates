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

export type Comment = {
  _id: ObjectId;
  articleId: ObjectId;
  userId: ObjectId;

  username: string;
  content: string;
  datePosted: string;
};

export type UserOptionalId = Omit<User, '_id'> & Partial<Pick<User, '_id'>>;

export type CommentOptionalId = Omit<Comment, '_id'> &
  Partial<Pick<Comment, '_id'>>;
