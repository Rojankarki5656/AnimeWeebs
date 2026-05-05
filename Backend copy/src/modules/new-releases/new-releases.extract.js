import { load } from 'cheerio';

export default function extractNewReleases(html) {
  if (!html) return { items: [], totalPages: 1 };

  const $ = load(html);
  const items = [];

  // Extract each anime card
  $('.aitem-wrapper.regular .aitem').each((i, el) => {
    const $item = $(el);

    // ID from data-tip
    const tipBtn = $item.find('.ttip-btn');
    const id = tipBtn.attr('data-tip') || '';

    // Slug from poster link
    const href = $item.find('a.poster').attr('href') || '';
    const slugMatch = href.match(/\/watch\/([^?#]+)/);
    const slug = slugMatch ? slugMatch[1] : '';

    // Title and Japanese title
    const titleEl = $item.find('.title');
    const title = titleEl.attr('title') || titleEl.text().trim();
    const japaneseTitle = titleEl.attr('data-jp') || '';

    // Poster
    const img = $item.find('img.lazyload');
    const poster = img.attr('data-src') || '';

    // Episode counts
    const subSpan = $item.find('.info .sub');
    const subEpisodes = subSpan.length ? subSpan.text().trim() : '0';
    const dubSpan = $item.find('.info .dub');
    const dubEpisodes = dubSpan.length ? dubSpan.text().trim() : '0';

    // Total episodes and type from bold spans
    let totalEpisodes = '';
    let type = '';
    $item.find('.info span b').each((idx, span) => {
      const text = $(span).text().trim();
      if (/^\d+$/.test(text)) {
        totalEpisodes = text;
      } else if (text) {
        type = text;
      }
    });

    // If no total episodes found, try using subEpisodes as fallback
    if (!totalEpisodes && subEpisodes) totalEpisodes = subEpisodes;

    // Check for adult content (18+ tag)
    const isAdult = $item.find('.tags .adult').length > 0;

    items.push({
      id,
      slug,
      title,
      japaneseTitle,
      poster,
      subEpisodes: parseInt(subEpisodes) || 0,
      dubEpisodes: parseInt(dubEpisodes) || 0,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
      type,
      isAdult,
    });
  });

  // Extract pagination info – find last page number
  let totalPages = 1;
  const lastPageLink = $('.pagination .page-item a[rel="last"]');
  if (lastPageLink.length) {
    const url = lastPageLink.attr('href');
    const match = url.match(/[?&]page=(\d+)/);
    if (match) totalPages = parseInt(match[1]);
  } else {
    // Fallback: get max numeric page from visible page numbers
    const pageLinks = $('.pagination .page-item a.page-link');
    let maxPage = 1;
    pageLinks.each((i, link) => {
      const pageNum = parseInt($(link).text().trim());
      if (!isNaN(pageNum) && pageNum > maxPage) maxPage = pageNum;
    });
    if (maxPage > 1) totalPages = maxPage;
  }

  return { items, totalPages };
}