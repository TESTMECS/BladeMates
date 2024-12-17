export type Notification = {
  type: string;
  followerId?: string;
  followeeId?: string;
  timestamp: string;
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
