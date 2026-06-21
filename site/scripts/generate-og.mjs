// Generates the 1200x630 Open Graph card at public/og/orp-og.png.
// Composites the ORP brand lockup onto BG_DARK with the tagline. If the brand
// lockup is not present yet, it falls back to a drawn football mark so the
// build never breaks. Run: npm run og
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Share Tech — the official ORP display/brand typeface. The .ttf is bundled in
// the repo and registered with the fontconfig that sharp's SVG renderer uses,
// so the card renders in the brand face during CI builds without depending on
// a system-installed font. FONTCONFIG_FILE must be set before sharp loads.
const fontsDir = join(__dirname, "fonts");
const fcCacheDir = join(tmpdir(), "orp-fontconfig-cache");
const fcConfPath = join(tmpdir(), "orp-fonts.conf");
mkdirSync(fcCacheDir, { recursive: true });
writeFileSync(
  fcConfPath,
  `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <cachedir>${fcCacheDir}</cachedir>
</fontconfig>
`,
);
process.env.FONTCONFIG_FILE = fcConfPath;

const sharp = (await import("sharp")).default;

const outDir = join(__dirname, "..", "public", "og");
const logoPath = join(__dirname, "..", "public", "logos", "orp-logo-white.png");
mkdirSync(outDir, { recursive: true });

const hasLogo = existsSync(logoPath);
const BRAND = "Share Tech";

// Drawn brand mark (filled football lens + ORP wordmark), used only when the
// brand lockup PNG is absent. Once public/logos/orp-logo-white.png is committed
// the real lockup is composited instead.
const drawnMark = `
  <g transform="translate(120 150)">
    <path d="M-60 0 C-32 -34 32 -34 60 0 C32 34 -32 34 -60 0 Z" fill="none" stroke="#2F74E6" stroke-width="7"/>
  </g>
  <text x="205" y="172" font-family="${BRAND}" font-size="96" letter-spacing="6" fill="#ffffff">ORP</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0E1726"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#2F74E6"/>
  ${hasLogo ? "" : drawnMark}
  <text x="120" y="350" font-family="${BRAND}" font-size="76" fill="#f4f7fc">The rendezvous server</text>
  <text x="120" y="438" font-family="${BRAND}" font-size="76" fill="#2F74E6">is structurally blind.</text>
  <text x="120" y="524" font-family="${BRAND}" font-size="32" fill="#c2cad8">An enforced invariant, not a logging policy.</text>
</svg>`;

let pipeline = sharp(Buffer.from(svg));

if (hasLogo) {
  // Place the brand lockup in the top-left, above the tagline.
  const logo = await sharp(logoPath).resize({ height: 200, fit: "inside" }).toBuffer();
  pipeline = pipeline.composite([{ input: logo, top: 50, left: 110 }]);
}

await pipeline.png().toFile(join(outDir, "orp-og.png"));
console.log(
  `Wrote public/og/orp-og.png (1200x630)${hasLogo ? " with brand lockup" : " (drawn fallback)"}`,
);
