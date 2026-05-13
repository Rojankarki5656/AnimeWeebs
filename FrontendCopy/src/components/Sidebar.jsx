import useSidebarStore from "../store/sidebarStore";
import { Link, useLocation } from "react-router-dom";
import Genres from "./Genres";

import { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";

const Sidebar = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);

  const location = useLocation();
  const key = location.key;

  useEffect(() => {
    isSidebarOpen ? sidebarHandler() : null;
  }, [key]);

  const list = [
    { name: "Home", link: "/home" },
    { name: "Subbed Anime", link: "/animes/subbed-anime" },
    { name: "Dubbed Anime", link: "/animes/dubbed-anime" },
    { name: "Most Popular", link: "/animes/most-popular" },
    { name: "Top Airing", link: "/animes/top-airing" },
    { name: "most favorite", link: "/animes/most-favorite" },
    { name: "latest completed", link: "/animes/completed" },
    { name: "recently added", link: "/animes/recently-added" },
    { name: "recently updated", link: "/animes/recently-updated" },
    { name: "top upcoming", link: "/animes/top-upcoming" },
    { name: "A-Z List", link: "/animes/az-list/a" },
    { name: "Movies", link: "/animes/movie" },
    { name: "OVAs", link: "/animes/ova" },
    { name: "ONAs", link: "/animes/ona" },
    { name: "Specials", link: "/animes/special" },
  ];

  return (
    <div
      className={`sidebar transition-all fixed overflow-scroll h-full z-[100] inset-0 w-64 md:w-80  bg-[rgba(255,255,255,.1);] ${
        isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <button
        className="w-full pt-4 pl-2 flex items-center gap-2 hover:text-primary text-base md:text-xl"
        onClick={sidebarHandler}
      >
        <FaAngleLeft />
        <span>close menu</span>
      </button>
      <ul className="py-4">
        {list.map((item) => (
          <li
            key={item.link}
            onClick={sidebarHandler}
            className=" py-4 pl-4 hover:text-primary  text-base md:text-lg border-b border-[rgba(255,255,255,.05)] w-full"
          >
            <Link to={item.link}>{item.name}</Link>
          </li>
        ))}
        <li className=" py-4 pl-2 text-base md:text-lg w-full">genres</li>
        <Genres
          event={sidebarHandler}
          className="w-1/2 my-2 pl-2 hover:opacity-[.7]"
        />
      </ul>
    </div>
  );
};

export default Sidebar;
