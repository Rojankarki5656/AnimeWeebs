// queries.js
export const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
      }
    }
  }
`;

export const POPULAR_THIS_SEASON_QUERY = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, season: $season, seasonYear: $year, status: RELEASING) {
        id
        title { romaji english native }
        coverImage { large }
      }
    }
  }
`;

export const HOME_QUERY = `
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
      media(sort: POPULARITY_DESC, type: ANIME, season: SPRING, seasonYear: 2025, status: RELEASING) {
        id
        title { romaji english native }
        coverImage { large }
        averageScore
      }
    }
    upcomingNextSeason: Page(page: 1, perPage: 12) {
      media(sort: POPULARITY_DESC, type: ANIME, season: SUMMER, seasonYear: 2025, status: NOT_YET_RELEASED) {
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

export const NEXT_SEASON_QUERY = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, season: $season, seasonYear: $year, status: NOT_YET_RELEASED) {
        id
        title { romaji english native }
        coverImage { large }
      }
    }
  }
`;

export const ALL_TIME_POPULAR_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
      }
    }
  }
`;

export const TOP_100_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
        averageScore
      }
    }
  }
`;