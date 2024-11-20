import { useState } from "react";
import FeedSelector from "./FeedSelector";
import Feed from "./Feed";
import Navbar from "./Navbar";
import FeedType from "../types/Feed";
const MainFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedType>("Discover");
  const [selectedFeed, setSelectedFeed] = useState<FeedType[]>([
    "Discover",
    "Following",
  ]);
  return (
    <div className="grid grid-cols-5 h-screen text-white">
      <div className="col-span-1 md:fixed md:h-full flex items-center justify-center">
        <Navbar setFeed={setFeed} />
      </div>
      <div className="col-span-4 col-start-2 md:border md:border-[highlight] md:border-b-0 md:border-t-0">
        {/* Feed Selector */}
        <div className="md:border-b-0">
          <FeedSelector
            feed={feed}
            setFeed={setFeed}
            selectedFeed={selectedFeed}
          />
        </div>
        {/* Scrollable Feed */}
        <div className="pt-10 md:border-t md:border-t-[highlight2]">
          <Feed feed={feed} setSelectedFeed={setSelectedFeed} />
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
