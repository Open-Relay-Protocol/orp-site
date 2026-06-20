// Generates public/llms.txt (concise index) and public/llms-full.txt (full
// reference text) from the MDX sources, so they stay in sync with content.
// Run: npm run llms  (also runs automatically in prebuild)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SITE, BASE } from "../site.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docsDir = join(root, "src", "content", "docs");

// Explicit reading order. Each entry maps a source file to its URL path.
const pages = [
  ["docs/overview.mdx", "/docs/overview/"],
  ["docs/quickstart.mdx", "/docs/quickstart/"],
  ["docs/whitepaper.mdx", "/docs/whitepaper/"],
  ["docs/protocol.mdx", "/docs/protocol/"],
  ["docs/blindness.mdx", "/docs/blindness/"],
  ["docs/crypto.mdx", "/docs/crypto/"],
  ["docs/threat-model.mdx", "/docs/threat-model/"],
  ["docs/operating-the-board.mdx", "/docs/operating-the-board/"],
  ["docs/transport-gap.mdx", "/docs/transport-gap/"],
  ["docs/api.mdx", "/docs/api/"],
  ["docs/identity-rotation.mdx", "/docs/identity-rotation/"],
  ["docs/neighbor-propagation.mdx", "/docs/neighbor-propagation/"],
  ["docs/faq.mdx", "/docs/faq/"],
  ["compare.mdx", "/compare/"],
];

function parse(file) {
  const raw = readFileSync(join(docsDir, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = m ? m[1] : "";
  let body = m ? m[2] : raw;
  const title = (fm.match(/^title:\s*(.+)$/m) || [])[1]?.trim() || file;
  const description = (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || "";
  // Light cleanup for plain-text ingestion.
  body = body
    .replace(/^import\s.+$/gm, "")
    .replace(/:::[a-z]*\n?/g, "")
    .replace(/<div class="orp-source">[\s\S]*?<\/div>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title, description, body };
}

const abs = (p) =>
  new URL((BASE === "/" ? "" : BASE.replace(/\/$/, "")) + p, SITE).href;

// llms.txt: concise index
let index = `# ORP\n\n`;
index += `> ORP is a device-first messaging protocol whose rendezvous server is structurally unable to read message contents, keys, or unsealed signaling. An enforced invariant, not a logging policy.\n\n`;
index += `- [Home](${abs("/")}): the landing page and project summary.\n`;
index += `- [Comparison](${abs("/compare/")}): blind rendezvous vs trusted signaling servers.\n\n`;
index += `## Docs\n\n`;
for (const [file, url] of pages) {
  if (url === "/compare/") continue;
  const { title, description } = parse(file);
  index += `- [${title}](${abs(url)}): ${description}\n`;
}
mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "llms.txt"), index);

// llms-full.txt: full reference text concatenated
let full = `# ORP, full reference\n\nSource: ${SITE}\n\n`;
full += `ORP is a device-first messaging protocol whose rendezvous server is structurally unable to read message contents, keys, or unsealed signaling. An enforced invariant, not a logging policy.\n\n`;
full += `Note: this site was authored from a build handoff brief. Protocol claims are provisional until verified against the upstream SPEC and core sources.\n\n`;
for (const [file, url] of pages) {
  const { title, body } = parse(file);
  full += `\n\n=====================================================\n`;
  full += `# ${title}\nURL: ${abs(url)}\n\n`;
  full += `${body}\n`;
}
writeFileSync(join(root, "public", "llms-full.txt"), full);

console.log("Wrote public/llms.txt and public/llms-full.txt");
