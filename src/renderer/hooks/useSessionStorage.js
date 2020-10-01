import { useStorageState } from 'react-storage-hooks';

export function useSessionStorage(...args) {
  return useStorageState(sessionStorage, ...args);
}
