import React from "react";
import { useApi } from "../services/useApi";
import PageNotFound from "../pages/PageNotFound";
import Loader from "../components/Loader";
import Image from "../components/Image";
import Heading from "../components/Heading";

const Recommended = ({ data }) => {
  return (
    <>
      <div className="mt-10">
        <Heading>Recommended for you</Heading>
        <div className="recommendation flex justify-around flex-wrap h-full w-full">
          {data.map((item, index) => (
            <div key={item.id} className="flw-item">
              <Image data={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Recommended;
