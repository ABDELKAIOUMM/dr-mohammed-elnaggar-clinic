/**
 * Shared image metadata — the single source of truth for the responsive
 * variants of the two images that ship above the fold.
 *
 * Three consumers read this file, which is why it holds nothing but data (no
 * imports, no `.webp` references, so it is safe to load from `vite.config.ts`):
 *
 *  1. `src/images.ts` builds the `srcSet` / `sizes` attributes the app renders.
 *  2. `vite.config.ts` injects the hero portrait's `<link rel="preload"
 *     as="image">` into the *built* HTML.
 *  3. `scripts/optimize-images.mjs` must emit exactly these filenames — the
 *     script's header comment points back here, so keep the two in step.
 *
 * `sizes` describes CSS layout width, never pixels: the browser multiplies it by
 * the device pixel ratio and picks the cheapest sufficient candidate.
 */

export type ImageVariant = {
  /** Pixel width of the generated file, i.e. the `srcset` `w` descriptor. */
  width: number;
  /** Basename in `images/optimized/`, without the hash and `.webp` extension. */
  file: string;
};

/**
 * Navbar / footer mark. Drawn at `h-16 w-36` (144 px) and `sm:h-18 sm:w-40`
 * (160 px), so 160 px covers a 1x phone and 320 px a 2x one; the 384 px base is
 * kept as the 3x top step.
 *
 * The previous single 384 px lossless file weighed 47 KB — the second heaviest
 * asset on a page whose first paint waited for the JS bundle — to draw a 144 px
 * logo.
 */
export const LOGO_VARIANTS: readonly ImageVariant[] = [
  { width: 160, file: "logo-160" },
  { width: 320, file: "logo-320" },
  { width: 384, file: "logo-384" },
];

export const LOGO_SIZES = "(min-width: 640px) 160px, 144px";

/** Intrinsic size of the logo, kept in step with its `width`/`height` attrs. */
export const LOGO_INTRINSIC = { width: 384, height: 267 } as const;

/**
 * Hero portrait — also the LCP candidate once the headline paints instantly.
 * Its column is `max-w-md` (448 px) up to `lg` and roughly 46 vw inside the
 * desktop grid, so these three steps cover 1x–2x there without sending the
 * 900 px file to a phone that paints it 380 px wide.
 *
 * Every `file` carries its own width, including the largest step. That is not
 * cosmetic: the build looks each one up in the emitted bundle by filename, and a
 * bare `doctor` would also match `doctor-480-<hash>.webp`, silently mapping the
 * 900w `srcset` candidate onto the 480px file.
 *
 * All three share the source aspect ratio, so swapping candidates cannot shift
 * layout: the `width`/`height` attributes describe the largest step.
 */
export const DOCTOR_VARIANTS: readonly ImageVariant[] = [
  { width: 480, file: "doctor-480" },
  { width: 760, file: "doctor-760" },
  { width: 900, file: "doctor-900" },
];

export const DOCTOR_SIZES =
  "(min-width: 1024px) 46vw, (min-width: 640px) 448px, 92vw";

/** Intrinsic size of the portrait, kept in step with its `width`/`height` attrs. */
export const DOCTOR_INTRINSIC = { width: 900, height: 898 } as const;
