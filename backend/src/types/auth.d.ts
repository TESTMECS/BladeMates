export type User = {
  username: string;
  hashedPassword: string;

  comments: string[];
  favoriteArticles: string[];
  friends: string[];
  trends: string[];
};
