import React, { useState } from "react";
import useTopTenStore from "../store/toptenStore";
import MiniPoster from "../components/MiniPoster";
import Heading from "../components/Heading";

const Top10Layout = () => {
  const [selectedTab, setSelectedTab] = useState("today");
  const tabs = [{ name: "today" }, { name: "week" }, { name: "month" }];
  const topTen = useTopTenStore((state) => state.topTen);

  const handleTabChange = (name) => {
    selectedTab !== name ? setSelectedTab(name) : null;
  };

  return (
    <div className="w-full">
      {/* Header with tabs - removed margins and made compact */}
      <div className="flex items-center justify-between mb-4">
        <Heading className="text-lg font-bold text-white">Top 10</Heading>
        
        {/* Compact tab buttons */}
        <div className="flex bg-gray-800/70 rounded-md p-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedTab === tab.name
                  ? "bg-gray-700 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Compact content box */}
      <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-3">
        {topTen?.[selectedTab]?.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800/30 transition-colors mb-2 last:mb-0"
          >
            {/* Rank indicator - compact */}
            <div className="flex-shrink-0">
              <div className={`
                w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold
                ${item.rank <= 3 
                  ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white" 
                  : "bg-gray-800 text-gray-300"
                }
              `}>
                {item.rank < 10 ? `0${item.rank}` : item.rank}
              </div>
            </div>
            
            {/* Anime content */}
            <div className="flex-1 min-w-0">
              <MiniPoster item={item} compact={true} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10Layout;