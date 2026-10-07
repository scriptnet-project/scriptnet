import { contextBridge, ipcRenderer } from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';

const { appendLoading, removeLoading } = useLoading();
(async () => { await domReady(); appendLoading(); })();

const subscriptions = new Set<() => void>();
const subscribe = (channel: string, callback: (...args: any[]) => void) => {
  // Never pass the privileged Electron event into the renderer.
  const listener = (_event: unknown, ...args: any[]) => callback(...args);
  ipcRenderer.on(channel, listener);
  const remove = () => { ipcRenderer.removeListener(channel, listener); subscriptions.delete(remove); };
  subscriptions.add(remove);
  return remove;
};
contextBridge.exposeInMainWorld('devMode', process.env.NODE_ENV === 'development');
contextBridge.exposeInMainWorld('api', {
  openSampleProtocol: () => ipcRenderer.invoke('open-sample-protocol'),
  validateMapKey: (key: string) => ipcRenderer.invoke('validate-map-key', key),
  saveCase: (data: unknown) => ipcRenderer.send('trigger-save-response', data),
  saveCSV: (data: unknown) => ipcRenderer.send('trigger-save-csv-response', data),
  saveScreenshot: (data: string) => ipcRenderer.send('trigger-save-screenshot-response', data),
  onTriggerSave: (callback) => subscribe('trigger-save', callback),
  onTriggerSaveCSV: (callback) => subscribe('trigger-save-csv', callback),
  onTriggerSaveScreenshot: (callback) => subscribe('trigger-save-screenshot', callback),
  onFileOpened: (callback) => subscribe('file-opened', callback),
  onFileSaved: (callback) => subscribe('file-saved', callback),
  removeListeners: () => [...subscriptions].forEach(remove => remove()),
});
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
