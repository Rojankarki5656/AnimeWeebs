// hooks/useLatestEpisodes.js
import { useState, useEffect } from 'react';

export function useLatestEpisodes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/recent-anime');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.ok) throw new Error('API returned error');
        
        // Transform to match MainLayout expected format
        const transformed = json.data.map(item => ({
          id: item.id, // or item.id – use slug for routing
          title: item.title,
          poster: item.poster,
          episodes: {
            sub: item.is_sub || 0,
            dub: item.is_dub || 0,
            eps: item.episodes ? parseInt(item.episodes) : 0,
          },
          type: item.terms_by_type?.type?.[0] || 'TV',
          rating: item.score,
          session: null, // not needed for MainLayout
        }));
        setData(transformed);
        console.log('Fetched latest episodes:', transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return { data, loading, error };
}