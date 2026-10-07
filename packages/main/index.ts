import { app, BrowserWindow, shell, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { validateMapKey } from '../shared/mapKey.mjs'
import {
  handleNewCase,
  handleOpenCase,
  handleSaveAsCase,
  handleSaveCase,
  handleExportScreenshot,
  handleExportCSV,
} from './menuHandlers';
import { openFile, registerListeners, SAMPLE_NETWORK_PATH } from './fileOperations';

if (process.env.NODE_ENV === 'test' && process.env.SCRIPTNET_USER_DATA_DIR) {
  app.setPath('userData', process.env.SCRIPTNET_USER_DATA_DIR);
}
const isMac = process.platform === 'darwin'

let win: BrowserWindow;

export const getBrowserWindow = () => {
  return BrowserWindow.getFocusedWindow();
}

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: '&File',
    submenu: [
      {
        label: 'New Case...',
        click: handleNewCase,
        accelerator: 'CmdOrCtrl+N'
      },
      {
        label: 'Open Case',
        accelerator: 'CmdOrCtrl+O',
        click: handleOpenCase,
      },
      {
        label: 'Save Case',
        accelerator: 'CmdOrCtrl+S',
        click: handleSaveCase,
      },
      {
        label: 'Save Case As...',
        click: handleSaveAsCase,
      },
      { type: 'separator' },
      { role: 'quit' }
    ],
  },
  {
    label: 'Export',
    submenu: [
      {
        label: 'Export Screenshot...',
        click: handleExportScreenshot,
      },
      {
        label: 'Export CSV...',
        click: handleExportCSV,
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'delete' },
        { role: 'selectAll' },
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/scriptnet-project/scriptnet')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1280,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  const rendererPath = join(__dirname, '../renderer/index.html');
  const development = process.env.NODE_ENV === 'development';
  const allowedUrl = development
    ? `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
    : pathToFileURL(rendererPath).href;
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== allowedUrl && url !== `${allowedUrl}/`) event.preventDefault();
  });
  win.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  win.webContents.session.setPermissionCheckHandler(() => false);
  if (development) {
    await win.loadURL(allowedUrl);
    win.webContents.openDevTools();
  } else {
    await win.loadFile(rendererPath);
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  registerListeners();
  ipcMain.handle('validate-map-key', (event, key) => {
    if (event.sender !== win?.webContents || event.senderFrame !== win.webContents.mainFrame) {
      return { ok: false, message: 'Map key validation is unavailable.' };
    }
    return validateMapKey(key);
  });
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win && !win.isDestroyed()) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
