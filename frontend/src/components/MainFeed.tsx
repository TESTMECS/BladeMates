import { useState } from "react";
import FeedSelector from "./FeedSelector";
import Feed from "./Feed";
import Navbar from "./Navbar";
const MainFeed: React.FC = () => {
  const [currentFeed, setCurrentFeed] = useState<string>("Discover");
  const [selectedFeed, setSelectedFeed] = useState<string[]>([
    "Discover",
    "Following",
  ]);

  return (
    <div className="grid grid-cols-5 h-full">
      <div className="col-span-1 md:fixed md:h-full flex items-center justify-center">
        <Navbar setCurrentFeed={setCurrentFeed} />
      </div>
      <div className="col-span-4 col-start-2 md:border md:border-lightblue md:border-b-0 md:border-t-0">
        {/* Feed Selector */}
        <div className="md:border-b-0">
          <FeedSelector
            currentFeed={currentFeed}
            setCurrentFeed={setCurrentFeed}
            selectedFeed={selectedFeed}
          />
        </div>
        {/* Scrollable Feed */}
        <div className="pt-10 md:border-t md:border-t-gray">
          <Feed
            currentFeed={currentFeed}
            selectedFeed={selectedFeed}
            setSelectedFeed={setSelectedFeed}
          />
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
