import { createRoute, z } from '@hono/zod-openapi';

const serverObject = z.object({
  name: z.string(),
  server_id: z.string(),
  episode_id: z.string(),
  link_id: z.string(),
});

// Schema for the data inside the wrapper
const dataSchema = z.object({
  watching: z.string(),
  servers: z.record(z.string(), z.array(serverObject)),
});

// The global wrapper adds success and data
const wrappedResponseSchema = z.object({
  success: z.boolean(),
  data: dataSchema,
});

const serversSchema = createRoute({
  method: 'get',
  path: '/servers/{ep_token}',
  request: {
    params: z.object({
      ep_token: z.string().openapi({
        description: 'Episode token from episodes list',
        example: 'cYTnuvrxtU7h23RB0Zvd',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: wrappedResponseSchema,
        },
      },
      description: 'Returns available servers for the episode',
    },
    404: {
      description: 'Servers not found',
    },
  },
  description: 'Retrieve available servers for an episode using the episode token',
});

export default serversSchema;