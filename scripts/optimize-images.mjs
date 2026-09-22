/**
 * One-off image optimizer — run with `npm run optimize:images`.
 *
 * The landing page shipped a handful of photos saved at print/full resolution:
 * a 548 KB PNG logo, 660 KB WebP treatment shots and an 844 KB clinic photo.
 * Those bytes used to be base64-inlined into the HTML by
 * `vite-plugin-singlefile`; they are now emitted as real files, so their size
 * drives the total page weight directly.
 *
 * This script re-encodes every image that the app imports at the largest size
 * it is actually displayed, converts it to WebP, and writes the result to
 * `images/optimized/`. Re-run it whenever a source photo is replaced.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "images");
const outDir = path.join(srcDir, "optimized");

/**
 * `maxWidth` targets 2x the largest CSS width the image is ever rendered at.
 * `lossless` is used for the flat-colour logo, where lossy WebP rings around
 * the thin letterforms.
 */
const jobs = [
  { input: "doctor.jpg", output: "doctor.webp", maxWidth: 900, quality: 80 }, // hero portrait (LCP)
  { input: "logo.png", output: "logo.webp", maxWidth: 384, lossless: true }, // navbar/footer logo
  { input: "Clinic photos.jpeg", output: "clinic-1.webp", maxWidth: 1400, quality: 78 },
  { input: "Clinic photos2.jpeg", output: "clinic-2.webp", maxWidth: 1400, quality: 78 },
  { input: "implant1.webp", output: "implant1.webp", maxWidth: 1000, quality: 78 },
  { input: "implant2.webp", output: "implant2.webp", maxWidth: 1000, quality: 78 },
  { input: "implant3.jpg", output: "implant3.webp", maxWidth: 1000, quality: 78 },
  { input: "ortho1.jpg", output: "ortho1.webp", maxWidth: 900, quality: 78 },
  { input: "ortho2.jpg", output: "ortho2.webp", maxWidth: 900, quality: 78 },
  { input: "ortho3.jpg", output: "ortho3.webp", maxWidth: 900, quality: 78 },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(outDir, { recursive: true });

let before = 0;
let after = 0;

for (const job of jobs) {
  const inputPath = path.join(srcDir, job.input);
  const outputPath = path.join(outDir, job.output);

  const meta = await sharp(inputPath).metadata();
  const sourceBytes = (await stat(inputPath)).size;

  const pipeline = sharp(inputPath).rotate(); // honour EXIF orientation
  const resized = (meta.width ?? 0) > job.maxWidth;
  if (resized) pipeline.resize({ width: job.maxWidth, withoutEnlargement: true });

  await (job.lossless
    ? pipeline.webp({ lossless: true, effort: 6 })
    : pipeline.webp({ quality: job.quality, effort: 6 })
  ).toFile(outputPath);

  const outMeta = await sharp(outputPath).metadata();
  const outBytes = (await stat(outputPath)).size;
  before += sourceBytes;
  after += outBytes;

  const dims = `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`;
  console.log(
    `${job.output.padEnd(15)} ${kb(sourceBytes).padStart(8)} -> ${kb(outBytes).padStart(8)}   ${dims}`,
  );
}

console.log(`\nTotal ${kb(before)} -> ${kb(after)}  (saved ${kb(before - after)})`);
