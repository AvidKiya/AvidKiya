#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.argv[2] || "components";

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) out.push(p);
  }
  return out;
}
function extractSize(attrs) {
  const m = attrs.match(/fontSize:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}
function extractColor(attrs) {
  const m = attrs.match(/color:\s*(["'`][^"'`]+["'`]|var\([^)]+\)|#[0-9A-Fa-f]{3,8})/);
  return m ? m[1] : null;
}

let filesChanged = 0, iconsReplaced = 0;

for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, "utf8");
  const orig = src;

  const re =
    /<span\s+([^>]*?)className\s*=\s*"([^"]*material-symbols-outlined[^"]*)"([^>]*?)>\s*([^<{}\s][^<]*?|\{[^}]+\})\s*<\/span>/g;

  src = src.replace(re, (_, before, cls, after, inner) => {
    iconsReplaced++;
    const attrs = before + " " + after;
    const size = extractSize(attrs);
    const color = extractColor(attrs);
    const extra = cls.split(/\s+/).filter((c) => c && c !== "material-symbols-outlined").join(" ");
    const parts = [];
    if (inner.startsWith("{")) parts.push(`<Icon name={${inner.slice(1, -1)}}`);
    else parts.push(`<Icon name="${inner.trim()}"`);
    if (size != null) parts.push(`size={${size}}`);
    if (color != null) parts.push(`color={${color}}`);
    if (extra) parts.push(`className="${extra}"`);
    parts.push(`/>`);
    return parts.join(" ");
  });

  if (src !== orig) {
    if (!/from ["']@\/components\/ui\/Icon["']/.test(src)) {
      const lines = src.split("\n");
      let last = -1;
      for (let i = 0; i < lines.length; i++) if (/^\s*import\s/.test(lines[i])) last = i;
      if (last >= 0) lines.splice(last + 1, 0, 'import Icon from "@/components/ui/Icon";');
      else lines.unshift('import Icon from "@/components/ui/Icon";');
      src = lines.join("\n");
    }
    fs.writeFileSync(file, src);
    filesChanged++;
    console.log("✓", file);
  }
}
console.log(`\n${iconsReplaced} icon(s) replaced across ${filesChanged} file(s).`);
