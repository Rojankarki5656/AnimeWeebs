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
    <div className="relative bg-gradient-to-b from-[#0a0a0f] via-gray-950 to-[#0a0a0f] min-h-screen">
      <Helmet>
        <title> Watch Anime Online, Free Anime Streaming Online on watanuki Anime Website </title>
        <meta name="description" content=" watanuki to is a free no ads anime site to watch free anime. Online anime streaming at watanuki with DUB, SUB in HD watanuki.shop." />
        <meta property="og:title" content="home - watanuki" />
      </Helmet>
      
      {isLoading ? (
        <Loader className="h-[100dvh] bg-[#0a0a0f]" />
      ) : (
        <>
          {/* Hero with overlay gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-transparent z-10 pointer-events-none"></div>
            <HeroCarousel slides={data?.data?.spotlight} />
          </div>
          
          <div className="xl:mx-8 px-3">
            {/* Trending Section - Elevated */}
            <div className="mt-4 mb-6">
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-xl">
                <TrendingLayout data={data?.data?.trending} />
              </div>
            </div>
            
            {/* Dynamic Layouts Grid - Professional & Cohesive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300">
                <DynamicLayout 
                  title="Most Popular" 
                  endpoint="most-popular" 
                  data={data?.data?.mostPopular} 
                />
              </div>
              
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg hover:shadow-2xl hover:border-purple-500/40 transition-all duration-300">
                <DynamicLayout 
                  title="Most Favorite" 
                  endpoint="most-favorite" 
                  data={data?.data?.mostFavorite} 
                />
              </div>
              
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300">
                <DynamicLayout 
                  title="Top Airing" 
                  endpoint="top-airing" 
                  data={data?.data?.topAiring} 
                />
              </div>
              
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300">
                <DynamicLayout 
                  title="Latest Completed" 
                  endpoint="completed" 
                  data={data?.data?.latestCompleted} 
                />
              </div>
            </div>
            
            {/* Main Content Area - Professional Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 my-8">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-9 space-y-4">
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-xl">
                  <MainLayout 
                    title="Latest Episode" 
                    endpoint="recently-updated" 
                    data={data?.data?.latestEpisode} 
                  />
                </div>
                
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-xl">
                  <MainLayout 
                    title="New Added" 
                    endpoint="recently-added" 
                    data={data?.data?.newAdded} 
                  />
                </div>
                
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-xl">
                  <MainLayout 
                    title="Top Upcoming" 
                    endpoint="top-upcoming" 
                    data={data?.data?.topUpcoming} 
                  />
                </div>
              </div>
              
              {/* Right Column - Sidebar */}
              <div className="xl:col-span-3 space-y-4">
                <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg">
                  <GenresLayout />
                </div>
                
                <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-3 shadow-lg">
                  <Top10Layout />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <Footer />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;