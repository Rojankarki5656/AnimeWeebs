import app from '@/app.js';
import { serve } from 'bun';

const port = process.env.PORT || 5000;
const server = serve({
  port,
  fetch: app.fetch,
  idleTimeout: 20,
});

console.log(`server is running visit ${server.url}doc for docs`);
