import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSitemap from "vite-plugin-sitemap";

// Use environment variable for API URL (fallback to localhost)
const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [
    react(),
    viteSitemap({
      hostname: "https://animeweebs.app",
      // Static routes that always exist
      dynamicRoutes: ["/", "/home", "/trending", "/popular", "/latest-episodes"],
      // Dynamically fetch anime IDs – but note: runs at build time
      async routes() {
        try {
          // Use native fetch (Node 18+) or install node-fetch
          const response = await fetch(`${API_URL}/api/v1/home`);
          if (!response.ok) throw new Error(`API responded with ${response.status}`);
          const data = await response.json();
          const animeIds = data?.data?.trending?.map((item) => `/anime/${item.id}`) || [];
          // Add any other dynamic routes from other sections if needed
          return ["/", "/home", ...animeIds];
        } catch (err) {
          console.warn("⚠️ Could not fetch anime IDs for sitemap, using fallback.");
          // Fallback to at least the static routes
          return ["/", "/home"];
        }
      },
      outDir: "dist",
    }),
  ],
});