import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const [platform, arch] = process.argv.slice(2);
if (!['mac', 'win'].includes(platform) || !['arm64', 'x64'].includes(arch)) throw new Error('Specify platform and architecture.');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const root = join('release', pkg.version);
const executable = platform === 'win' ? join(root, 'win-unpacked', 'ScriptNet.exe')
  : join(root, arch === 'arm64' ? 'mac-arm64' : 'mac', 'ScriptNet.app', 'Contents', 'MacOS', 'ScriptNet');
const binary = readFileSync(executable);
let actual;
if (platform === 'win') {
  const pe = binary.readUInt32LE(0x3c);
  if (binary.toString('ascii', pe, pe + 4) !== 'PE\0\0') throw new Error('Not a PE executable.');
  actual = binary.readUInt16LE(pe + 4) === 0x8664 ? 'x64' : 'unsupported';
} else {
  if (binary.readUInt32LE(0) !== 0xfeedfacf) throw new Error('Not a thin 64-bit Mach-O executable.');
  actual = ({ [0x01000007]: 'x64', [0x0100000c]: 'arm64' })[binary.readUInt32LE(4)];
}
if (actual !== arch) throw new Error('Packaged application architecture does not match its label.');
let signing;
if (platform === 'win') {
  const checked = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-File', 'scripts/check-authenticode.ps1', executable], { encoding: 'utf8' });
  if (checked.status !== 0) throw new Error('Could not inspect Windows application signature.');
  signing = `Authenticode status: ${checked.stdout.trim()}; no distribution certificate configured.`;
}
if (platform === 'mac') {
  const bundle = join(root, arch === 'arm64' ? 'mac-arm64' : 'mac', 'ScriptNet.app');
  const verified = spawnSync('codesign', ['--verify', '--deep', '--strict', bundle], { encoding: 'utf8' });
  if (verified.status !== 0) throw new Error('Packaged Mac bundle signature failed verification.');
  signing = 'Ad-hoc signature verified; no Developer ID certificate or notarization.';
}
const build = JSON.parse(readFileSync('dist/build-info.json', 'utf8'));
writeFileSync(join(root, `build-info-${platform}-${arch}.json`), JSON.stringify({
  ...build, platform, architecture: actual, signing,
}, null, 2) + '\n');
console.log(`Verified ${platform} ${arch} executable for ScriptNet ${pkg.version}.`);
