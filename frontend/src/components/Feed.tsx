import ArticlesFeed from "./Articles/ArticlesFeed";
import Notifications from "./Notifications";
import FollowingFeed from "./FollowingFeed";
interface FeedProps {
  currentFeed: string;
  selectedFeed: string[];
  setSelectedFeed: (feed: string[]) => void;
}
const Feed: React.FC<FeedProps> = ({ currentFeed = "Discover" }) => {
  return (
    <div>
      {/* Display the ArticlesFeed component if feed is "discover" or default */}
      {currentFeed === "Discover" && <ArticlesFeed />}
      {/* Add other conditional components based on the feed type */}
      {currentFeed === "AI" && <p>Showing Articles with AI Trend Tag...</p>}
      {currentFeed === "IoT" && <p>Showing Articles with IoT Trend Tag...</p>}
      {currentFeed === "Following" && <FollowingFeed />}
      {currentFeed === "Notifications" && <Notifications />}
    </div>
  );
};
export default Feed;
