export type Notification = {
  _id: string;
  friendId: string;
  articleId: string;
  read: boolean;
};

export type User = {
  username: string;
  hashedPassword: string;

  comments: string[];
  favoriteArticles: string[];
  friends: User[];
  trends: string[];
  notifications: Notification[];
};
