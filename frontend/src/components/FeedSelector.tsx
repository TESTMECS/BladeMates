import { Link } from "react-router-dom";
interface FeedSelectorProps {
  currentFeed: string;
  setCurrentFeed: (feed: string) => void;
  selectedFeed: string[];
}

const FeedSelector: React.FC<FeedSelectorProps> = ({
  currentFeed,
  setCurrentFeed,
  selectedFeed,
}) => {
  return (
    <div className="flex justify-center items-center flex-col rounded-lg shadow-lg">
      <Link
        to="/home"
        className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 pb-2 rounded-md text-lg font-semibold transition-colors duration-200"
      >
        LOGO HERE
      </Link>
      <div className="flex justify-center space-x-4">
        {selectedFeed.map((type) => (
          <button
            key={type}
            onClick={() => setCurrentFeed(type)}
            className={`px-6 py-2 text-lg rounded-full transition-colors duration-300 ${
              currentFeed === type
                ? "bg-lightpink text-black dark:bg-purple dark:text-white"
                : " text-gray"
            } hover:bg-lightblue dark:hover:bg-green hover:text-white `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedSelector;
