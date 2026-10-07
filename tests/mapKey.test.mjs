import test from 'node:test';
import assert from 'node:assert/strict';
import { cartoTileUrl, isValidMapKey, validateMapKey } from '../packages/shared/mapKey.mjs';

const key = 'synthetic-test-key-1234567890';
test('keys are normalized, bounded, and never silently omitted', () => {
  for (const value of ['', null, 'short', 'a b'.repeat(20), 'x'.repeat(2049), '<script>'.repeat(10)]) assert.equal(isValidMapKey(value), false);
  assert.equal(isValidMapKey(` ${key} `), true);
  assert.equal(cartoTileUrl(` ${key} `), `https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png?key=${key}`);
  assert.throws(() => cartoTileUrl(''), /required/);
});
test('invalid syntax makes no provider request', async () => {
  const result = await validateMapKey('bad', () => { throw new Error('unexpected request'); });
  assert.equal(result.ok, false);
});
test('validation only requests a public world tile and accepts a normal PNG', async () => {
  let requested;
  const result = await validateMapKey(key, async url => {
    requested = url;
    return new Response(new Uint8Array([1]), { headers: { 'content-type': 'image/png', etag: '"normal-tile"' } });
  });
  assert.equal(result.ok, true);
  assert.equal(new URL(requested).pathname, '/rastertiles/voyager_labels_under/0/0/0.png');
});
test('HTTP-200 API-key notice, restrictions, quota, and network failure are actionable without leaking the key', async () => {
  const responses = [
    [200, '"wm-da89c20e77c1-light"', /did not accept/],
    [200, 'W/"wm-anything"', /did not accept/],
    [403, '', /website restrictions/],
    [429, '', /request limit/],
    [500, '', /did not accept/],
  ];
  for (const [status, etag, message] of responses) {
    const result = await validateMapKey(key, async () => new Response('', { status, headers: { 'content-type': 'image/png', etag } }));
    assert.equal(result.ok, false); assert.match(result.message, message);
    assert.equal(JSON.stringify(result).includes(key), false);
  }
  const result = await validateMapKey(key, async () => { throw new Error(`private URL ?key=${key}`); });
  assert.match(result.message, /internet connection/);
  assert.equal(JSON.stringify(result).includes(key), false);
});
