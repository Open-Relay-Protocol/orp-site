import type { APIRoute } from "astro";
import { SITE, BASE } from "../../site.config.mjs";

// Generated so the Sitemap URL always tracks the real deployed origin (the
// production HTTPS domain, or the Pages origin the Actions build injects).
// The previous static public/robots.txt hardcoded a stale placeholder host.
const sitemap = new URL(`${BASE}sitemap-index.xml`, SITE).href;

const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
