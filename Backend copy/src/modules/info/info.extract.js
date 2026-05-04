import { commonAnimeObj, episodeObj } from '@/utils/commonAnimeObj';
import { load } from 'cheerio';

export default function infoExtract(html) {
  const $ = load(html);

  const obj = {
    ...commonAnimeObj,
    ...episodeObj,
    mal_id: null,
    al_id: null,
    rating: null,
    type: null,
    is18Plus: null,
    synopsis: null,
    japanese: null,
    aired: {
      from: null,
      to: null,
    },
    premiered: null,
    broadcast: null,
    duration: null,
    status: null,
    score: null,
    reviewCount: null,
    genres: [],
    studios: [],
    producers: [],
    links: {
      mal: null,
      al: null,
    },
    country: null,
    recommended: [],
  };

  // Extract anime ID from multiple sources
  // Priority 1: From syncData JSON
  const syncData = $('#syncData');
  if (syncData.length) {
    try {
      const data = JSON.parse(syncData.html());
      if (data.anime_id) {
        obj.id = data.anime_id;
      }
      if (data.mal_id) {
        obj.mal_id = data.mal_id;
      }
      if (data.al_id) {
        obj.al_id = data.al_id;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  // Priority 2: From rating box data-id attribute
  if (!obj.id) {
    const ratingBox = $('#anime-rating');
    if (ratingBox.length) {
      obj.id = ratingBox.attr('data-id');
      if (ratingBox.attr('data-alid')) {
        obj.al_id = ratingBox.attr('data-alid');
      }
    }
  }
  
  // Priority 3: From watch-page div
  const watchPage = $('#watch-page');
  if (watchPage.length) {
    if (!obj.mal_id) obj.mal_id = watchPage.attr('data-mal-id');
    if (!obj.al_id) obj.al_id = watchPage.attr('data-al-id');
  }

  // Extract main anime info from entity-section
  const entitySection = $('.entity-section');
  
  // Extract poster
  obj.poster = entitySection.find('.poster img').attr('src');
  
  // Check if 18+ (look for rating indicator)
  obj.is18Plus = entitySection.find('.rating').text().includes('R+') || 
                 entitySection.find('.rating').text().includes('Rx');

  // Extract title
  obj.title = entitySection.find('.title').text().trim();
  obj.japanese = entitySection.find('.al-title').text().trim();
  obj.alternativeTitle = obj.japanese;

  // Extract rating and review count
  const ratingValue = entitySection.find('.rate-box .value').text().trim();
  const reviewText = entitySection.find('.rate-box span').last().text().trim();
  obj.score = ratingValue;
  const reviewMatch = reviewText.match(/by (\d+) reviews/);
  if (reviewMatch) {
    obj.reviewCount = reviewMatch[1];
  }

  // Extract from info div
  const infoDivs = entitySection.find('.detail > div');
  
  // First column of details
  const firstColumn = infoDivs.first();
  const secondColumn = infoDivs.last();
  
  // Country
  const countryText = firstColumn.find('div:contains("Country:") span').text().trim();
  obj.country = countryText;
  
  // Genres
  firstColumn.find('div:contains("Genres:") span a').each((i, el) => {
    obj.genres.push($(el).text().trim());
  });
  
  // Premiered
  obj.premiered = firstColumn.find('div:contains("Premiered:") span a').text().trim();
  
  // Aired dates
  const airedText = firstColumn.find('div:contains("Date aired:")').text().replace('Date aired:', '').trim();
  if (airedText && airedText !== '?') {
    const airedParts = airedText.split('to');
    obj.aired.from = airedParts[0]?.trim() || null;
    obj.aired.to = airedParts[1]?.trim() === '?' ? null : airedParts[1]?.trim() || null;
  }
  
  // Broadcast
  obj.broadcast = firstColumn.find('div:contains("Broadcast:") span').text().trim();
  
  // Episodes count
  const episodesText = firstColumn.find('div:contains("Episodes:") span').text().trim();
  if (episodesText && episodesText !== '?') {
    obj.episodes.sub = parseInt(episodesText);
    obj.episodes.dub = parseInt(episodesText);
    obj.episodes.eps = parseInt(episodesText);
  }
  
  // Duration
  obj.duration = firstColumn.find('div:contains("Duration:") span').text().trim();
  
  // Status
  obj.status = secondColumn.find('div:contains("Status:") span').text().trim();
  
  // Score from detail section
  const scoreText = secondColumn.find('div:contains("Scores:") span').text().trim();
  if (scoreText) {
    obj.score = scoreText.split(' ')[0];
  }
  
  // Studios
  secondColumn.find('div:contains("Studios:") span a').each((i, el) => {
    obj.studios.push($(el).find('span').text().trim());
  });
  
  // Producers
  secondColumn.find('div:contains("Producers:") span a').each((i, el) => {
    obj.producers.push($(el).find('span').text().trim());
  });
  
  // Links (MAL, AL)
  const malLink = secondColumn.find('div:contains("Links:") span a:contains("MAL")');
  const alLink = secondColumn.find('div:contains("Links:") span a:contains("AL")');
  if (malLink.length) {
    obj.links.mal = malLink.attr('href');
  }
  if (alLink.length) {
    obj.links.al = alLink.attr('href');
  }

  // Extract type from breadcrumb
  const breadcrumb = $('.breadcrumb');
  breadcrumb.find('.breadcrumb-item a').each((i, el) => {
    const text = $(el).text().trim();
    if (['TV', 'Movie', 'OVA', 'ONA', 'Special'].includes(text)) {
      obj.type = text;
    }
  });

  // Extract synopsis
  obj.synopsis = entitySection.find('.desc').text().trim();

  // Extract current episode from syncData
  let currentEpisode = 1;
  if (syncData.length) {
    try {
      const data = JSON.parse(syncData.html());
      currentEpisode = data.episode || 1;
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Extract sub/dub counts from player-control if available
  const subCount = $('.sub svg').parent().text().trim();
  if (subCount && !isNaN(parseInt(subCount)) && !obj.episodes.sub) {
    obj.episodes.sub = parseInt(subCount);
    obj.episodes.dub = parseInt(subCount);
  }

  // Extract Recommended anime
  const recommendedItems = $('.sidebar-section .aitem-col .aitem');
  recommendedItems.each((i, el) => {
    const innerObj = {
      title: null,
      alternativeTitle: null,
      id: null,
      poster: null,
      type: null,
      episodes: {
        sub: null,
        dub: null,
        eps: null,
      },
    };
    
    const titleEl = $(el).find('.title');
    innerObj.title = titleEl.text().trim();
    innerObj.alternativeTitle = titleEl.attr('data-jp');
    
    const href = $(el).attr('href');
    innerObj.id = href ? href.split('/').filter(Boolean).pop() : null;
    
    // Extract episode counts from info
    const infoSpans = $(el).find('.info span');
    infoSpans.each((idx, span) => {
      const spanText = $(span).text().trim();
      if ($(span).find('svg').length > 0) {
        // This is sub or dub icon wrapper
        const count = parseInt(spanText);
        if (!isNaN(count)) {
          if (idx === 0) {
            innerObj.episodes.sub = count;
            innerObj.episodes.dub = count;
          }
        }
      } else if (!isNaN(parseInt(spanText)) && spanText !== 'TV' && spanText !== 'Movie') {
        innerObj.episodes.eps = parseInt(spanText);
        innerObj.episodes.sub = parseInt(spanText);
        innerObj.episodes.dub = parseInt(spanText);
      }
    });
    
    // Extract type
    $(el).find('.info span').each((idx, span) => {
      const text = $(span).text().trim();
      if (['TV', 'Movie', 'OVA', 'ONA', 'Special'].includes(text)) {
        innerObj.type = text;
      }
    });
    
    innerObj.poster = $(el).css('background-image');
    if (innerObj.poster) {
      const urlMatch = innerObj.poster.match(/url\(['"]?([^'"\)]+)['"]?\)/);
      if (urlMatch) {
        innerObj.poster = urlMatch[1];
      }
    }

    if (innerObj.id && innerObj.title) {
      obj.recommended.push(innerObj);
    }
  });

  // Remove duplicates from recommended (keep first 10)
  const uniqueRecommended = [];
  const seenIds = new Set();
  for (const rec of obj.recommended) {
    if (!seenIds.has(rec.id) && uniqueRecommended.length < 10) {
      seenIds.add(rec.id);
      uniqueRecommended.push(rec);
    }
  }
  obj.recommended = uniqueRecommended;

  return obj;
}