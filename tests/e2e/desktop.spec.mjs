import { test, expect, _electron } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const buildInfo = JSON.parse(readFileSync('dist/build-info.json', 'utf8'));
const includedKey = 'synthetic-included-key-1234567890';
const goodKey = 'synthetic-test-key-1234567890';
const otherKey = 'synthetic-other-key-1234567890';
const rejectedKey = 'synthetic-rejected-key-1234567890';
const restrictedKey = 'synthetic-restricted-key-1234567890';
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=', 'base64');
const network = { network: { elements: [
  { data: { id: 'one', label: 'Synthetic location one', location: { x: -2.245, y: 53.481 } } },
  { data: { id: 'two', label: 'Synthetic location two', location: { x: -2.243, y: 53.482 } } },
  { data: { id: 'unlocated', label: 'Synthetic unlocated node' } },
  { data: { id: 'edge', source: 'one', target: 'unlocated' } },
] } };
let app, page, directory, tileRequests, logs;
async function launch() {
  app = await _electron.launch({ ...(process.env.SCRIPTNET_PACKAGED_EXECUTABLE ? { executablePath: process.env.SCRIPTNET_PACKAGED_EXECUTABLE } : { args: ['.'] }), env: { ...process.env, NODE_ENV: 'test', SCRIPTNET_USER_DATA_DIR: join(directory, 'profile') } });
  await app.evaluate(() => {
    const original = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('basemaps.cartocdn.com')) {
        const key = new URL(url).searchParams.get('key');
        if (key === 'synthetic-restricted-key-1234567890') return new Response('', { status: 403 });
        return new Response('', { headers: { 'content-type': 'image/png', etag: key === 'synthetic-rejected-key-1234567890' ? '"wm-notice"' : '"test-tile"' } });
      }
      return original(url, options);
    };
  });
  page = await app.firstWindow();
  page.on('console', message => logs.push(message.text()));
  page.on('pageerror', error => logs.push(`PAGEERROR: ${error.message}`));
  await page.route('https://*.basemaps.cartocdn.com/**', async route => {
    tileRequests.push(route.request().url());
    await route.fulfill({ contentType: 'image/png', body: pixel });
  });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: 'Map settings', exact: true })).toBeVisible();
}
async function settings() { await page.getByRole('menuitem', { name: 'Map settings', exact: true }).click(); }
async function saveKey(key) {
  await settings();
  await page.getByLabel('Personal CARTO basemap API key', { exact: true }).fill(key);
  await page.getByRole('button', { name: 'Save personal key', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
}
// Cytoscape.mount does not populate the DOM registry. Observe the graph through
// its existing React context, without adding a test API to the shipped app.
async function nodeCount() {
  return page.evaluate(() => {
    const stack = [document.getElementById('root')._reactRootContainer?._internalRoot.current];
    while (stack.length) {
      const fiber = stack.pop();
      if (!fiber) continue;
      const graph = fiber.memoizedProps?.value?.[0]?.current;
      if (typeof graph?.nodes === 'function') return graph.nodes().length;
      stack.push(fiber.child, fiber.sibling);
    }
    return 0;
  });
}
async function openCase() {
  await app.evaluate(({ BrowserWindow }, { network, path }) => BrowserWindow.getAllWindows()[0].webContents.send('file-opened', network, path), { network, path: join(directory, 'synthetic.case') });
  await expect.poll(() => nodeCount()).toBe(3);
}
test.beforeEach(async () => { directory = await mkdtemp(join(tmpdir(), 'scriptnet-test-')); tileRequests = []; logs = []; await launch(); });
test.afterEach(async () => { await app?.close(); await rm(directory, { recursive: true, force: true }); });

test('missing key, malformed key, HTTP-200 watermark, restrictions, successful persistence and reset', async () => {
  test.skip(buildInfo.includedBasemapKey, 'Requires a personal-key-only build.');
  await page.getByRole('switch', { name: 'Show map' }).click();
  await expect(page.getByText('Add a CARTO basemap key to display the map.')).toBeVisible();
  await settings();
  const field = page.getByLabel('Personal CARTO basemap API key', { exact: true });
  await field.fill('bad');
  await page.getByRole('button', { name: 'Save personal key', exact: true }).click();
  await expect(page.getByText('Enter a CARTO basemap API key without spaces.')).toBeVisible();
  await field.fill(rejectedKey);
  await page.getByRole('button', { name: 'Save personal key', exact: true }).click();
  await expect(page.getByText('CARTO did not accept this key. Check the key and its basemap allowance.')).toBeVisible();
  await field.fill(restrictedKey);
  await page.getByRole('button', { name: 'Save personal key', exact: true }).click();
  await expect(page.getByText('CARTO refused this key. Desktop apps need a key without website restrictions.')).toBeVisible();
  await field.fill(goodKey);
  await page.getByRole('button', { name: 'Save personal key', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await app.close(); await launch();
  await settings();
  await expect(page.getByText('Using your personal CARTO key.')).toBeVisible();
  await expect(page.getByLabel('Personal CARTO basemap API key', { exact: true })).toHaveValue(goodKey);
  await page.getByRole('button', { name: 'Remove personal key', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('scriptnet.carto.personalKey.v1'))).toBeNull();
  expect(tileRequests.every(url => new URL(url).searchParams.has('key'))).toBe(true);
  expect(logs.join(' ')).not.toContain(goodKey);
  expect(logs.filter(value => value.startsWith('PAGEERROR:'))).toEqual([]);
});

test('key changes and repeated map toggles preserve graph, case saves and CSV export', async () => {
  await openCase(); await saveKey(goodKey);
  const toggle = page.getByRole('switch', { name: 'Show map' });
  await toggle.click();
  await expect.poll(() => tileRequests.length).toBeGreaterThan(0);
  await expect.poll(() => nodeCount()).toBe(2);
  await saveKey(otherKey);
  await expect.poll(() => tileRequests.some(url => new URL(url).searchParams.get('key') === otherKey)).toBe(true);
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.send('trigger-save'));
  await expect.poll(async () => { try { return JSON.parse(await readFile(join(directory, 'synthetic.case'), 'utf8')).network.elements.length; } catch { return 0; } }).toBe(4);
  expect(await readFile(join(directory, 'synthetic.case'), 'utf8')).not.toContain(otherKey);
  await app.evaluate(({ dialog }, path) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [path] }); }, directory);
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.send('trigger-save-csv'));
  await expect.poll(async () => { try { return await readFile(join(directory, 'synthetic_nodes.csv'), 'utf8'); } catch { return ''; } }).toContain('unlocated');
  expect(await readFile(join(directory, 'synthetic_nodes.csv'), 'utf8')).not.toContain(otherKey);
  for (let index = 0; index < 3; index++) {
    await toggle.click();
    await expect.poll(() => nodeCount()).toBe(3);
    await toggle.click();
    await expect(page.locator('#cy-leaflet.leaflet-container')).toBeVisible();
  }
  expect(tileRequests.every(url => new URL(url).searchParams.has('key'))).toBe(true);
  expect(logs.join(' ')).not.toContain(otherKey);
  expect(logs.filter(value => value.startsWith('PAGEERROR:'))).toEqual([]);
  await page.screenshot({ path: join(process.cwd(), 'test-results', 'synthetic-map.png') });
});

test('bridge exposes only scoped methods and denies external navigation', async () => {
  const scope = await page.evaluate(() => ({ fs: typeof window.fs, ipc: typeof window.ipcRenderer, require: typeof window.require, methods: Object.keys(window.api) }));
  expect(scope.fs).toBe('undefined'); expect(scope.ipc).toBe('undefined'); expect(scope.require).toBe('undefined');
  expect(scope.methods).not.toContain('send'); expect(scope.methods).not.toContain('invoke');
  const url = page.url();
  await page.evaluate(() => { window.location.href = 'https://example.com/'; });
  await expect.poll(() => page.url()).toBe(url);
});


test('included key works, personal key overrides it, and reset restores the included key', async () => {
  test.skip(!buildInfo.includedBasemapKey, 'Run yarn test:included-key for the synthetic included-key build.');
  await openCase();
  await page.getByRole('switch', { name: 'Show map' }).click();
  await expect.poll(() => tileRequests.some(url => new URL(url).searchParams.get('key') === includedKey)).toBe(true);
  await settings();
  await expect(page.getByText('Using the key included with ScriptNet.')).toBeVisible();
  await expect(page.getByLabel('Personal CARTO basemap API key', { exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await saveKey(goodKey);
  await expect.poll(() => tileRequests.some(url => new URL(url).searchParams.get('key') === goodKey)).toBe(true);
  const priorCount = tileRequests.length;
  await settings();
  await page.getByRole('button', { name: 'Use included key', exact: true }).click();
  await expect.poll(() => tileRequests.slice(priorCount).some(url => new URL(url).searchParams.get('key') === includedKey)).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('scriptnet.carto.personalKey.v1'))).toBeNull();
  expect(tileRequests.every(url => new URL(url).searchParams.has('key'))).toBe(true);
  expect(logs.join(' ')).not.toContain(includedKey);
  expect(logs.filter(value => value.startsWith('PAGEERROR:'))).toEqual([]);
});
