/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import SoundsInfo from "./SoundsInfo";

const MiniPoster = ({ item }) => {
  return (
    <div key={item.id} className="flex  border-lightBg pb-3 items-center gap-4">
      <Link className="" to={`/anime/${item.id}`}>
        <div className="poster bg-white rounded-md flex-shrink-0 relative overflow-hidden w-16 pb-[85px]">
          <img
            className="h-full absolute w-full object-cover object-center"
            src={item.poster}
            alt={item.title}
            loading="lazy"
          />
        </div>
      </Link>
      <div className="text">
        <Link to={`/anime/${item.id}`}>
          <h2 className="title hover:text-primary mb-2 font-bold">
            {item.title}
          </h2>
        </Link>
        <div className="item">
          <SoundsInfo episodes={item.episodes} />
          {item.type && (
            <>
              <span className="block mx-1 h-1 w-1 bg-primary rounded-full"></span>
              <h2 className="text-[12px] text-[#ccc]">{item.type}</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniPoster;
