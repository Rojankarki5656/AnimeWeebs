import Loader from "../components/Loader";
import { useApi } from "../services/useApi";
import HeroBanner from "../components/HeroBanner";
import HeroCarousel from "../components/hero";
import notify from "../utils/Toast";
import TrendingLayout from "../layouts/TrendingLayout";
import DynamicLayout from "../layouts/DynamicLayout";
import MainLayout from "../layouts/MainLayout";
import GenresLayout from "../layouts/GenresLayout";
import Top10Layout from "../layouts/Top10Layout";
import useGenresStore from "../store/genresStore";
import { useEffect } from "react";
import useTopTenStore from "../store/toptenStore";
import Footer from "../components/Footer";

import { genres } from "../utils/genres";
import { Helmet } from "react-helmet";
const Home = () => {
  const { data, isLoading, error, isError } = useApi("/home");

  const setGenres = useGenresStore((state) => state.setGenres);
  const setTopTen = useTopTenStore((state) => state.setTopTen);

  useEffect(() => {
    setGenres(genres);
  }, []);

  useEffect(() => {
    if (data?.data) {
      setTopTen(data.data.top10);
    }
  }, [data]);

  if (isError) {
    notify("error", error.message);
    return;
  }
  return (
    <div className="h-[100dvh] bg-grey[900] overflow-y-auto">
      <Helmet>
        <title>
          Watch Anime Online, Free Anime Streaming Online on watanuki Anime
          Website
        </title>
        <meta
          name="description"
          content=" AnimeWeebs is a free site with no ads to watch anime. AnimeWeebs contains all the anime for a weebs to watch. Fucking Nerds !!!"
        />
        <meta property="og:title" content="home - watanuki" />
      </Helmet>
      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <>
          <div className="relative">
            <HeroCarousel slides={data?.data?.spotlight} />
            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>{" "}
          <div className="xl:mx-10">
            <TrendingLayout data={data?.data?.trending} />
            <div className="left col-span-12 xl:col-span-0">
              <MainLayout
                title="Latest Episode"
                endpoint="recently-updated"
                data={data?.data?.latestEpisode}
              />
              <MainLayout
                title="New Added"
                endpoint="recently-added"
                data={data?.data?.newAdded}
              />
              <MainLayout
                title="Top Upcoming"
                endpoint="top-upcoming"
                data={data?.data?.topUpcoming}
              />
            </div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
