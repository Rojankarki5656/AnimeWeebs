import { Link, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { useApi } from "../services/useApi";
import Loader from "../components/Loader";
import InfoLayout from "../layouts/InfoLayout";
import Recommended from "../layouts/Recommended";
import MostPopular from "../layouts/MostPopular";
import MoreSeasons from "../layouts/MoreSeasons";
import Related from "../layouts/Related";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const DetailPage = () => {
  const { state } = useLocation();
  const isUpcoming = state?.source === "top-upcoming";
  const { id } = useParams();
  const [bigPoster, setBigPoster] = useState(null);

  // Extract readable title from ID (fallback)
  const titleId = id
    ? id.split("-").slice(0, -1).join(" ").replace(",", " ")
    : "Anime";

  const showBigPoster = (url) => setBigPoster(url);

  const { data: response, isError, error, isLoading } = useApi(`/anime/${id}`);
  const data = response?.data;

  if (isError) return <PageNotFound />;

  // Build JSON‑LD schema (TVSeries / Movie)
  const generateSchema = () => {
    if (!data) return null;
    const schema = {
      "@context": "https://schema.org",
      "@type": data.type === "Movie" ? "Movie" : "TVSeries",
      "name": data.title,
      "alternateName": data.alternativeTitle,
      "description": data.synopsis?.substring(0, 500),
      "image": data.poster,
      "url": `https://animeweebs.com/anime/${id}`,
      "genre": data.genres?.join(", "),
      "datePublished": data.aired?.from || data.aired,
      "duration": data.duration,
      "productionCompany": data.studios || data.producers?.[0],
      "aggregateRating": data.score ? {
        "@type": "AggregateRating",
        "ratingValue": data.score,
        "bestRating": "10",
        "ratingCount": data.reviewCount || 100,
      } : undefined,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `https://animeweebs.com/watch/${slugify(data.title)}-_${data.id}`,
      },
    };
    return schema;
  };

  const slugify = (text) =>
    text?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";

  const schemaData = generateSchema();

  return (
    <main className={`${bigPoster ? "h-dvh overflow-hidden" : ""}`}>
      {/* Big Poster Modal (mobile‑friendly) */}
      {bigPoster && (
        <div className="bigposter fixed inset-0 flex justify-center items-center z-[100] bg-black/90 p-4">
          <div className="relative max-w-[90vw] max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute top-2 right-2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black transition"
              aria-label="Close full poster"
            >
              <FaWindowClose className="text-xl" />
            </button>
            <img
              src={bigPoster}
              alt={`${data?.title || "Anime"} poster – watch free on AnimeWeebs`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* SEO Meta */}
      <Helmet>
        <html lang="en" />
        <title>{data?.title ? `${data.title} – Watch Free Online on AnimeWeebs` : titleId}</title>
        <meta name="description" content={data?.synopsis?.substring(0, 160) || `Watch ${data?.title} online free in HD. No ads, subbed & dubbed episodes.`} />
        <meta name="keywords" content={`${data?.title}, watch ${data?.title} free, ${data?.title} online, free anime, animeweebs, subbed, dubbed, ${data?.genres?.join(", ")}`} />
        <meta property="og:title" content={`${data?.title} – Free Anime Streaming on AnimeWeebs`} />
        <meta property="og:description" content={data?.synopsis?.substring(0, 160)} />
        <meta property="og:image" content={data?.poster} />
        <meta property="og:url" content={`https://animeweebs.com/anime/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://animeweebs.com/anime/${id}`} />
        {schemaData && (
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        )}
      </Helmet>

      {data && !isLoading ? (
        <div className={`DetailPage relative pt-10 ${bigPoster && "blur-sm"}`}>
          <InfoLayout showBigPoster={showBigPoster} data={data} isUpcoming={isUpcoming} />

          <div className="row grid items-start gap-3 px-2 grid-cols-12">
            <div
              className={`left col-span-12 ${
                data.related?.length > 0 ? "xl:col-span-9" : "xl:col-span-12"
              }`}
            >
              {data.moreSeasons?.length > 0 && <MoreSeasons data={data.moreSeasons} />}
              {data.recommended && (
                <div className="recommendation mt-8">
                  <Recommended data={data.recommended} />
                </div>
              )}
            </div>

            {data.related?.length > 0 && (
              <div className="right col-span-12 xl:col-span-3">
                <div className="related mt-5">
                  <Related data={data.related} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loader className="h-[100dvh]" />
      )}
      <Footer />
    </main>
  );
};

export default DetailPage;