import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [platform, arch] = process.argv.slice(2);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (!['mac', 'win'].includes(platform) || !['x64', 'arm64'].includes(arch)) throw new Error('Specify platform and architecture.');
const executable = platform === 'win'
  ? resolve('release', pkg.version, 'win-unpacked', 'ScriptNet.exe')
  : resolve('release', pkg.version, arch === 'arm64' ? 'mac-arm64' : 'mac', 'ScriptNet.app', 'Contents', 'MacOS', 'ScriptNet');
const result = spawnSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['test:e2e'], {
  env: { ...process.env, SCRIPTNET_PACKAGED_EXECUTABLE: executable }, stdio: 'inherit', shell: process.platform === 'win32',
});
process.exit(result.status ?? 1);
