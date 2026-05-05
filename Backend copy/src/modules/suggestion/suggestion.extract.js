import { commonAnimeObj } from '@/utils/commonAnimeObj';
import { load } from 'cheerio';

export default function suggestionExtract(html) {
  const $ = load(html);

  const response = [];

  $('.aitem').each((i, el) => {
    const obj = {
      ...commonAnimeObj,
      aired: null,
      type: null,
      duration: null,
    };

    // ID
    const href = $(el).attr('href');
    obj.id = href?.split('/').pop() || null;

    // Poster
    obj.poster = $(el).find('img').attr('src') || null;

    // Title
    const titleEl = $(el).find('.title');
    obj.title = titleEl.text().trim() || null;
    obj.alternativeTitle = titleEl.attr('data-jp') || null;

    // Info
    const infoSpans = $(el).find('.info span');

    obj.aired = infoSpans.eq(2)?.text() || null; // year
    obj.type = infoSpans.eq(3)?.text() || null;  // TV/Movie
    obj.duration = null; // not available here

    response.push(obj);
  });

  return response;
}