/**
 * Typed access to the optimized image files, plus the responsive `srcSet`
 * strings built from them.
 *
 * Vite rewrites each import into a hashed URL, so the width has to stay paired
 * with the right file. That pairing lives in `image-sizes.ts`; the two are
 * joined here by the shared `file` key.
 */
import doctor480 from "../images/optimized/doctor-480.webp";
import doctor760 from "../images/optimized/doctor-760.webp";
import doctor900 from "../images/optimized/doctor-900.webp";
import logo160 from "../images/optimized/logo-160.webp";
import logo320 from "../images/optimized/logo-320.webp";
import logo384 from "../images/optimized/logo-384.webp";
import {
  DOCTOR_VARIANTS,
  LOGO_VARIANTS,
  type ImageVariant,
} from "./image-sizes";

/** `file` key from `image-sizes.ts` -> hashed URL emitted by Vite. */
const URLS: Record<string, string> = {
  "doctor-480": doctor480,
  "doctor-760": doctor760,
  "doctor-900": doctor900,
  "logo-160": logo160,
  "logo-320": logo320,
  "logo-384": logo384,
};

/**
 * Builds a `srcset` string.
 *
 * A variant whose import was forgotten is reported and skipped rather than
 * emitted as `undefined 480w`: that would silently drop the candidate and send
 * every device back to the full-width `src`, which is the exact regression this
 * module exists to prevent.
 */
function toSrcSet(variants: readonly ImageVariant[]): string {
  return variants
    .map((variant) => {
      const url = URLS[variant.file];
      if (!url) {
        console.warn(
          `images.ts: no URL for variant "${variant.file}" — run \`npm run optimize:images\` and import it here`,
        );
        return "";
      }
      return `${url} ${variant.width}w`;
    })
    .filter(Boolean)
    .join(", ");
}

/** Largest logo file — only ever fetched by browsers that ignore `srcset`. */
export const logoSrc = logo384;
export const logoSrcSet = toSrcSet(LOGO_VARIANTS);

/** Largest portrait — only ever fetched by browsers that ignore `srcset`. */
export const doctorSrc = doctor900;
export const doctorSrcSet = toSrcSet(DOCTOR_VARIANTS);

/**
 * Re-exported under camelCase names so call sites read the same way as
 * `doctorSrc` / `logoSrcSet` etc.
 */
export {
  DOCTOR_INTRINSIC as doctorIntrinsic,
  DOCTOR_SIZES as doctorSizes,
  LOGO_INTRINSIC as logoIntrinsic,
  LOGO_SIZES as logoSizes,
  type ImageVariant,
} from "./image-sizes";
