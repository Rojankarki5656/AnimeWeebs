// hooks/useAniListHome.js
import { useState, useEffect } from 'react';
import { 
  HOME_QUERY
} from '../utils/queries';
import { fetchWithRetry, buildHomeQuery } from '../utils/scrapper';
export function useAniListHome() {
  const [state, setState] = useState({
    trendingNow: [],
    popularThisSeason: [],
    upcomingNextSeason: [],
    allTimePopular: [],
    top100: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      // Try localStorage cache first
      const cached = localStorage.getItem('anilist_home');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const cacheAge = Date.now() - (parsed.timestamp || 0);
          if (cacheAge < 60 * 60 * 1000) { // 1 hour
            if (isMounted) {
              setState({
                ...parsed.data,
                loading: false,
                error: null,
              });
              console.log('Loaded from cache');
              console.log('Cache data:', parsed.data);
              return;
            }
          }
        } catch (e) {}
      }

      const query = buildHomeQuery();
      try {
        const data = await fetchWithRetry(query, 3, 1000);
        if (!isMounted) return;

        const newState = {
          trendingNow: data.trending?.media || [],
          popularThisSeason: data.popularThisSeason?.media || [],
          upcomingNextSeason: data.upcomingNextSeason?.media || [],
          allTimePopular: data.allTimePopular?.media || [],
          top100: data.top100?.media || [],
        };

        // Save to cache
        localStorage.setItem('anilist_home', JSON.stringify({
          data: newState,
          timestamp: Date.now(),
        }));

        setState({ ...newState, loading: false, error: null });
      } catch (err) {
        console.error('Failed to fetch AniList data:', err);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err.message || 'Failed to load anime data. Please refresh.',
          }));
        }
      }
    }

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return state;
}