import React from "react";
import { useApi } from "../services/useApi";
import Heading from "../components/Heading";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

const VoiceActorsLayout = ({ id }) => {
  const { data, isLoading, isError, error } = useApi(`/characters/${id}`);

  if (isError) return;
  if (!data?.data?.response.length) return;

  console.log(data);
  const characters = data && data?.data?.response.slice(0, 6);

  return characters ? (
    <main className="mt-5">
      <div className="header flex justify-between items-center">
        <h2 className=" text-base md:text-xl font-extrabold md:ml-5 text-primary">
          Characters & Voice Actors
        </h2>
        <Link to={`/characters/${id}`}>
          <h6 className="text-sm cursor-pointer hover:text-primary flex md:mr-4 items-center gap-1 text-neutral-400">
            <span>View more</span>
            <FaAngleRight />
          </h6>
        </Link>
      </div>
      <div className="grid mt-2 grid-cols-12 gap-2">
        {characters.map((item) => (
          <div
            key={item.id}
            className="wrapper flex p-3 px-1 items-center justify-between bg-lightbg col-span-12 md:col-span-6 2xl:col-span-4"
          >
            <div className="left gap-2 flex items-center">
              <Link to={`/${item.id.replace(":", "/")}`}>
                <div className="poster size-9 overflow-hidden rounded-[50%]">
                  <img
                    className="h-full w-full object-cover"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link to={`/${item.id.replace(":", "/")}`}>
                  <h4 className="text-xs hover:text-primary">{item.name}</h4>
                </Link>
                <span className="text-xs text-lighttext">{item.role}</span>
              </div>
            </div>
            {item.voiceActors.length > 0 && (
              <div className="right flex items-center gap-2">
                <div className="flex items-end flex-col">
                  <Link to={`/${item.voiceActors[0].id.replace(":", "/")}`}>
                    <h4 className="text-xs hover:text-primary">
                      {item.voiceActors[0].name}
                    </h4>
                  </Link>
                  <span className="text-xs text-lighttext">{"japanese"}</span>
                </div>
                <Link to={`/${item.voiceActors[0].id.replace(":", "/")}`}>
                  <div className="poster size-9 rounded-[50%] overflow-hidden">
                    <img
                      className="h-full w-full  object-cover"
                      src={item.voiceActors[0].imageUrl}
                      alt={item.voiceActors[0].name}
                    />
                  </div>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  ) : (
    <Loader />
  );
};

export default VoiceActorsLayout;
