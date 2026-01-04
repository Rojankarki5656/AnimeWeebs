import React from "react";
import Genres from "../components/Genres";
import Heading from "../components/Heading";

const GenresLayout = () => {
  return (
    <div className="mb-5">
      <Heading className="mb-2">Genres</Heading>
      <div className="sm:bg-lightbg bg-none rounded-sm px-2 py-1">
        <Genres className="sm:w-1/3 px-2 rounded-sm py-1 mb-2 line-clamp-1 bg-lightbg sm:bg-transparent mx-1 sm:mx-0 text-center font-bold text-lg xl:text-base" />
      </div>
    </div>
  );
};

export default GenresLayout;
