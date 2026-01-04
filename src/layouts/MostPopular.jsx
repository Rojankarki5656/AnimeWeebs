import React from "react";
import DynamicLayout from "./DynamicLayout";
import { useApi } from "../services/useApi";
import PageNotFound from "../pages/PageNotFound";
import Loader from "../components/Loader";

const MostPopular = ({ data }) => {
  return (
    <div className="">
      <DynamicLayout data={data} title="Most Popular" endpoint="most-popular" />
    </div>
  );
};

export default MostPopular;
