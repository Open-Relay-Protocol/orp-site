// Single source of truth for site-wide constants used by the Astro config and
// the build scripts (OG, llms.txt). Both are env-driven so the same build can
// target a custom domain at the root or GitHub Pages at a project subpath
// without code changes.
//
//   SITE_URL   the deployed origin, e.g. https://orp.dev
//   BASE_PATH  the path the site is served under, e.g. / or /orp-site
//
// TODO: confirm the final DOMAIN (see OPEN-QUESTIONS.md). Placeholder until set.

function normalizeBase(b) {
  if (!b || b === "/") return "/";
  const withLead = b.startsWith("/") ? b : "/" + b;
  return withLead.endsWith("/") ? withLead : withLead + "/";
}

export const SITE = process.env.SITE_URL || "https://orp.dev";
export const BASE = normalizeBase(process.env.BASE_PATH);
export const GITHUB_URL = "https://github.com/Prograde-Solutions/orp";
