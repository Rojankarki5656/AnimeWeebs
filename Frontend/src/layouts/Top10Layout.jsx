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
    <div className="mx-2 mt-14">
      <div className="infor flex mb-2 justify-between">
        <Heading className="ml-0">Top 10</Heading>
        <div className="buttons flex bg-lightbg rounded-md">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`${
                selectedTab === tab.name
                  ? "bg-primary  text-black"
                  : "hover:text-primary"
              } px-4 py-1.5 rounded-md `}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="box bg-lightbg px-2 sm:px-4 py-2">
        {topTen?.[selectedTab]?.map((item) => (
          <div key={item.id} className="flex items-center gap-2 sm:gap-5">
            <h1
              className={`rank text-base sm:text-2xl font-extrabold ${
                item.rank <= 3 ? " border-primary border-b-2" : ""
              }`}
            >
              {item.rank < 10 ? `0${item.rank}` : item.rank}
            </h1>
            <MiniPoster item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10Layout;
