// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const animeApi = {
    // Get video proxy URL
    getVideoUrl: (episodeId, category = 'sub') => {
        return `${API_BASE_URL}/proxy/video?episodeId=${episodeId}&category=${category}`;
    },
    
    // Get episodes for an anime
    getEpisodes: async (animeId) => {
        const response = await fetch(`${API_BASE_URL}/anime/${animeId}/episodes`);
        if (!response.ok) throw new Error('Failed to fetch episodes');
        return response.json();
    }
};