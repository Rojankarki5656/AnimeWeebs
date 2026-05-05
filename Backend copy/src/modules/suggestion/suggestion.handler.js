import { validationError } from '@/utils/errors';
import config from '@/config/config';
import suggestionExtract from './suggestion.extract';

export default async function suggestionHandler(c) {
  const { keyword } = c.req.valid('query');

  const endpoint = `ajax/anime/search?keyword=${keyword}`;
  const Referer = `${config.baseurl}/home`;
  const res = await fetch(config.baseurl + endpoint, {
    headers: {
      Referer,
      ...config.headers,
    },
  });

  console.log("Suggestion API Response Status:", res);
  const data = await res.json();
  if (!data.status) throw new validationError('suggestion not found');

  const response = suggestionExtract(data.result.html);

  return response;
}
