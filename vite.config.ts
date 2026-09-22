import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { DOCTOR_SIZES, DOCTOR_VARIANTS } from "./src/image-sizes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Upper bound for the inline stylesheet. Tailwind emits ~62 KB (≈12 KB gzipped)
 * for this page, which is comfortably worth inlining; if the sheet ever grows
 * past this the plugin leaves it external instead.
 */
const MAX_INLINE_CSS_BYTES = 100 * 1024;

/**
 * Two transforms on the emitted `index.html`.
 *
 * Both run on the *bundle* rather than on the source HTML, because both need the
 * content-hashed asset filenames that only exist while Rollup emits.
 *
 * 1. Inline the stylesheet.
 *
 *    `<link rel="stylesheet">` is a render-blocking request, and the audit
 *    charged it ~330 ms. It is inlined **after** Vite's `<script type="module">`,
 *    so the JS fetch — which is what actually gates first paint on this page,
 *    since every element is client-rendered — is still discovered at the same
 *    point in the document. The document grows by ~12 KB gzipped and loses a
 *    network round trip.
 *
 *    The usual `rel="preload" as="style" onload="this.rel='stylesheet'"` trick
 *    was rejected on purpose: with an empty `#root` there is no markup to flash
 *    unstyled, but there is also nothing to style, so a late-arriving sheet could
 *    only restyle the very hero text we are trying to paint early.
 *
 * 2. Preload the hero portrait.
 *
 *    It is an LCP candidate whose URL lives only inside the JS bundle, so without
 *    a `<link>` in the initial document its fetch cannot start until the bundle
 *    has downloaded and run. The `imagesrcset`/`imagesizes` pair is built from the
 *    filenames Rollup actually emitted and from the same `sizes` string the
 *    `<img>` uses, so the preloaded candidate and the painted one always match.
 *
 * Both steps fail open: anything unexpected produces a warning and an untouched
 * build, never a broken deploy.
 */
function criticalAssets(): Plugin {
  let base = "/";

  return {
    name: "clinic:critical-assets",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      base = config.base;
    },
    generateBundle(_options, bundle) {
      const htmlKey = Object.keys(bundle).find((key) => key.endsWith("index.html"));
      const html = htmlKey ? bundle[htmlKey] : undefined;
      if (!html || html.type !== "asset") return;

      let source = String(html.source);

      // ---- 1. hero portrait preload ---------------------------------------
      // Every variant filename carries its own width (`doctor-480`, `doctor-760`,
      // `doctor-900`), so `<file>-<hash>.webp` identifies exactly one asset. This
      // matters: a bare `doctor` would also match `doctor-480-<hash>.webp` and map
      // the 900w `srcset` candidate onto the 480px file, which is the bug the
      // explicit widths in `image-sizes.ts` exist to prevent.
      const found = DOCTOR_VARIANTS.map((variant) => {
        const pattern = new RegExp(`(^|/)${escapeRegExp(variant.file)}-[\\w-]+\\.webp$`);
        const key = Object.keys(bundle).find((candidate) => pattern.test(candidate));
        return key ? { width: variant.width, url: base + key } : null;
      });

      // A second net for the same class of mistake: every variant must land on a
      // different file, otherwise the preload would advertise a width it does not
      // have.
      const distinct = new Set(found.map((entry) => entry?.url)).size === found.length;

      if (found.some((entry) => entry === null) || !distinct) {
        this.warn(
          "hero preload skipped: the portrait variants did not resolve to one distinct file each",
        );
      } else {
        const variants = found as { width: number; url: string }[];
        const widest = variants.reduce((a, b) => (a.width > b.width ? a : b));
        source = source.replace(
          "</head>",
          [
            "    <!-- LCP candidate. Injected here rather than rendered by React so the",
            "         fetch starts while the document is still being parsed. -->",
            `    <link rel="preload" as="image" href="${widest.url}"`,
            `      imagesrcset="${variants.map((v) => `${v.url} ${v.width}w`).join(", ")}"`,
            `      imagesizes="${DOCTOR_SIZES}" fetchpriority="high" />`,
            "  </head>",
          ].join("\n"),
        );
      }

      // ---- 2. inline the stylesheet ---------------------------------------
      const cssKeys = Object.keys(bundle).filter((key) => key.endsWith(".css"));
      const css = cssKeys
        .map((key) => {
          const asset = bundle[key];
          if (!asset || asset.type !== "asset") return "";
          return typeof asset.source === "string"
            ? asset.source
            : Buffer.from(asset.source).toString("utf8");
        })
        .join("");

      const fileName = cssKeys.length === 1 ? (cssKeys[0].split("/").pop() ?? "") : "";
      const inlinable =
        cssKeys.length === 1 &&
        css.length > 0 &&
        css.length <= MAX_INLINE_CSS_BYTES &&
        !/<\/style/i.test(css) &&
        source.includes(fileName);

      if (!inlinable) {
        this.warn(
          `stylesheet left external (${cssKeys.length} file(s), ${css.length} bytes, ` +
            `inlining ${MAX_INLINE_CSS_BYTES} bytes max)`,
        );
      } else {
        const link = new RegExp(`<link[^>]*href="[^"]*${escapeRegExp(fileName)}"[^>]*>`, "gi");
        source = source
          .replace(link, "")
          .replace("</head>", `    <style>${css}</style>\n  </head>`);
        for (const key of cssKeys) delete bundle[key];
      }

      html.source = source;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "/dr-mohammed-elnaggar-clinic/",
  plugins: [react(), tailwindcss(), criticalAssets()],
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
