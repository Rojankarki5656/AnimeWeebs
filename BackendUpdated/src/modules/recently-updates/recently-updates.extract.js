import { load } from 'cheerio';

export default function extractUpdates(html) {
  if (!html) return [];
  
  const $ = load(html);
  const items = [];
  
  $('.aitem').each((i, el) => {
    const $item = $(el);
    
    const href = $item.find('a.poster').attr('href') || '';
    const slugMatch = href.match(/\/watch\/([^?#]+)/);
    const slug = slugMatch ? slugMatch[1] : '';
    const episodeMatch = href.match(/#ep=(\d+)/);
    const currentEpisode = episodeMatch ? episodeMatch[1] : '';
    
    const tipBtn = $item.find('.ttip-btn');
    const animeId = tipBtn.attr('data-tip') || '';
    
    const titleEl = $item.find('.title');
    const title = titleEl.attr('title') || titleEl.text().trim();
    const japaneseTitle = titleEl.attr('data-jp') || '';
    
    const img = $item.find('img.lazyload');
    const poster = img.attr('data-src') || '';
    
    const subSpan = $item.find('.info .sub');
    const subEpisodes = subSpan.length ? subSpan.text().trim() : '';
    
    const dubSpan = $item.find('.info .dub');
    const dubEpisodes = dubSpan.length ? dubSpan.text().trim() : '';
    
    const boldSpans = $item.find('.info span b');
    let totalEpisodes = '';
    let type = '';
    
    boldSpans.each((idx, span) => {
      const text = $(span).text().trim();
      if (/^\d+$/.test(text)) {
        totalEpisodes = text;
      } else if (text) {
        type = text;
      }
    });
    
    if (!totalEpisodes && subEpisodes) {
      totalEpisodes = subEpisodes;
    }
    
    items.push({
      id: animeId,
      slug,
      title,
      japaneseTitle,
      poster,
      currentEpisode: currentEpisode ? parseInt(currentEpisode) : null,
      subEpisodes: subEpisodes ? parseInt(subEpisodes) : 0,
      dubEpisodes: dubEpisodes ? parseInt(dubEpisodes) : 0,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
      type,
    });
  });
  
  return items;
}