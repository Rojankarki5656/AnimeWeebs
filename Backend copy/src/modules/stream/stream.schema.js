import { createRoute, z } from '@hono/zod-openapi';

const trackSchema = z.object({
  file: z.string().url(),
  label: z.string(),
  kind: z.enum(['captions', 'thumbnails']),
  default: z.boolean(),
});

const sourceSchema = z.object({
  file: z.string().url(),
  type: z.string().optional(),
  label: z.string().optional(),
});

const skipSchema = z.object({
  intro: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
  outro: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
});

const streamResponseSchema = z.object({
  success: z.boolean(),
  embed_url: z.string().url(),
  skip: skipSchema,
  sources: z.array(sourceSchema),
  tracks: z.array(trackSchema),
  download: z.string().url().optional(),
});

const streamSchema = createRoute({
  method: 'get',
  path: '/stream',
  request: {
    query: z.object({
      link_id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: streamResponseSchema,
        },
      },
      description: 'Returns streaming sources for the episode',
    },
    400: {
      description: 'Invalid link_id',
    },
    404: {
      description: 'Source not found',
    },
  },
  description: 'Resolve streaming source using link_id from servers endpoint',
});

export default streamSchema;