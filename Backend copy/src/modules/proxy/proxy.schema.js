import { createRoute, z } from '@hono/zod-openapi';

const proxySchema = createRoute({
  method: 'get',
  path: '/proxy',
  request: {
    query: z.object({
      url: z.string().openapi({ description: 'The remote URL to proxy' }),
    }),
  },
  responses: {
    200: {
      description: 'Proxied resource',
    },
    400: { description: 'Bad request' },
    403: { description: 'Forbidden host' },
  },
  description: 'Proxy a whitelisted external resource',
});

export default proxySchema;
