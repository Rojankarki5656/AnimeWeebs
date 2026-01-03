import React from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
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
        <h1 className="text-red-300">
          search result not found with keyword - {keyword}
        </h1>
      </div>
    );
  }
  const pages = data?.pages;
  console.log(data?.pages.length);

  return (
    <div className="list-page pt-20">
      <Helmet>
        <title>search result of {keyword}</title>
        <meta property="og:title" content="search - watanuki" />
      </Helmet>
      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={data?.pages.flat().length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader className="h-fit" />}
          endMessage={<Footer />}
        >
          <Heading>Search results of {keyword}</Heading>
          <div className="flex flex-wrap justify-around items-center">
            {pages?.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.response.map((item, index) => (
                  <div key={item.id + index} className="flw-item">
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
