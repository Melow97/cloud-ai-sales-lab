#!/usr/bin/env node
/**
 * ATLAS static-site link integrity check.
 * Checks local URLs in href/src attributes across .html pages, without fetching the internet.
 * Run: node qa/site-link-integrity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = fs.readdirSync(root).filter(f => f.endsWith(".html"));
const failures = [];
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const attr = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  for (const match of html.matchAll(attr)) {
    const raw = match[2].trim();
    if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|javascript:|data:|blob:|\/\/)/i.test(raw)) continue;
    if (/[%{]/.test(raw)) continue; // templated or runtime-built URL
    const urlPath = raw.split(/[?#]/)[0];
    if (!urlPath) continue;
    let decoded;
    try { decoded = decodeURIComponent(urlPath); }
    catch { failures.push({file, url:raw, reason:"invalid URL encoding"}); continue; }
    if (decoded.includes("\0")) {
      failures.push({file, url:raw, reason:"invalid NUL character"});
      continue;
    }
    const target = decoded.startsWith("/") ? path.join(root, decoded.slice(1)) : path.resolve(root, path.dirname(file), decoded);
    checked++;
    if (!fs.existsSync(target)) failures.push({file, url:raw, reason:"target not found"});
  }
}

console.log(JSON.stringify({
  project:"ATLAS Cloud & AI Sales Studio",
  pagesScanned:files.length,
  localLinksChecked:checked,
  missingLocalLinks:failures.length,
  issues:failures,
  scope:"Local HTML href/src paths only; external URLs, dynamic routes and accessibility not validated."
}, null, 2));
process.exitCode = failures.length ? 1 : 0;
