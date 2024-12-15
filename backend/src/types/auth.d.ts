export type User = {
  username: string;
  hashedPassword: string;

  comments: string[];
  favoriteArticles: string[];
  friends: User[];
  trends: string[];
};
