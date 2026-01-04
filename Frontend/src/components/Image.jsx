/* eslint-disable react/prop-types */
import SoundsInfo from "../components/SoundsInfo";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Image = ({ data }) => {
  return (
    <div>
      <Link to={`/anime/${data.id}`}>
        <div className="film-poster md:hover:opacity-[.7] transition-all rounded-sm w-full h-full pb-[140%] mb-2 relative overflow-hidden bg-[#545454] block">
          <div className="z-50 opacity-[.9] absolute bottom-0 left-0">
            <SoundsInfo episodes={data.episodes} />
          </div>
          <LazyLoadImage
            className="absolute h-full w-full inset-0 object-cover object-center"
            wrapperClassName="h-full w-full absolute"
            effect="blur"
            src={data.poster}
            alt={data.title}
          />
        </div>
      </Link>
      <Link to={`/anime/${data.id}`}>
        <div
          title={data.title}
          className="title line-clamp-1 text-sm md:text-base hover:text-primary"
        >
          <h1>{data.title}</h1>
        </div>
      </Link>
      {data.type && (
        <div className="type flex gray gap-3 items-center text-sm">
          <h4>{data.type}</h4>
          <div className="h-1 w-1 bg-primary rounded-full"></div>
          <h4>{data.duration}</h4>
        </div>
      )}
    </div>
  );
};

export default Image;
