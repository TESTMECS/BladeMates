import FeedType from "../types/Feed";
import Trends from "../types/Trends";

interface ListOfTrendsProps {
  setSelectedFeed: (feed: FeedType[]) => void;
}

const ListOfTrends: React.FC<ListOfTrendsProps> = ({ setSelectedFeed }) => {
  const handleClick = (selection: string) => {
    // weird workaround right now TODO: fix this
    const defaultTypes: FeedType[] = ["Discover", "Following"];
    if (selection === "AI") {
      defaultTypes.push(Trends.AI);
    }
    if (selection === "Blockchain") {
      defaultTypes.push(Trends.BLOCKCHAIN);
    }
    if (selection === "IoT") {
      defaultTypes.push(Trends.IoT);
    }
    setSelectedFeed(defaultTypes);
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select a Trend to Follow:</h2>
      <div className="space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => handleClick("AI")}
        >
          AI
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => handleClick("Blockchain")}
        >
          Blockchain
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
          onClick={() => handleClick("IoT")}
        >
          IoT
        </button>
      </div>
    </div>
  );
};

export default ListOfTrends;
