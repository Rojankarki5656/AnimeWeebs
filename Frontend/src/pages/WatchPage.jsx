import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";
import { Helmet } from "react-helmet";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");

  const ep = searchParams.get("ep");

  const { data, isError } = useApi(`/episodes/${id}`);
  const episodes = data?.data;

  const updateParams = (newParam) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("ep", newParam);
      return newParams;
    });
  };
  // Update document title

  // Auto-redirect to first episode if no `ep` param exists
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const ep = episodes[0].id.split("ep=").pop();
      updateParams(ep);
    }
  }, [ep, episodes, setSearchParams]);

  if (isError) {
    return <PageNotFound />;
  }

  if (!episodes) {
    return <Loader className="h-screen" />;
  }

  const currentEp =
    episodes &&
    ep !== null &&
    episodes.find((e) => e.id.split("ep=").pop() === ep);

  const changeEpisode = (action) => {
    if (action === "next") {
      const nextEp = episodes[currentEp.episodeNumber - 1 + 1];
      if (!nextEp) return;
      updateParams(nextEp.id.split("ep=").pop());
    } else {
      const prevEp = episodes[currentEp.episodeNumber - 1 - 1];
      if (!prevEp) return;
      updateParams(prevEp.id.split("ep=").pop());
    }
  };

  const hasNextEp = Boolean(episodes[currentEp.episodeNumber - 1 + 1]);
  const hasPrevEp = Boolean(episodes[currentEp.episodeNumber - 1 - 1]);

  return (
    /* WatchPage.js */
    <div className="bg-backGround pt-14 max-w-screen-xl mx-auto py-2 md:px-2">
      <Helmet>
        <title>
          Watch {id.split("-").slice(0, 2).join(" ")} Online, Free Anime
          Streaming Online on Watanuki Anime Website
        </title>
        <meta property="og:title" content="watch - watanuki" />
      </Helmet>
      <div className="flex flex-col gap-2">
        <div className="path flex mb-2 mx-2 items-center gap-2 text-base ">
          <Link className="" to="/home">
            <h4 className="hover:text-primary">home</h4>
          </Link>
          <span className="h-1 w-1 rounded-full bg-primary"></span>
          <Link to={`/anime/${id}`}>
            <h4 className="hover:text-primary">
              {id.split("-").slice(0, 2).join(" ")}
            </h4>
          </Link>
          <span className="h-1 w-1 rounded-full bg-primary"></span>
          <h4 className="gray">{`episode ${currentEp.episodeNumber}`}</h4>
        </div>
        {ep && id && (
          <Player
            id={id}
            episodeId={`${id}?ep=${ep}`}
            currentEp={currentEp}
            changeEpisode={changeEpisode}
            hasNextEp={hasNextEp}
            hasPrevEp={hasPrevEp}
          />
        )}
        <div className="input w-full mt-2 flex items-end justify-end gap-3 text-end">
          <div className="btns bg-btnbg flex mx-2 rounded-child">
            <button
              className={`row item p-2 ${
                layout === "row" ? "bg-primary text-black" : undefined
              }`}
              onClick={() => setLayout("row")}
            >
              <MdTableRows size={"20px"} />
            </button>
            <button
              className={`column item p-2 ${
                layout === "column" ? "bg-primary text-black" : undefined
              }`}
              onClick={() => setLayout("column")}
            >
              <HiMiniViewColumns size={"20px"} />
            </button>
          </div>
        </div>
        <ul
          className={`episodes max-h-[50vh] py-4 px-2 overflow-scroll bg-lightbg grid gap-1  md:gap-2 ${
            layout === "row"
              ? " grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : " grid-cols-5 md:grid-cols-10"
          }`}
        >
          {episodes?.map((episode) => (
            <Episodes
              key={episode.id}
              episode={episode}
              currentEp={currentEp}
              layout={layout}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WatchPage;
