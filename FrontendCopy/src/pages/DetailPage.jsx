// DetailPage.js
import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaWindowClose } from "react-icons/fa";

import Loader from "../components/Loader";
import Footer from "../components/Footer";
import InfoLayout from "../layouts/InfoLayout";
import Related from "../layouts/Related";
import VoiceActorsLayout from "../layouts/VoiceActorsLayout";
import { useAniListAnime } from "../hooks/animeinfo";

const DetailPage = () => {
  const { id } = useParams();            // numeric AniList ID
  const { state } = useLocation();
  const isUpcoming = state?.source === "top-upcoming";
  const [bigPoster, setBigPoster] = useState(null);
  const showBigPoster = (url) => setBigPoster(url);

  const { data, isLoading, isError } = useAniListAnime(id);

  console.log("Anime details data:", data, "Loading:", isLoading, "Error:", isError);

  if (isError) return <div className="text-red-500 text-center py-20">Failed to load anime details.</div>;
  if (isLoading || !data) return <Loader className="h-screen" />;

  const title = data.title || "";
  const description = data.description?.substring(0, 160) || "";

  // JSON‑LD (uses data from scraper)
  const schema = {
    "@context": "https://schema.org",
    "@type": data.format === "MOVIE" ? "Movie" : "TVSeries",
    name: data.title,
    alternateName: data.english,
    description: data.description,
    image: data.poster,
    url: `https://animeweebs.com/anime/${data.id}`,
    genre: data.genres?.join(", "),
    datePublished: data.season ? `${data.season} ${new Date().getFullYear()}` : null,
    duration: data.episodeDuration ? `PT${data.episodeDuration}M` : null,
    productionCompany: data.studios?.[0],
    aggregateRating: data.averageScore ? {
      "@type": "AggregateRating",
      ratingValue: data.averageScore / 10,
      bestRating: "10",
      ratingCount: data.popularity,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className={bigPoster ? "h-dvh overflow-hidden" : ""}>
      {bigPoster && (
        <div className="fixed inset-0 flex justify-center items-center z-[100] bg-black/90 p-4">
          <div className="relative max-w-[90vw] max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute top-2 right-2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black transition"
            >
              <FaWindowClose className="text-xl" />
            </button>
            <img src={bigPoster} alt={title} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      <Helmet>
        <title>{title} – Watch Free Online on AnimeWeebs</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${title}, watch free, anime, ${data.genres?.join(", ")}`} />
        <meta property="og:title" content={`${title} – Free Anime Streaming`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={data.poster} />
        <meta property="og:url" content={`https://animeweebs.com/anime/${data.id}`} />
        <link rel="canonical" href={`https://animeweebs.com/anime/${data.id}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="DetailPage relative pt-10">
        <InfoLayout data={data} showBigPoster={showBigPoster} isUpcoming={isUpcoming} />

        <div className="grid grid-cols-12 gap-6 px-4 max-w-7xl mx-auto">
          <div className="col-span-12 xl:col-span-9 space-y-8">
            <VoiceActorsLayout characters={data.characters} animeId={data.id} />
            {data.relations?.length > 0 && <Related relations={data.relations} />}
            {/* We skip MoreSeasons – use relations instead */}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default DetailPage;