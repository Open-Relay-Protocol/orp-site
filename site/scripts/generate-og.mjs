// Generates the 1200x630 Open Graph card at public/og/orp-og.png.
// Logo lockup on BG_DARK with the tagline. Run: npm run og
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "og");
mkdirSync(outDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0E1726"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#2F74E6"/>

  <!-- football mark -->
  <g transform="translate(120 150)">
    <ellipse cx="0" cy="0" rx="58" ry="36" transform="rotate(-20)" fill="none" stroke="#2F74E6" stroke-width="7"/>
    <g stroke="#ffffff" stroke-width="5" stroke-linecap="round">
      <line x1="-23" y1="8" x2="21" y2="-8"/>
      <line x1="-15" y1="-2" x2="-8" y2="6.5"/>
      <line x1="-5" y1="-5.5" x2="2" y2="3"/>
      <line x1="5" y1="-9" x2="12" y2="-0.5"/>
    </g>
  </g>
  <text x="205" y="172" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="700" letter-spacing="6" fill="#ffffff">ORP</text>

  <text x="120" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#f4f7fc">The rendezvous server</text>
  <text x="120" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#2F74E6">is structurally blind.</text>

  <text x="120" y="520" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="30" fill="#c2cad8">An enforced invariant, not a logging policy.</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(outDir, "orp-og.png"));
console.log("Wrote public/og/orp-og.png (1200x630)");
