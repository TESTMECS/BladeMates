import ArticlesFeed from "./Articles/ArticlesFeed";
import ListOfTrends from "./ListOfTrends";
import TrendList from "./TrendList";
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
      {currentFeed === "Following" && <TrendList />}
      {currentFeed === "AI" && <p>Showing Articles with AI Trend Tag...</p>}
      {currentFeed === "IoT" && <p>Showing Articles with IoT Trend Tag...</p>}
      {currentFeed === "Blockchain" && (
        <p>Showing Articles with Blockchain Trend Tag...</p>
      )}
      {currentFeed === "ListOfTrends" && (
        <ListOfTrends
          selectedFeed={selectedFeed}
          setSelectedFeed={setSelectedFeed}
        />
      )}
    </div>
  );
};

export default Feed;
