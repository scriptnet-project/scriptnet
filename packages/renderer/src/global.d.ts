export {};
declare global {
  interface Window {
    devMode: boolean;
    removeLoading: () => void;
    api: {
      openSampleProtocol: () => Promise<void>;
      validateMapKey: (key: string) => Promise<{ ok: boolean; message: string }>;
      saveCase: (data: unknown) => void;
      saveCSV: (data: unknown) => void;
      saveScreenshot: (data: string) => void;
      onFileSaved: (callback: (path: string) => void) => () => void;
      onFileOpened: (callback: (data: object, path: string) => void) => () => void;
      onTriggerSave: (callback: () => void) => () => void;
      onTriggerSaveCSV: (callback: () => void) => () => void;
      onTriggerSaveScreenshot: (callback: () => void) => () => void;
      removeListeners: () => void;
    };
  }
}
