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
import { Helmet } from "react-helmet";
import { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import VoiceActorsLayout from "../layouts/VoiceActorsLayout";

const DetailPage = () => {
  const { id } = useParams();
  const [bigPoster, setBigPoster] = useState(null);

  const titleId = id.split("-").slice(0, -1).join(" ").replace(",", " ");

  const endsWithNumber = /\d$/;
  const result = endsWithNumber.test(id);

  if (!result) {
    return <PageNotFound />;
  }

  const showBigPoster = (url) => {
    setBigPoster(url);
  };

  const { data: response, isError, error, isLoading } = useApi(`/anime/${id}`);
  const data = response?.data;

  if (isError) {
    return <PageNotFound />;
  }

  return (
    <main className={`${bigPoster ? "h-dvh  overflow-hidden" : ""}`}>
      {bigPoster && (
        <div className="bigposter absolute flex justify-center items-center h-full w-full z-[100] bg-[#222831b4]">
          <div className="poster bg-lightbg rounded-md flex aspect-auto object-cover flex-col items-end relative">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute hover:text-primary bg-black text-2xl"
            >
              <FaWindowClose />
            </button>
            <img
              src={bigPoster}
              alt="poster"
              className="rounded-md h-full w-full"
            />
          </div>
        </div>
      )}

      <Helmet>
        <title>{titleId}</title>
        <meta property="og:title" content="detail - watanuki" />
      </Helmet>
      {data && !isLoading ? (
        <div className={`DetailPage relative pt-10 ${bigPoster && "blur-sm"} `}>
          <InfoLayout showBigPoster={showBigPoster} data={data} />

          <div className="row grid items-start gap-3 px-2 grid-cols-12">
            <div className="left col-span-12 xl:col-span-9">
              {data.moreSeasons.length !== 0 && (
                <MoreSeasons data={data.moreSeasons} />
              )}
              <VoiceActorsLayout id={id} />
              {data.recommended && (
                <div className="recomendation">
                  <Recommended data={data.recommended} />
                </div>
              )}
            </div>

            <div className="right col-span-12 xl:col-span-3">
              {data.related.length !== 0 && (
                <div className="related mt-5">
                  <Related data={data.related} />
                </div>
              )}
              {data.mostPopular && (
                <div className="most-popular col-span-12 mt-2 xl:col-span-3">
                  <MostPopular data={data.mostPopular} />
                </div>
              )}
            </div>
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
