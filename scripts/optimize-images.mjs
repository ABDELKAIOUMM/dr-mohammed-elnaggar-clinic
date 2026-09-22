/**
 * One-off image optimizer — run with `npm run optimize:images`.
 *
 * The landing page shipped a handful of photos saved at print/full resolution:
 * a 548 KB PNG logo, 660 KB WebP treatment shots and an 844 KB clinic photo.
 * Those bytes used to be base64-inlined into the HTML by
 * `vite-plugin-singlefile`; they are now emitted as real files, so their size
 * drives the total page weight directly.
 *
 * This script re-encodes every image that the app imports at the sizes it is
 * actually displayed, converts the result to WebP, and writes it to
 * `images/optimized/`. Re-run it whenever a source photo is replaced.
 *
 * The two images drawn far smaller than they are stored — the hero portrait and
 * the navbar logo — emit several widths instead of one, so `srcset` can send a
 * phone the pixels it will really paint. Their filenames and widths are mirrored
 * (as plain data) in `src/image-sizes.ts`, which feeds both the `srcSet` the app
 * renders and the `<link rel="preload">` the build injects; change both together.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "images");
const outDir = path.join(srcDir, "optimized");

/**
 * A job emits one file (`output`) or a set of steps (`variants`).
 *
 * `width` is the ceiling for that step — nothing is ever upscaled, so no step
 * ever advertises a `srcset` descriptor larger than the file really is.
 * `lossless` is used for the flat-colour logo, where lossy WebP rings around the
 * thin letterforms.
 */
const jobs = [
  // Hero portrait, and the LCP candidate once the headline paints instantly.
  // Drawn at `max-w-md` (448px) on phones and ~46vw on desktop; previously one
  // 900px file served every device including a 380px phone slot.
  {
    input: "doctor.jpg",
    variants: [
      { output: "doctor-480.webp", width: 480, quality: 80 },
      { output: "doctor-760.webp", width: 760, quality: 80 },
      { output: "doctor-900.webp", width: 900, quality: 80 },
    ],
  },
  // Navbar/footer mark, drawn at 144px (160px from `sm`). Lossless, so cutting
  // 384px down to 160px removes roughly 70% of the bytes a 1x screen downloads.
  {
    input: "logo.png",
    variants: [
      { output: "logo-160.webp", width: 160, lossless: true },
      { output: "logo-320.webp", width: 320, lossless: true },
      { output: "logo-384.webp", width: 384, lossless: true },
    ],
  },
  { input: "Clinic photos.jpeg", output: "clinic-1.webp", width: 1400, quality: 78 },
  { input: "Clinic photos2.jpeg", output: "clinic-2.webp", width: 1400, quality: 78 },
  { input: "implant1.webp", output: "implant1.webp", width: 1000, quality: 78 },
  { input: "implant2.webp", output: "implant2.webp", width: 1000, quality: 78 },
  { input: "implant3.jpg", output: "implant3.webp", width: 1000, quality: 78 },
  { input: "ortho1.jpg", output: "ortho1.webp", width: 900, quality: 78 },
  { input: "ortho2.jpg", output: "ortho2.webp", width: 900, quality: 78 },
  { input: "ortho3.jpg", output: "ortho3.webp", width: 900, quality: 78 },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const stepsOf = (job) =>
  job.variants ?? [
    { output: job.output, width: job.width, quality: job.quality, lossless: job.lossless },
  ];

await mkdir(outDir, { recursive: true });

let before = 0;
let after = 0;

for (const job of jobs) {
  const inputPath = path.join(srcDir, job.input);
  const meta = await sharp(inputPath).metadata();
  const sourceBytes = (await stat(inputPath)).size;
  before += sourceBytes;

  const lines = [];
  let jobBytes = 0;

  for (const step of stepsOf(job)) {
    const outputPath = path.join(outDir, step.output);

    const pipeline = sharp(inputPath).rotate(); // honour EXIF orientation
    if ((meta.width ?? 0) > step.width) {
      pipeline.resize({ width: step.width, withoutEnlargement: true });
    }

    await (step.lossless
      ? pipeline.webp({ lossless: true, effort: 6 })
      : pipeline.webp({ quality: step.quality, effort: 6 })
    ).toFile(outputPath);

    const outMeta = await sharp(outputPath).metadata();
    const outBytes = (await stat(outputPath)).size;
    jobBytes += outBytes;

    // A source narrower than the requested step is left alone, which would make
    // the `srcset` descriptor a lie. Surface it instead of failing silently.
    const capped =
      outMeta.width === step.width ? "" : `   ! source caps at ${outMeta.width}px`;

    lines.push(
      `${step.output.padEnd(17)} ${kb(outBytes).padStart(7)}   ${outMeta.width}x${outMeta.height}${capped}`,
    );
  }

  after += jobBytes;
  console.log(
    `${job.input.padEnd(20)} ${kb(sourceBytes).padStart(7)} -> ${kb(jobBytes).padStart(7)}   ${meta.width}x${meta.height}`,
  );
  for (const line of lines) console.log(`  ${line}`);
}

console.log(`\nTotal source ${kb(before)} -> ${kb(after)} emitted`);
console.log(
  "A browser downloads exactly one variant per <img>, so the emitted total is the",
);
console.log("worst case rather than the typical transfer.");
