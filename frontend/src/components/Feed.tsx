import FeedType from "../types/Feed";
import ArticlesFeed from "./ArticlesFeed";
import ListOfTrends from "./ListOfTrends";
import TrendList from "./TrendList";
interface FeedProps {
  feed: FeedType;
  setSelectedFeed: (feed: FeedType[]) => void;
}
const Feed: React.FC<FeedProps> = ({ feed = "Discover", setSelectedFeed }) => {
  return (
    <div>
      {/* Display the ArticlesFeed component if feed is "discover" or default */}
      {feed === "Discover" && <ArticlesFeed />}
      {/* Add other conditional components based on the feed type */}
      {feed === "Following" && <TrendList />}
      {feed === "AI" && <p>Showing Articles with AI Trend Tag...</p>}
      {feed === "IoT" && <p>Showing Articles with IoT Trend Tag...</p>}
      {feed === "Blockchain" && (
        <p>Showing Articles with Blockchain Trend Tag...</p>
      )}
      {feed === "ListOfTrends" && (
        <ListOfTrends setSelectedFeed={setSelectedFeed} />
      )}
    </div>
  );
};

export default Feed;
