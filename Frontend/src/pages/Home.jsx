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
import { Helmet } from "react-helmet-async";

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

  // Generate JSON-LD structured data
  const generateJsonLd = () => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AnimeWeebs",
      "url": "https://animeweebs.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://animeweebs.app/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "description": "Watch anime online for free on AnimeWeebs. No ads, high-quality streaming of the latest and classic anime series. The best free anime streaming site for weebs!",
      "sameAs": [
        "https://twitter.com/animeweebs",
        "https://discord.gg/animeweebs"
      ]
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AnimeWeebs",
      "url": "https://animeweebs.app",
      "logo": "https://animeweebs.app/logo.png",
      "description": "Free anime streaming platform with no ads, offering the latest anime episodes in HD quality.",
      "sameAs": [
        "https://twitter.com/animeweebs",
        "https://discord.gg/animeweebs"
      ]
    };

    // Generate item list for trending anime (if data exists)
    const itemListSchema = data?.data?.trending ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": data.data.trending.slice(0, 5).map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://animeweebs.app/anime/${item.id}`,
        "name": item.title
      }))
    } : null;

    return { websiteSchema, organizationSchema, itemListSchema };
  };

  const { websiteSchema, organizationSchema, itemListSchema } = generateJsonLd();

  if (isError) {
    notify("error", error.message);
    return null; // or return an error component
  }

  return (
    <div className="h-[100dvh] bg-grey[900] overflow-y-auto">
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang="en" />
        <title>AnimeWeebs – Watch Anime Online Free – No Ads, HD Streaming</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://animeweebs.app" />

        {/* Primary SEO Meta Tags */}
        <meta 
          name="description" 
          content="Watch anime online free on AnimeWeebs – the ultimate no-ads anime streaming site. Stream the latest episodes of popular anime, classic series, and seasonal hits in HD. Your #1 destination to watch anime free, no registration required." 
        />
        <meta 
          name="keywords" 
          content="watch anime online free, free anime streaming, animeweebs, watch anime free, free anime sites, anime no ads, HD anime streaming, latest anime episodes, animeweebs.app, free anime website" 
        />
        <meta name="author" content="AnimeWeebs" />
        <meta name="copyright" content="AnimeWeebs" />
        <meta name="language" content="English" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="1 days" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://animeweebs.app/" />
        <meta property="og:title" content="AnimeWeebs – Free Anime Streaming Online – No Ads, HD Quality" />
        <meta property="og:description" content="The best free site to watch anime online. No ads, fast streaming, huge library of subbed & dubbed anime. Start watching your favorite anime now!" />
        <meta property="og:image" content="https://animeweebs.app/favicon1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="AnimeWeebs" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://animeweebs.app/" />
        <meta name="twitter:title" content="AnimeWeebs – Watch Anime Free | No Ads, HD Streaming" />
        <meta name="twitter:description" content="Join AnimeWeebs to watch anime online free. Largest collection of anime with no annoying ads. Stream now!" />
        <meta name="twitter:image" content="https://animeweebs.app/favicon1.png" />
        <meta name="twitter:site" content="@animeweebs" />

        {/* Additional SEO tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="AnimeWeebs" />
        <meta name="application-name" content="AnimeWeebs" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://static.anikai.to" />
        <link rel="dns-prefetch" href="https://static.anikai.to" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        {itemListSchema && (
          <script type="application/ld+json">
            {JSON.stringify(itemListSchema)}
          </script>
        )}
      </Helmet>

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <>
          {/* Hero Section with prominent H1 for SEO */}
          <div className="relative">
            <h1 className="sr-only">AnimeWeebs – Watch Anime Online Free, No Ads, HD Quality</h1>
            <HeroCarousel slides={data?.data?.spotlight} />
            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>

          <div className="xl:mx-10">
            {/* Trending Section – H2 heading for structure */}
            <section aria-labelledby="trending-heading">
              <TrendingLayout data={data?.data?.trending} />
            </section>

            <div className="left col-span-12 xl:col-span-0">
              {/* Latest Episodes Section */}
              <section aria-labelledby="latest-episodes-heading">
                <MainLayout
                  title="Latest Episode"
                  endpoint="recently-updated"
                  data={data?.data?.latestEpisode}
                />
              </section>

              {/* Newly Added Anime */}
              <section aria-labelledby="new-added-heading">
                <MainLayout
                  title="New Added"
                  endpoint="recently-added"
                  data={data?.data?.newAdded}
                />
              </section>

              {/* Top Upcoming Anime */}
              <section aria-labelledby="upcoming-heading">
                <MainLayout
                  title="Top Upcoming"
                  endpoint="top-upcoming"
                  data={data?.data?.topUpcoming}
                />
              </section>

              {/* SEO-rich paragraph for better keyword density */}
              <div className="my-8 px-4 text-gray-300 text-sm space-y-2 max-w-4xl mx-auto text-center">
                <p>
                  <strong>AnimeWeebs</strong> is the ultimate <strong>free anime streaming site</strong> where you can 
                  <strong> watch anime online free</strong> without any annoying ads. We offer the largest collection of 
                  <strong> subbed and dubbed anime</strong> in HD quality – from the latest seasonal hits to timeless classics. 
                  No registration, no premium fees. Just pure anime enjoyment. Start watching your favorite anime now!
                </p>
                <p>
                  Looking for a <strong>free site to watch anime</strong>? You've found it. AnimeWeebs updates episodes daily, 
                  ensures fast loading, and gives you a seamless <strong>anime streaming experience</strong>. Whether you love 
                  action, romance, isekai, or slice of life, we have something for every weeb. 
                  <strong> Watch anime free</strong> today and join thousands of happy users.
                </p>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;