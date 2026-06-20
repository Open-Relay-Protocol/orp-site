// Rehype plugin: prefix root-relative links and asset references with the
// configured base path, so MDX content authored with absolute paths
// (for example /docs/overview/) resolves correctly when the site is served
// under a subpath (GitHub Pages project site). External links, protocol-
// relative links, pure anchors, and already-prefixed paths are left alone.
import { BASE } from "../site.config.mjs";

const ATTRS = { a: "href", img: "src", source: "srcset" };

function prefix(value) {
  if (BASE === "/" || typeof value !== "string") return value;
  // skip external, protocol-relative, anchors, mailto/tel, and non-root paths
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  if (value.startsWith(BASE)) return value;
  return BASE.replace(/\/$/, "") + value;
}

function walk(node) {
  if (!node || typeof node !== "object") return;
  if (node.type === "element" && node.properties) {
    const attr = ATTRS[node.tagName];
    if (attr && node.properties[attr] != null) {
      node.properties[attr] = prefix(node.properties[attr]);
    }
  }
  if (Array.isArray(node.children)) node.children.forEach(walk);
}

export default function rehypeBaseLinks() {
  return (tree) => walk(tree);
}
