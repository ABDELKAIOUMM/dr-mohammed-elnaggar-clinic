import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "/dr-mohammed-elnaggar-clinic/",
  plugins: [react(), tailwindcss()],
  build: {
    // Emit images (and every other real asset) as separate, hashed, cacheable
    // files instead of inlining them as base64. Only sub-2 KB payloads — tiny
    // inline icons — are inlined.
    //
    // The project previously used `vite-plugin-singlefile`, which forced every
    // JS/CSS/image byte into one ~4.8 MB `index.html`. That document had to be
    // fully downloaded and parsed before the first paint (the 20 s FCP/LCP),
    // made lazy-loading impossible (the bytes were already in the HTML), and
    // ignored the CDN/caching benefits of hashed asset filenames.
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
