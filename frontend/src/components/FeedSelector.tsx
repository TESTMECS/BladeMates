import React from "react";
import FeedType from "../types/Feed";

import { Link } from "react-router-dom";

interface FeedSelectorProps {
  feed: FeedType;
  setFeed: (feed: FeedType) => void;
  selectedFeed: FeedType[];
}

const FeedSelector: React.FC<FeedSelectorProps> = ({
  feed,
  setFeed,
  selectedFeed,
}) => {
  return (
    <div className="flex justify-center items-center flex-col p-4 rounded-lg shadow-lg">
      <Link
        to="/home"
        className="flex items-center hover:text-indigo-500 px-3 py-2 pb-2 rounded-md text-lg font-semibold transition-colors duration-200"
      >
        LOGO HERE
      </Link>
      <div className="flex justify-center space-x-4">
        {selectedFeed.map((type) => (
          <button
            key={type}
            onClick={() => setFeed(type as FeedType)}
            className={`px-6 py-2 text-lg rounded-full transition-colors duration-300 ${
              feed === type
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-300"
            } hover:bg-cyan-400 hover:text-white`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedSelector;
