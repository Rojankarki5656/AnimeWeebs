import React from "react";
import { Link } from "react-router-dom";

const AZ = ({ selected }) => {
  console.log(selected);

  selected = selected === null ? "All" : selected;
  const azList = [
    { title: "ALL", link: "/animes/az-list" },
    { title: "#", link: "/animes/az-list/other" },
    { title: "0-9", link: "/animes/az-list/0-9" },
    { title: "A", link: "/animes/az-list/A" },
    { title: "B", link: "/animes/az-list/B" },
    { title: "C", link: "/animes/az-list/C" },
    { title: "D", link: "/animes/az-list/D" },
    { title: "E", link: "/animes/az-list/E" },
    { title: "F", link: "/animes/az-list/F" },
    { title: "G", link: "/animes/az-list/G" },
    { title: "H", link: "/animes/az-list/H" },
    { title: "I", link: "/animes/az-list/I" },
    { title: "J", link: "/animes/az-list/J" },
    { title: "K", link: "/animes/az-list/K" },
    { title: "L", link: "/animes/az-list/L" },
    { title: "M", link: "/animes/az-list/M" },
    { title: "N", link: "/animes/az-list/N" },
    { title: "O", link: "/animes/az-list/O" },
    { title: "P", link: "/animes/az-list/P" },
    { title: "Q", link: "/animes/az-list/Q" },
    { title: "R", link: "/animes/az-list/R" },
    { title: "S", link: "/animes/az-list/S" },
    { title: "T", link: "/animes/az-list/T" },
    { title: "U", link: "/animes/az-list/U" },
    { title: "V", link: "/animes/az-list/V" },
    { title: "W", link: "/animes/az-list/W" },
    { title: "X", link: "/animes/az-list/X" },
    { title: "Y", link: "/animes/az-list/Y" },
    { title: "Z", link: "/animes/az-list/Z" },
  ];
  return (
    <div className="list w-full mb-2 px-2 flex gap-2 flex-wrap justify-center items-center">
      {azList.map((item) => (
        <Link to={item.link} key={item.title}>
          <button
            className={`px-2 py-1 bg-lightbg text-[14px] hover:bg-primary hover:text-black rounded-sm font-bold mb-1 ${
              selected && selected.toUpperCase() === item.title
                ? "bg-primary text-black"
                : ""
            }`}
            key={item.title}
          >
            {item.title}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default AZ;
