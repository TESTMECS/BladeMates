import Trends from "../types/Trends";
interface ListOfTrendsProps {
  selectedFeed: string[];
  setSelectedFeed: (feed: string[]) => void;
}
const ListOfTrends: React.FC<ListOfTrendsProps> = ({
  selectedFeed,
  setSelectedFeed,
}) => {
  const handleClick = (selection: string) => {
    if (selection === "AI" && !selectedFeed.includes(Trends.AI)) {
      setSelectedFeed(selectedFeed.concat(Trends.AI));
    }
    if (
      selection === "Blockchain" &&
      !selectedFeed.includes(Trends.BLOCKCHAIN)
    ) {
      setSelectedFeed(selectedFeed.concat(Trends.BLOCKCHAIN));
    }
    if (selection === "IoT" && !selectedFeed.includes(Trends.IOT)) {
      setSelectedFeed(selectedFeed.concat(Trends.IOT));
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select a Trend to Follow:</h2>
      <div className="space-x-2">
        <button
          className="px-4 py-2 bg-lightblue text-white rounded hover:bg-blue-700"
          onClick={() => handleClick("AI")}
        >
          AI
        </button>
        <button
          className="px-4 py-2 bg-green text-white rounded hover:bg-green-700"
          onClick={() => handleClick("Blockchain")}
        >
          Blockchain
        </button>
        <button
          className="px-4 py-2 bg-purple text-white rounded hover:bg-purple-700"
          onClick={() => handleClick("IoT")}
        >
          IoT
        </button>
      </div>
    </div>
  );
};

export default ListOfTrends;
