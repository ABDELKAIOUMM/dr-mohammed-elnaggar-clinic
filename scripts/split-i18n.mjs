/**
 * TEMPORARY codemod — splits `src/i18n.tsx` into `src/i18n/{en,ar,index}.ts(x)`.
 *
 * Both dictionaries are sliced out of the original file byte-for-byte; nothing is
 * retyped, so the Arabic copy in particular cannot drift. Only three things are
 * rewritten: the dead keys, the treatment list, and the provider.
 *
 * Delete this file once the split is verified.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcPath = path.join(root, "src", "i18n.tsx");
const outDir = path.join(root, "src", "i18n");

const src = readFileSync(srcPath, "utf8");
const nl = src.includes("\r\n") ? "\r\n" : "\n";

const at = (needle) => {
  const index = src.indexOf(needle);
  if (index < 0) throw new Error(`marker not found: ${needle}`);
  return index;
};

// ---------------------------------------------------------------- slice out
const enBlock = src.slice(at("const en = {"), at("export type Content = typeof en;"));
const arBlock = src.slice(at("const ar: Content = {"), at("const content: Record<Lang, Content> = { ar, en };"));
const tail = src.slice(at("const content: Record<Lang, Content> = { ar, en };"));

// ------------------------------------------------------- prune dead content
/**
 * Fields that only the deleted `Treatments` section or the deleted footer column
 * ever read. Verified against the live tree before removing: `treatmentsChoose`
 * and the `treatments` list itself stay, because the booking form in `Hero` still
 * renders them as the treatment `<option>` list.
 */
const REMOVALS = [
  [/^[ \t]*treatments: "[^"]*",\r?\n/m, "nav.treatments"],
  [/^[ \t]*ctaExplore: "[^"]*",\r?\n/m, "hero.ctaExplore"],
  [/^[ \t]*treatmentsEyebrow:.*\r?\n/m, "treatmentsEyebrow"],
  [/^[ \t]*treatmentsTitleA:.*\r?\n/m, "treatmentsTitleA"],
  [/^[ \t]*treatmentsTitleB:.*\r?\n/m, "treatmentsTitleB"],
  [/^[ \t]*treatmentsBook:.*\r?\n/m, "treatmentsBook"],
  [/^[ \t]*treatmentsAsk:.*\r?\n/m, "treatmentsAsk"],
  [/^[ \t]*footerTreatments:.*\r?\n/m, "footerTreatments"],
];

function prune(block, label) {
  let out = block;

  for (const [pattern, what] of REMOVALS) {
    const before = out;
    out = out.replace(pattern, "");
    if (out === before) throw new Error(`${label}: nothing removed for ${what}`);
  }

  const arrayPattern = /^[ \t]*treatments: \[\s\S]*?^  \],\r?\n/m;
  const array = out.match(arrayPattern);
  if (!array) throw new Error(`${label}: treatments array not found`);

  const pairs = [...array[0].matchAll(/^[ \t]*id: "([^"]+)",\r?\n[ \t]*name: "([^"]+)",/gm)];
  if (pairs.length !== 6) throw new Error(`${label}: expected 6 treatments, saw ${pairs.length}`);

  const slim =
    "  treatments: [" +
    nl +
    pairs.map(([, id, name]) => `    { id: "${id}", name: "${name}" },`).join(nl) +
    nl +
    "  ]," +
    nl;

  return out.replace(arrayPattern, slim);
}

const en = prune(enBlock, "en").replace(/^const en = \{/m, "export const en = {");
const ar = prune(arBlock, "ar").replace(/^const ar: Content = \{/m, "export const ar: Content = {");


// ------------------------------------------------------------ shared header
const imageImports = src
  .slice(at("import implant1 from"), at("export type Lang"))
  .trimEnd()
  .replace(/"\.\.\/images\//g, '"../../images/');

// ---------------------------------------------------------------- index.tsx
const providerAt = tail.indexOf("export function I18nProvider");
const useI18nAt = tail.indexOf("export const useI18n");
if (providerAt < 0 || useI18nAt < 0) throw new Error("provider / useI18n not found");

const before = tail
  .slice(0, providerAt)
  .replace(/^const content: Record<Lang, Content> = \{ ar, en \};\r?\n\r?\n/m, "");
const after = tail.slice(useI18nAt);

const header = [
  "import {",
  "  createContext,",
  "  useContext,",
  "  useEffect,",
  "  useState,",
  "  type ReactNode,",
  '} from "react";',
  'import { ar } from "./ar";',
  'import type { Content } from "./en";',
  "",
  'export type { Content } from "./en";',
  "",
  'export type Lang = "ar" | "en";',
  "",
  "/**",
  " * Dictionary loading.",
  " *",
  " * Arabic is the default locale — the one the page opens in, and the one every",
  " * visitor would have downloaded. It stays in the entry bundle. English does not",
  " * belong there: only a visitor who has deliberately switched pays for it, and",
  " * `md-lang` keeps them there on the next visit. Moving it out takes a chunk off",
  " * the bundle that gates the first paint, for the price of one extra request that",
  " * only English readers ever make.",
  " *",
  " * The promise is memoised so switching back and forth resolves from memory.",
  " */",
  "let englishChunk: Promise<Content> | null = null;",
  'const loadEnglish = () => (englishChunk ??= import("./en").then((module) => module.en));',
  "",
].join(nl);

const provider = [
  'export function I18nProvider({ children }: { children: ReactNode }) {',
  "  const [lang, setLangState] = useState<Lang>(() => {",
  "    try {",
  '      return localStorage.getItem("md-lang") === "en" ? "en" : "ar";',
  "    } catch {",
  '      return "ar";',
  "    }",
  "  });",
  "  const [english, setEnglish] = useState<Content | null>(null);",
  "",
  "  const setLang = (l: Lang) => {",
  "    setLangState(l);",
  "    try {",
  '      localStorage.setItem("md-lang", l);',
  "    } catch {",
  "      /* ignore */",
  "    }",
  "  };",
  "",
  "  useEffect(() => {",
  '    if (lang !== "en" || english) return;',
  "    let live = true;",
  "    loadEnglish().then((content) => {",
  "      if (live) setEnglish(content);",
  "    });",
  "    return () => {",
  "      live = false;",
  "    };",
  "  }, [lang, english]);",
  "",
  "  useEffect(() => {",
  "    document.documentElement.lang = lang;",
  "    // English is always LTR and its dictionary may not have arrived yet, so the",
  "    // direction is taken from the language rather than from the loaded content.",
  '    document.documentElement.dir = lang === "ar" ? ar.dir : "ltr";',
  "    document.title = titles[lang];",
  "  }, [lang]);",
  "",
  "  // Arabic is always in memory; English is a separate request. Rendering nothing",
  "  // for that one round trip is what stops an English reader from watching the",
  "  // page paint right-to-left and then re-flow.",
  '  const active = lang === "en" ? english : ar;',
  "  if (!active) return null;",
  "",
  "  return (",
  "    <Ctx.Provider value={{ lang, setLang, t: active }}>{children}</Ctx.Provider>",
  "  );",
  "}",
  "",
].join(nl);