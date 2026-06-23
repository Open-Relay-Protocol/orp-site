// Single source of truth for site-wide constants used by the Astro config and
// the build scripts (OG, llms.txt). Both are env-driven so the same build can
// target a custom domain at the root or GitHub Pages at a project subpath
// without code changes.
//
//   SITE_URL   the deployed origin, e.g. https://orp.dev
//   BASE_PATH  the path the site is served under, e.g. / or /orp-site
//
// The production domain is www.openrelayprotocol.com. The Actions build still
// overrides SITE/BASE from the Pages origin, so this constant is the fallback
// used by local and non-Actions builds.
//
// Pages is served via the GitHub Actions source (see .github/workflows/deploy.yml).
// The custom domain is published from the build output via site/public/CNAME so
// the Actions-deployed artifact carries it. A CNAME at the repo root alone is
// only honored by the legacy "deploy from a branch" path, which serves README.md.

function normalizeBase(b) {
  if (!b || b === "/") return "/";
  const withLead = b.startsWith("/") ? b : "/" + b;
  return withLead.endsWith("/") ? withLead : withLead + "/";
}

export const SITE = process.env.SITE_URL || "https://www.openrelayprotocol.com";
export const BASE = normalizeBase(process.env.BASE_PATH);
export const GITHUB_URL = "https://github.com/Open-Relay-Protocol/orp";
