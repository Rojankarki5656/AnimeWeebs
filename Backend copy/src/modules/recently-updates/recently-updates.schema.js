import { createRoute, z } from '@hono/zod-openapi';

const updateItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  japaneseTitle: z.string().optional(),
  poster: z.string().url(),
  currentEpisode: z.number().nullable(),
  subEpisodes: z.number(),
  dubEpisodes: z.number(),
  totalEpisodes: z.number().nullable(),
  type: z.string(),
});

const updatesResponseSchema = z.object({
  success: z.boolean(),
  page: z.number(),
  items: z.array(updateItemSchema),
  hasNextPage: z.boolean(),
});

const updatesSchema = createRoute({
  method: 'get',
  path: '/recentlyupdates',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ description: 'Page number', example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: updatesResponseSchema } },
      description: 'Paginated list of recently updated anime',
    },
    400: { description: 'Invalid page number' },
    404: { description: 'Updates not found' },
  },
  description: 'Get recently updated anime episodes (uses name=all-updates internally)',
});

export default updatesSchema;