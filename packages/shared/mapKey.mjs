export const MAP_KEY_STORAGE = 'scriptnet.carto.personalKey.v1';
export const CARTO_TILE_BASE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';

export function normalizeMapKey(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidMapKey(value) {
  const key = normalizeMapKey(value);
  return key.length >= 16 && key.length <= 2048 && /^[A-Za-z0-9._~-]+$/.test(key);
}

export function cartoTileUrl(value) {
  if (!isValidMapKey(value)) throw new Error('A valid CARTO key is required.');
  return `${CARTO_TILE_BASE}?key=${encodeURIComponent(normalizeMapKey(value))}`;
}

// Check a public world tile, never coordinates from an open case. Do not return
// errors, response bodies, or URLs that could contain a credential.
export async function validateMapKey(value, fetchTile = globalThis.fetch) {
  if (!isValidMapKey(value)) return { ok: false, message: 'Enter a CARTO basemap API key without spaces.' };
  const url = cartoTileUrl(value).replace('{s}', 'a').replace('{z}', '0')
    .replace('{x}', '0').replace('{y}', '0').replace('{r}', '');
  try {
    const response = await fetchTile(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' });
    await response.body?.cancel();
    if (response.status === 403) return { ok: false, message: 'CARTO refused this key. Desktop apps need a key without website restrictions.' };
    if (response.status === 429) return { ok: false, message: 'This CARTO key has reached its request limit. Try another key or try again later.' };
    const watermark = /^(?:W\/)?"?wm-/i.test(response.headers.get('etag') || '');
    if (!response.ok || watermark || !response.headers.get('content-type')?.startsWith('image/png')) {
      return { ok: false, message: 'CARTO did not accept this key. Check the key and its basemap allowance.' };
    }
    return { ok: true, message: '' };
  } catch {
    return { ok: false, message: 'Could not reach CARTO. Check your internet connection and try again.' };
  }
}
