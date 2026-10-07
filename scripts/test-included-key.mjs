import { spawnSync } from 'node:child_process';
const command = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const keyless = { ...process.env };
delete keyless.VITE_CARTO_BASEMAPS_KEY;
delete keyless.SCRIPTNET_REQUIRE_BUNDLED_KEY;
const included = { ...keyless, VITE_CARTO_BASEMAPS_KEY: 'synthetic-included-key-1234567890' };
let status = 0;
try {
  status = spawnSync(command, ['build'], { env: included, stdio: 'inherit' }).status ?? 1;
  if (!status) status = spawnSync(command, ['test:e2e', '--grep', 'included key works'], { env: keyless, stdio: 'inherit' }).status ?? 1;
} finally {
  const restore = spawnSync(command, ['build'], { env: keyless, stdio: 'inherit' }).status ?? 1;
  if (!status) status = restore;
}
process.exit(status);
