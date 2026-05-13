import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/config";

export const API_BASE_URL = "http://localhost:3000"; // config.localUrl; // Use the local URL for development

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(API_BASE_URL + url, {
      timeout: 60000,
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const useApi3 = (endpoint) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
    retry: 2,
    enabled: !!endpoint,
    refetchOnWindowFocus: false,
  });
};

const fetchInfiniteData = async ({ queryKey, pageParam }) => {
  try {
    // Remove the last '&' or handle pageParam correctly
    const baseUrl = queryKey[0];
    const url = baseUrl + pageParam;
    const { data } = await axios.get(API_BASE_URL + url);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const useInfiniteApi = (endpoint) => {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: fetchInfiniteData,
    initialPageParam: 1,
    retry: 0,
    getNextPageParam: (lastPage) => {
      // Check the new pageInfo structure
      if (lastPage.pageInfo?.hasNextPage) {
        return lastPage.pageInfo.currentPage + 1;
      }
      return undefined;
    },
  });
};