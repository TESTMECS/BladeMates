import Article from "./Article";
import Comment from "./Comment";
import Trends from "./Trends";
export type User = {
  id: string;
  name: string;
  username: string;
  bio?: string;
  profileImage: string;
  favoriteArticles?: Article[];
  comments?: Comment[];
  friends?: { _id: string; username: string }[];
  Trends?: Trends[];
  // Notifications: Notifications[]; maybe use this later
};
