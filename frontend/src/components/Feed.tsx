import ArticlesFeed from "./Articles/ArticlesFeed";
import ListOfTrends from "./ListOfTrends";
import FollowingFeed from "./FollowingFeed";
import Notifications from "./Notifications";
interface FeedProps {
  currentFeed: string;
  selectedFeed: string[];
  setSelectedFeed: (feed: string[]) => void;
}
const Feed: React.FC<FeedProps> = ({
  currentFeed = "Discover",
  selectedFeed,
  setSelectedFeed,
}) => {
  // TODO: add rendering based on the feed type
  return (
    <div>
      {/* Display the ArticlesFeed component if feed is "discover" or default */}
      {currentFeed === "Discover" && <ArticlesFeed />}
      {/* Add other conditional components based on the feed type */}
      {currentFeed === "Following" && <FollowingFeed />}
      {currentFeed === "ListOfTrends" && (
        <ListOfTrends
          selectedFeed={selectedFeed}
          setSelectedFeed={setSelectedFeed}
        />
      )}
      {currentFeed === "Notifications" && <Notifications />}
    </div>
  );
};

export default Feed;
