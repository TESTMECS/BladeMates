export type User = {
  _id: ObjectId;
  username: string;
  hashedPassword: string;
  comments: ObjectId[];
  favoriteArticles: string[];
  friends: { _id: ObjectId; username: string }[];
  trends: string[];
};

export type Comment = {
  _id: ObjectId;
  articleId: string;
  userId: ObjectId;

  username: string;
  content: string;
  datePosted: string;
};

export type UserOptionalId = Omit<User, "_id"> & Partial<Pick<User, "_id">>;

export type CommentOptionalId = Omit<Comment, "_id"> &
  Partial<Pick<Comment, "_id">>;
