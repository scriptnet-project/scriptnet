import { createContext, useContext, useState } from 'react';
import { MAP_KEY_STORAGE, isValidMapKey, normalizeMapKey } from '../../../shared/mapKey.mjs';

const MapSettingsContext = createContext(null);
const includedKey = normalizeMapKey(import.meta.env.VITE_CARTO_BASEMAPS_KEY);

export function MapSettingsProvider({ children }) {
  const [personalKey, setPersonalKey] = useState(() => {
    try {
      const key = localStorage.getItem(MAP_KEY_STORAGE) || '';
      return isValidMapKey(key) ? key : '';
    } catch { return ''; }
  });
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const mapKey = personalKey || (isValidMapKey(includedKey) ? includedKey : '');

  const savePersonalKey = (value) => {
    const key = normalizeMapKey(value);
    if (!isValidMapKey(key)) throw new Error('Enter a valid CARTO basemap API key.');
    localStorage.setItem(MAP_KEY_STORAGE, key);
    setPersonalKey(key);
    setError('');
    setRetry(value => value + 1);
  };
  const resetKey = () => {
    localStorage.removeItem(MAP_KEY_STORAGE);
    setPersonalKey('');
    setError('');
    setRetry(value => value + 1);
  };
  return <MapSettingsContext.Provider value={{
    mapKey, personalKey, hasIncludedKey: isValidMapKey(includedKey), error, setError,
    settingsOpen, setSettingsOpen, savePersonalKey, resetKey, retry,
  }}>{children}</MapSettingsContext.Provider>;
}

export const useMapSettings = () => useContext(MapSettingsContext);
