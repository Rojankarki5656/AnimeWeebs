import React from "react";
import pageNotFound from "../assets/404.png";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Helmet } from "react-helmet";

const PageNotFound = () => {
  return (
    <div className="h-[100dvh] flex justify-center flex-col items-center">
      <Helmet>
        <title>404 PAGE NOT FOUND</title>
        <meta property="og:title" content="PAGE NOT FOUND - watanuki" />
      </Helmet>
      <img
        className="max-w-80 mb-2 w-full h-auto"
        src={pageNotFound}
        alt="404 page not found"
      />
      <h1 className="text-2xl text-primary">404 Error</h1>
      <h2>Oops! we can&apos;t find this page.</h2>
      <Link to={`/home`}>
        <button className="bg-primary flex items-center gap-2 text-black px-4 py-2 rounded-2xl">
          <FaAngleLeft />
          <span>go back to home page</span>
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;
