// hooks/useAniListHome.js
import { useState, useEffect } from 'react';

const ANILIST_API = 'https://graphql.anilist.co';

// Single GraphQL query that fetches all required sections

// Helper to get current season/year (you can also hardcode or compute dynamically)
export function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  let season;
  if (month >= 0 && month <= 2) season = 'WINTER';
  else if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else season = 'FALL';
  return { season, year };
}

// Build query with dynamic season/year
export function buildHomeQuery() {
  const { season, year } = getCurrentSeason();
  const nextSeasonObj = (() => {
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    let nextIndex = (seasons.indexOf(season) + 1) % 4;
    let nextYear = year;
    if (nextIndex === 0) nextYear++;
    return { season: seasons[nextIndex], year: nextYear };
  })();

  return `
    query {
      trending: Page(page: 1, perPage: 12) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large extraLarge }
          averageScore
          description(asHtml: false)
        }
      }
      popularThisSeason: Page(page: 1, perPage: 12) {
        media(sort: POPULARITY_DESC, type: ANIME, season: ${season}, seasonYear: ${year}, status: RELEASING) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
        }
      }
      upcomingNextSeason: Page(page: 1, perPage: 12) {
        media(sort: POPULARITY_DESC, type: ANIME, season: ${nextSeasonObj.season}, seasonYear: ${nextSeasonObj.year}, status: NOT_YET_RELEASED) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
        }
      }
      allTimePopular: Page(page: 1, perPage: 12) {
        media(sort: POPULARITY_DESC, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
        }
      }
      top100: Page(page: 1, perPage: 10) {
        media(sort: SCORE_DESC, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
        }
      }
    }
  `;
}

// Retry helper with exponential backoff
export async function fetchWithRetry(query, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.status === 429) {
        // Rate limit – wait and retry
        const wait = delay * Math.pow(2, i);
        console.warn(`Rate limited (429). Retrying in ${wait}ms...`);
        await new Promise(resolve => setTimeout(resolve, wait));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      return json.data;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

