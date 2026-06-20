// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import { SITE, BASE, GITHUB_URL } from "./site.config.mjs";
import rehypeBaseLinks from "./scripts/rehype-base-links.mjs";

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    rehypePlugins: [rehypeBaseLinks],
  },
  integrations: [
    starlight({
      title: "ORP",
      description:
        "ORP is a device-first messaging protocol whose rendezvous server is structurally unable to read message contents, keys, or unsealed signaling.",
      logo: {
        light: "./src/assets/logo_mark.svg",
        dark: "./src/assets/logo_white.svg",
        replacesTitle: false,
        alt: "ORP",
      },
      social: [
        { icon: "github", label: "GitHub", href: GITHUB_URL },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/Head.astro",
      },
      head: [
        { tag: "meta", attrs: { name: "theme-color", content: "#0E1726" } },
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "What ORP is", slug: "docs/overview" },
            { label: "Quickstart", slug: "docs/quickstart" },
          ],
        },
        {
          label: "Protocol",
          items: [
            { label: "Protocol reference", slug: "docs/protocol" },
            { label: "Blindness invariant", slug: "docs/blindness" },
            { label: "Cryptographic controls", slug: "docs/crypto" },
          ],
        },
        {
          label: "Security",
          items: [{ label: "Threat model", slug: "docs/threat-model" }],
        },
        {
          label: "Operations",
          items: [
            { label: "Operating the board", slug: "docs/operating-the-board" },
            { label: "Production-transport gap", slug: "docs/transport-gap" },
          ],
        },
        {
          label: "Reference",
          items: [{ label: "API reference", slug: "docs/api" }],
        },
        {
          label: "Concepts",
          items: [
            { label: "Identity rotation (ORP-004)", slug: "docs/identity-rotation" },
            { label: "Neighbor propagation (ORP-006)", slug: "docs/neighbor-propagation" },
          ],
        },
        {
          label: "Help",
          items: [{ label: "FAQ", slug: "docs/faq" }],
        },
      ],
    }),
    sitemap(),
  ],
});
