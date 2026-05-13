import { load } from "cheerio";

const extractId = (url) => {
  if (!url) return null;
  // Match /anime/12345/ or /anime/12345
  const match = url.match(/\/anime\/(\d+)/);
  return match ? match[1] : null;
};

export default async function homeExtract(html) {
  const $ = load(html);

  // Debug: check if we got the right page
  console.log('Has landing-section?', $('.landing-section').length);

  const response = {
    trendingNow: [],
    popularThisSeason: [],
    upcomingNextSeason: [],
    allTimePopular: [],
    top100: [],
  };

  const extractSection = (sectionClass, includeRank = false) => {
    const items = [];
    const $section = $(`.landing-section.${sectionClass}`);
    if (!$section.length) return items;

    $section.find('.media-card').each((idx, card) => {
      const $card = $(card);
      const $titleLink = $card.find('a.title');
      const href = $titleLink.attr('cover');
      const id = extractId(href);
      const title = $titleLink.text().trim();
      const poster = $card.find('img.image').attr('src') || null;

      let rank = null;
      if (includeRank) {
        const rankText = $card.find('.rank.circle').text().trim();
        const rankMatch = rankText.match(/\d+/);
        if (rankMatch) rank = parseInt(rankMatch[0], 10);
      }

      if (id && title) {
        items.push({ id, title, poster, rank: rank || (includeRank ? idx + 1 : undefined) });
      }
    });
    return items;
  };

  response.trendingNow = extractSection('trending');
  response.popularThisSeason = extractSection('season');
  response.upcomingNextSeason = extractSection('nextSeason');
  response.allTimePopular = extractSection('popular');
  response.top100 = extractSection('top', true);

  console.log('Extracted counts:', {
    trending: response.trendingNow.length,
    popular: response.popularThisSeason.length,
    upcoming: response.upcomingNextSeason.length,
    allTime: response.allTimePopular.length,
    top100: response.top100.length,
  });

  return response;
}