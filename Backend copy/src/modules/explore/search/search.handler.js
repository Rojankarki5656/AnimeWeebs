import extractSearch from './search.extract';
import { axiosInstance } from '@/services/axiosInstance';
import createEndpoint from '@/utils/createEndpoint';
import { NotFoundError, validationError } from '@/utils/errors';

export default async function searchHandler(c) {
  const { page, keyword } = c.req.valid('query');

  const endpoint = createEndpoint(`browser?keyword=${keyword}`, page);

  const result = await axiosInstance(endpoint);

  if (!result.success) {
    throw new validationError('make sure given endpoint is correct');
  }

  // Parse the JSON string
  let parsedData = result.data;
  if (typeof parsedData === 'string') {
    try {
      parsedData = JSON.parse(parsedData);
    } catch (e) {
      throw new validationError('Invalid JSON response from upstream');
    }
  }

  const html = parsedData?.result?.html;
  if (!html) {
    throw new NotFoundError('No search results found');
  }

  const items = extractSearch(html);

  if (items.length < 1) throw new NotFoundError();

  return c.json({
    success: true,
    keyword,
    count: items.length,
    items,
    moreLink: parsedData?.result?.linkMore || null,
  });
}