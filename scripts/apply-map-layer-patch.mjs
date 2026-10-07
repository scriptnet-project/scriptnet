import { readFileSync, writeFileSync } from 'node:fs';
import { CARTO_TILE_BASE } from '../packages/shared/mapKey.mjs';
// Upstream commit is pinned in package.json and yarn.lock. Patch both the source
// and the shipped entry point; fail on drift instead of silently sending a keyless request.
for (const file of ['src/cy-leaflet.js', 'cytoscape-leaf.js']) {
  const path = new URL(`../node_modules/cytoscape-leaf/${file}`, import.meta.url);
  const before = `L.tileLayer('${CARTO_TILE_BASE}', {`;
  const after = `L.tileLayer(this.options.tileUrl || '${CARTO_TILE_BASE}', {`;
  const text = readFileSync(path, 'utf8');
  if (text.includes(after)) continue;
  if (text.split(before).length !== 2) throw new Error('Unexpected cytoscape-leaf code; review the map layer patch.');
  writeFileSync(path, text.replace(before, after));
}
