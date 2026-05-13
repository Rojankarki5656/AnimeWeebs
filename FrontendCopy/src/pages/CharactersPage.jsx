import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import Pagination from "../components/Pagination";

const CharactersPage = () => {
  const { id } = useParams();

  const { data, isError, error, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteApi(`/characters/${id}?page=`);

  const pages = data?.pages;
  return (
    <>
      <main className="pt-14 pb-5 mx-auto max-w-[800px]">
        {pages && !isLoading ? (
          <>
            <Heading>charcters and voice actors</Heading>
            <div className="grid mb-4 mx-1 mt-2 grid-cols-12 gap-2">
              {pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.response.map((item) => (
                    <div
                      key={item.id}
                      className="wrapper flex px-1 py-3 rounded-sm items-center justify-between bg-lightbg col-span-12 "
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
                          <Link to={`/${item.id.replaceAll(":", "/")}`}>
                            <h4 className="text-xs hover:text-primary">
                              {item.name}
                            </h4>
                          </Link>
                          <span className="text-xs text-lighttext">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <div className="right flex items-center gap-2">
                        {item.voiceActors.length !== 0 &&
                          item.voiceActors.map((actor) => (
                            <React.Fragment key={actor.id}>
                              <Link to={`/${actor.id.replace(":", "/")}`}>
                                <div
                                  title={actor.name}
                                  className="poster size-9 rounded-[50%] overflow-hidden"
                                >
                                  <img
                                    loading="lazy"
                                    className="h-full w-full object-center  object-cover"
                                    src={actor.imageUrl}
                                    alt={actor.name}
                                  />
                                </div>
                              </Link>
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            {hasNextPage && (
              <button
                onClick={fetchNextPage}
                className="bg-lightbg mx-auto py-3 w-full hover:text-primary"
              >
                Load More
              </button>
            )}
          </>
        ) : (
          <Loader className="h-[100dvh]" />
        )}
        {/* <Pagination /> */}
      </main>
      <Footer />
    </>
  );
};

export default CharactersPage;
