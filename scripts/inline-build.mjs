// Baut aus dist/ eine einzelne HTML-Datei mit eingebettetem CSS und JS.
// Praktisch zum Teilen des Prototyps ohne Server.
//
//   npm run build:single
//   → preview/platinpfad.html   (vollständiges Dokument, per Doppelklick öffnen)
//   → preview/fragment.html     (ohne <html>/<head>/<body>, zum Einbetten)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');

const cssHref = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/);
const jsSrc = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/);
if (!cssHref || !jsSrc) throw new Error('CSS- oder JS-Asset in dist/index.html nicht gefunden. Erst `vite build` ausführen.');

const css = readFileSync(join(dist, cssHref[1]), 'utf8');
// Ein "</script" im Bundle würde das Inline-Script vorzeitig beenden.
const js = readFileSync(join(dist, jsSrc[1]), 'utf8').replace(/<\/script/gi, '<\\/script');

const style = `<style>\n${css}\n</style>`;
const script = `<script type="module">\n${js}\n</script>`;

const full = html
  .replace(cssHref[0], () => style)
  .replace(jsSrc[0], () => '')
  .replace('</body>', () => `${script}\n</body>`);

const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const title = head.match(/<title>.*?<\/title>/)[0];
const fonts = [...head.matchAll(/<link\s+rel="(?:preconnect|stylesheet)"\s+href="https:\/\/fonts[^>]*>/g)].map((m) =>
  m[0].replace(/\s+/g, ' '),
);
// Body ohne das Modul-Script: Root mit Startmeldung, <noscript>, Fehleranzeige.
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1].trim();
const fragment = [title, ...fonts, style, body, script].join('\n');

const out = join(root, 'preview');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'platinpfad.html'), full);
writeFileSync(join(out, 'fragment.html'), fragment);
console.log(`preview/platinpfad.html  ${(full.length / 1024).toFixed(0)} KB`);
console.log(`preview/fragment.html    ${(fragment.length / 1024).toFixed(0)} KB`);
