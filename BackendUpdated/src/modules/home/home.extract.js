import { commonAnimeObj, episodeObj } from "@/utils/commonAnimeObj";
import { load } from "cheerio";
import { axiosInstance } from '@/services/axiosInstance';
import infoExtract from '@/modules/info/info.extract';

export default async function homeExtract(html) {
  const $ = load(html);

  const response = {
    spotlight: [],
    trending: [],
    topAiring: [],
    mostPopular: [],
    mostFavorite: [],
    latestCompleted: [],
    latestEpisode: [],
    newAdded: [],
    topUpcoming: [],
    topTen: {
      today: null,
      week: null,
      month: null,
    },
    genres: [],
  };

  // Extract Spotlight (Featured section)
  const $spotlight = $("#featured .swiper.featured .swiper-slide");
  
  $($spotlight).each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      episodes: { ...episodeObj.episodes },
      rank: i + 1,
      type: null,
      quality: "HD",
      duration: null,
      aired: null,
      synopsis: null,
    };
    
    // Get title (English title from .title or data-jp for Japanese)
    const titleEl = $(el).find(".detail .title");
    obj.title = titleEl.text().trim();
    obj.alternativeTitle = titleEl.attr("data-jp");
    
    // Get synopsis/description
    obj.synopsis = $(el).find(".detail .desc").text().trim();
    
    // Get ID from watch button link
    const watchLink = $(el).find(".swiper-ctrl .watch-btn").attr("href");
    if (watchLink) {
      const match = watchLink.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    // Get poster from background image
    const bgImage = $(el).attr("style");
    if (bgImage) {
      const urlMatch = bgImage.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        obj.poster = urlMatch[1];
      }
    }
    
    // Get type and genres from info
    const infoText = $(el).find(".detail .info").text();
    const typeMatch = infoText.match(/\b(TV|MOVIE|ONA|OVA|SPECIAL)\b/i);
    if (typeMatch) {
      obj.type = typeMatch[0].toUpperCase();
    }
    
    // Get episode counts from sub/dub spans
    const subText = $(el).find(".detail .info .sub").text();
    const dubText = $(el).find(".detail .info .dub").text();
    obj.episodes.sub = parseInt(subText) || 0;
    obj.episodes.dub = parseInt(dubText) || 0;
    obj.episodes.eps = Math.max(obj.episodes.sub, obj.episodes.dub);
    
    // Get quality, release year, rating from mics
    const mics = $(el).find(".detail .mics div");
    mics.each((idx, mic) => {
      const label = $(mic).find("div").first().text().toLowerCase();
      const value = $(mic).find("span").text().trim();
      if (label === "release") {
        obj.aired = value;
      } else if (label === "quality") {
        obj.quality = value;
      }
    });
    
    if (obj.title) {
      response.spotlight.push(obj);
    }
  });

  // Extract Trending (Top Trending from sidebar)
  const $trending = $("#trending-anime .aitem-col[data-id='trending'] .aitem");
  
  $($trending).each((i, el) => {
    const obj = {
      title: null,
      alternativeTitle: null,
      rank: i + 1,
      poster: null,
      id: null,
    };
    
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    obj.title = $(el).find(".detail .title").text().trim();
    obj.alternativeTitle = $(el).find(".detail .title").attr("data-jp");
    
    // Get poster from background-image
    const bgImage = $(el).attr("style");
    if (bgImage) {
      const urlMatch = bgImage.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        obj.poster = urlMatch[1];
      }
    }
    
    if (obj.title) {
      response.trending.push(obj);
    }
  });

  // Extract Latest Updates section (this serves as latest episodes)
  const $latestUpdates = $("#latest-updates .aitem-wrapper.regular .aitem");
  
  $latestUpdates.each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      episodes: { ...episodeObj.episodes },
      type: null,
    };
    
    const titleEl = $(el).find(".title");
    obj.title = titleEl.text().trim();
    obj.alternativeTitle = titleEl.attr("data-jp");
    
    const href = $(el).find(".poster").attr("href");
    if (href) {
      // Extract anime ID from URL (remove episode part if present)
      const match = href.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    // Get poster from img data-src
    const posterImg = $(el).find(".poster img.lazyload");
    obj.poster = posterImg.attr("data-src");
    if (!obj.poster) {
      obj.poster = posterImg.attr("src");
    }
    
    // Get episode info
    const subText = $(el).find(".info .sub").text();
    const dubText = $(el).find(".info .dub").text();
    obj.episodes.sub = parseInt(subText) || 0;
    obj.episodes.dub = parseInt(dubText) || 0;
    obj.episodes.eps = Math.max(obj.episodes.sub, obj.episodes.dub);
    
    // Get type
    const typeText = $(el).find(".info b").last().text();
    if (typeText) {
      obj.type = typeText;
    }
    
    if (obj.title) {
      response.latestEpisode.push(obj);
    }
  });

  // Enrich latestEpisode items with internal detail `id` from watch page
  if (response.latestEpisode.length > 0) {
    await Promise.all(
      response.latestEpisode.map(async (item) => {
        try {
          if (item.id) {
            const res = await axiosInstance(`watch/${item.id}`);
            if (res && res.success && res.data) {
              const detail = infoExtract(res.data);
              if (detail && detail.id) {
                // Keep original slug id and add detail id as `detailId`
                item.detailId = detail.id;
              } else {
                item.detailId = null;
              }
            } else {
              item.detailId = null;
            }
          } else {
            item.detailId = null;
          }
        } catch {
          item.detailId = null;
        }
      })
    );
  }

  // Extract New Releases section (from swiper alist-group)
  const $newReleases = $(".alist-group .swiper-slide").first().find(".aitem-wrapper.mini .aitem");
  
  $newReleases.each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      episodes: { ...episodeObj.episodes },
      type: null,
    };
    
    const titleEl = $(el).find(".detail .title");
    obj.title = titleEl.text().trim();
    obj.alternativeTitle = titleEl.attr("data-jp");
    
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    const posterDiv = $(el).find(".poster");
    const posterImg = posterDiv.find("img");
    obj.poster = posterImg.attr("data-src");
    if (!obj.poster) {
      obj.poster = posterImg.attr("src");
    }
    
    // Get episode info
    const subText = $(el).find(".info .sub").text();
    const dubText = $(el).find(".info .dub").text();
    obj.episodes.sub = parseInt(subText) || 0;
    obj.episodes.dub = parseInt(dubText) || 0;
    obj.episodes.eps = Math.max(obj.episodes.sub, obj.episodes.dub);
    
    // Get type and episode count
    const infoSpans = $(el).find(".info span");
    infoSpans.each((idx, span) => {
      const text = $(span).text().trim();
      if (text.match(/^(TV|MOVIE|ONA|OVA|SPECIAL)$/i)) {
        obj.type = text.toUpperCase();
      } else if (!isNaN(parseInt(text)) && text.length < 5) {
        const num = parseInt(text);
        if (num > 0 && obj.episodes.eps === 0) {
          obj.episodes.eps = num;
        }
      }
    });
    
    if (obj.title) {
      response.newAdded.push(obj);
    }
  });

  // Extract Upcoming section (from second swiper-slide)
  const $upcoming = $(".alist-group .swiper-slide").eq(1).find(".aitem-wrapper.mini .aitem");
  
  $upcoming.each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      episodes: { ...episodeObj.episodes },
      type: null,
    };
    
    const titleEl = $(el).find(".detail .title");
    obj.title = titleEl.text().trim();
    obj.alternativeTitle = titleEl.attr("data-jp");
    
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    const posterDiv = $(el).find(".poster");
    const posterImg = posterDiv.find("img");
    obj.poster = posterImg.attr("data-src");
    if (!obj.poster) {
      obj.poster = posterImg.attr("src");
    }
    
    // Get type (usually "Preview" and then type)
    const infoSpans = $(el).find(".info span");
    infoSpans.each((idx, span) => {
      const text = $(span).text().trim();
      if (text.match(/^(TV|MOVIE|ONA|OVA|SPECIAL)$/i)) {
        obj.type = text.toUpperCase();
      }
    });
    
    if (obj.title) {
      response.topUpcoming.push(obj);
    }
  });

  // Extract Completed section (from third swiper-slide)
  const $completed = $(".alist-group .swiper-slide").eq(2).find(".aitem-wrapper.mini .aitem");
  
  $completed.each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      episodes: { ...episodeObj.episodes },
      type: null,
    };
    
    const titleEl = $(el).find(".detail .title");
    obj.title = titleEl.text().trim();
    obj.alternativeTitle = titleEl.attr("data-jp");
    
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/watch\/([^/?#]+)/);
      if (match) {
        obj.id = match[1];
      }
    }
    
    const posterDiv = $(el).find(".poster");
    const posterImg = posterDiv.find("img");
    obj.poster = posterImg.attr("data-src");
    if (!obj.poster) {
      obj.poster = posterImg.attr("src");
    }
    
    // Get episode info
    const subText = $(el).find(".info .sub").text();
    const dubText = $(el).find(".info .dub").text();
    const epsText = $(el).find(".info span b").first().text();
    
    obj.episodes.sub = parseInt(subText) || 0;
    obj.episodes.dub = parseInt(dubText) || 0;
    obj.episodes.eps = parseInt(epsText) || Math.max(obj.episodes.sub, obj.episodes.dub);
    
    // Get type
    const typeText = $(el).find(".info span b").last().text();
    if (typeText && typeText.match(/^(TV|MOVIE|ONA|OVA|SPECIAL)$/i)) {
      obj.type = typeText.toUpperCase();
    }
    
    if (obj.title) {
      response.latestCompleted.push(obj);
    }
  });

  // Extract Top Ten - Day, Week, Month from sidebar tabs
  const extractTopTenFromTab = (tabId) => {
    const items = [];
    $(`#trending-anime .aitem-col[data-id='${tabId}'] .aitem`).each((i, el) => {
      const obj = {
        title: $(el).find(".detail .title").text().trim(),
        rank: i + 1,
        alternativeTitle: $(el).find(".detail .title").attr("data-jp") || null,
        id: null,
        poster: null,
        episodes: {
          sub: 0,
          dub: 0,
          eps: 0,
        },
      };
      
      const href = $(el).attr("href");
      if (href) {
        const match = href.match(/\/watch\/([^/?#]+)/);
        if (match) {
          obj.id = match[1];
        }
      }
      
      const bgImage = $(el).attr("style");
      if (bgImage) {
        const urlMatch = bgImage.match(/url\(([^)]+)\)/);
        if (urlMatch) {
          obj.poster = urlMatch[1];
        }
      }
      
      const subText = $(el).find(".info .sub").text();
      const dubText = $(el).find(".info .dub").text();
      obj.episodes.sub = parseInt(subText) || 0;
      obj.episodes.dub = parseInt(dubText) || 0;
      obj.episodes.eps = Math.max(obj.episodes.sub, obj.episodes.dub);
      
      items.push(obj);
    });
    return items;
  };
  
  response.topTen.today = extractTopTenFromTab("day");
  response.topTen.week = extractTopTenFromTab("week");
  response.topTen.month = extractTopTenFromTab("month");
  
  // If trending/now is not empty, use it as well
  const trendingNow = extractTopTenFromTab("trending");
  if (trendingNow.length > 0 && response.trending.length === 0) {
    response.trending = trendingNow;
  }

  // Extract Genres from navigation menu
  const $genres = $(".nav-menu ul li:first-child ul li a");
  $genres.each((i, el) => {
    const genre = $(el).attr("title")?.toLowerCase();
    if (genre && !response.genres.includes(genre)) {
      response.genres.push(genre);
    }
  });

  // If no genres found via title, try text content
  if (response.genres.length === 0) {
    $genres.each((i, el) => {
      const genre = $(el).text().trim().toLowerCase();
      if (genre && !response.genres.includes(genre)) {
        response.genres.push(genre);
      }
    });
  }

  // Set some default values for consistency with original structure
  if (response.mostPopular.length === 0 && response.trending.length > 0) {
    response.mostPopular = [...response.trending].slice(0, 10);
  }
  
  if (response.topAiring.length === 0 && response.spotlight.length > 0) {
    response.topAiring = response.spotlight.slice(0, 5).map(item => ({
      ...item,
      rank: null
    }));
  }
  
  if (response.mostFavorite.length === 0 && response.topTen.week && response.topTen.week.length > 0) {
    response.mostFavorite = response.topTen.week.slice(0, 10);
  }

  return response;
}