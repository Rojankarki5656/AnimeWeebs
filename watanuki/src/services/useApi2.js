import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import config from '../config/config'

const API_BASE_URL = config.serverUrl2
const fetchData2 = async (url) => {
  try {
    const { data } = await axios.get(API_BASE_URL + url)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export const useApi2 = (endpoint) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData2(endpoint),
    retry: 2,
    enabled: !!endpoint,
    refetchOnWindowFocus: false,
  })
}
