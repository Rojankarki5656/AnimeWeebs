import { createRoute, z } from '@hono/zod-openapi';

const AnimeCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  poster: z.string().url().nullable(),
  rank: z.number().optional(),
  detailId: z.string().nullable().optional(),
  episodes: z.object({
    sub: z.number().optional(),
    dub: z.number().optional(),
    eps: z.number().optional(),
  }).optional(),
  type: z.string().optional(),
  duration: z.string().optional(),
  rating: z.number().optional(),
  synopsis: z.string().optional(),
});

const homeResponseSchema = z.object({
  status: z.boolean(),
  data: z.object({
    trendingNow: z.array(AnimeCardSchema),
    popularThisSeason: z.array(AnimeCardSchema),
    upcomingNextSeason: z.array(AnimeCardSchema),
    allTimePopular: z.array(AnimeCardSchema),
    top100: z.array(AnimeCardSchema),
  }),
});

const homeSchema = createRoute({
  method: 'get',
  path: '/home',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: homeResponseSchema,
        },
      },
    },
  },
  description: 'Retrieve HomePage Data from AniList search page',
});

export default homeSchema;