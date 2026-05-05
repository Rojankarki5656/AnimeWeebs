import { createRoute, z } from '@hono/zod-openapi';

const newReleaseItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  japaneseTitle: z.string().optional(),
  poster: z.string().url(),
  subEpisodes: z.number(),
  dubEpisodes: z.number(),
  totalEpisodes: z.number().nullable(),
  type: z.string(),
  isAdult: z.boolean(),
});

const newReleasesResponseSchema = z.object({
  success: z.boolean(),
  page: z.number(),
  totalPages: z.number(),
  items: z.array(newReleaseItemSchema),
});

const newReleasesSchema = createRoute({
  method: 'get',
  path: '/new-releases',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ description: 'Page number', example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: newReleasesResponseSchema } },
      description: 'Paginated list of newly released anime',
    },
    400: { description: 'Invalid page number' },
    404: { description: 'New releases not found' },
  },
  description: 'Get new releases (full HTML scrape)',
});

export default newReleasesSchema;