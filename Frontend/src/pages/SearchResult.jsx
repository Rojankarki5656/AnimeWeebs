import React from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import Heading from "../components/Heading";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "../components/Image";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteApi(`/search?keyword=${keyword}&page=`);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <h1 className="font-bold text-2xl">
          No results found for "{keyword}"
        </h1>
      </div>
    );
  }

  const pages = data?.pages;

  const totalItems =
    pages?.reduce((total, page) => total + page.data.response.length, 0) || 0;

  return (
    <div className="list-page pt-20">
      <Helmet>
        <title>Search results for {keyword}</title>
        <meta property="og:title" content={`Search - ${keyword}`} />
      </Helmet>

      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={totalItems}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader className="h-fit" />}
          endMessage={<Footer />}
        >
          <div className="flex items-center gap-4 px-4 mb-8 ml-8 mt-4">
            <Heading>Search results for "{keyword}"</Heading>
          </div>

          <div className="flex flex-wrap justify-around items-start mb-8 px-4">
            {pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.response.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flw-item">
                    <Image data={item} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <Loader className="h-[100dvh]" />
      )}
    </div>
  );
};

export default SearchResult;
