import Article from "./Article";
import Comment from "./Comment";
import Trends from "./Trends";
type User = {
  id: number;
  name: string;
  username: string;
  bio?: string;
  profileImage: string;
  favoriteArticles?: Article[];
  comments?: Comment[];
  friends?: User[];
  Trends?: Trends[];
  // Notifications: Notifications[]; maybe use this later
};
export default User;
