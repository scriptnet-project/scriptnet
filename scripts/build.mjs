import { build } from 'vite'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import './apply-map-layer-patch.mjs'
import { isValidMapKey } from '../packages/shared/mapKey.mjs'

if (process.env.SCRIPTNET_REQUIRE_BUNDLED_KEY === '1' && !isValidMapKey(process.env.VITE_CARTO_BASEMAPS_KEY)) {
  throw new Error('Release build requires a CARTO basemap key entered locally by the maintainer.');
}

await build({
  configFile: 'packages/main/vite.config.ts',
  mode: process.env.NODE_ENV === 'debug' ? 'debug' : 'production'
})
await build({ configFile: 'packages/preload/vite.config.ts' })
await build({ configFile: 'packages/renderer/vite.config.ts' })
mkdirSync('dist', { recursive: true });
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
writeFileSync('dist/build-info.json', JSON.stringify({
  version: pkg.version, electron: pkg.devDependencies.electron,
  includedBasemapKey: isValidMapKey(process.env.VITE_CARTO_BASEMAPS_KEY),
  mapMode: isValidMapKey(process.env.VITE_CARTO_BASEMAPS_KEY) ? 'included-key-with-personal-override' : 'personal-key-only',
}, null, 2) + '\n');
