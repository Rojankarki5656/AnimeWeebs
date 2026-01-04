import React from "react";
import { Link } from "react-router-dom";

const MoreSeasons = ({ data }) => {
  return (
    <div className="flex gap-5 mt-5 flex-wrap">
      {data?.map((item) => (
        <Link
          to={`/anime/${item.id}`}
          key={item.id}
          className=" w-[calc(50%-1rem)] sm:w-[calc(180px-1rem)] md:w-[calc(20.66%-1rem)] h-16"
        >
          <div
            className={` ${
              item.isActive
                ? "text-primary border border-primary"
                : "text-white border-none"
            } relative overflow-hidden px-1 rounded-md w-full h-full  flex justify-center items-center`}
          >
            <h1 className="z-20 text-inherit text-center relative line-clamp-2 text-[12px] font-extrabold">
              {item.alternativeTitle}
            </h1>
            <div
              className="absolute opacity-[.3] blur-[2px] z-10 -inset-3 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${item.poster})` }}
            ></div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MoreSeasons;
