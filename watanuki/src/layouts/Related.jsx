/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useApi } from "../services/useApi";
import PageNotFound from "../pages/PageNotFound";
import Loader from "../components/Loader";
import DynamicLayout from "./DynamicLayout";
import MiniPoster from "../components/MiniPoster";
import Heading from "../components/Heading";

const Related = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const initialItems = 10;
  const hasMore = data.length > 10;

  const displayedData = showAll ? data : data?.slice(0, initialItems);

  return (
    <>
      <div className="mb-5">
        <Heading>Related</Heading>
        <div className="related bg-lightbg px-2 py-2 mt-2 rounded-md">
          {displayedData.map((item, index) => (
            <div key={item.id + index} className="related">
              <MiniPoster item={item} />
            </div>
          ))}
          {hasMore && (
            <button
              className="w-full bg-btnbg text-white py-2 font-bold rounded-md"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "show less" : "show more"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Related;
