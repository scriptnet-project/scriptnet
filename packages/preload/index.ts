import { contextBridge, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const { appendLoading, removeLoading } = useLoading()

  ; (async () => {
    await domReady()

    appendLoading()
  })()

const devMode = process.env.NODE_ENV === 'development'

contextBridge.exposeInMainWorld('devMode', devMode);

contextBridge.exposeInMainWorld('api', {
  openSampleProtocol: () => ipcRenderer.invoke('open-sample-protocol'),
  onTriggerSave: (callback) => ipcRenderer.on('trigger-save', callback),
  onTriggerSaveCSV: (callback) => ipcRenderer.on('trigger-save-csv', callback),
  onTriggerSaveScreenshot: (callback) => ipcRenderer.on('trigger-save-screenshot', callback),
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onFileSaved: (callback) => ipcRenderer.on('file-saved', callback),
  removeListeners: () => ipcRenderer.removeAllListeners(),
})

contextBridge.exposeInMainWorld('removeLoading', removeLoading)
