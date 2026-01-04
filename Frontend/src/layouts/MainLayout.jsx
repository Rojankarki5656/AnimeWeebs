/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Image from "../components/Image";
import { FaAngleRight } from "react-icons/fa";

const MainLayout = ({ title, data, endpoint }) => {
  return (
    <div className="pb-5">
      <div className="header flex justify-between">
        <Heading>{title}</Heading>
        <Link to={`/animes/${endpoint}`}>
          <h6 className="text-sm hover:text-primary flex mr-4 items-center gap-1 text-neutral-400">
            <span>View more</span>
            <FaAngleRight />
          </h6>
        </Link>
      </div>
      <div className="wrapper flex justify-around flex-wrap h-full w-full">
        {data &&
          data.map((item) => (
            <div key={item.id} className="flw-item bg-lightbg">
              <Image data={item} key={item.id} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainLayout;
