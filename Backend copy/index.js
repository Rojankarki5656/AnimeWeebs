import app from '@/app.js';

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Only start server if NOT on Vercel (local development with Bun)
if (!isVercel) {
  const port = process.env.PORT || 5000;
  
  // Check if running with Bun
  if (typeof Bun !== 'undefined') {
    const server = serve({
      port,
      fetch: app.fetch,
      idleTimeout: 20,
    });
    console.log(`server is running visit ${server.url}doc for docs`);
  } else {
    // Fallback for Node.js local development
    const { serve } = await import('@hono/node-server');
    serve({
      fetch: app.fetch,
      port,
    }, (info) => {
      console.log(`server is running visit http://localhost:${info.port}/doc for docs`);
    });
  }
}

// Export app for Vercel serverless functions
export default app;