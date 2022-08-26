import { app, BrowserWindow, shell, Menu } from 'electron'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { release } from 'os'
import { join } from 'path'
import { handleNewCase, handleOpenCase, handleSaveAsCase, handleSaveCase } from './menuHandlers';
import { registerListeners } from './fileOperations';

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
        click: () => {
          console.log('export screenshot');
          win.webContents.send('export-screenshot')
        },
      },
      {
        label: 'Export CSV...',
        click: () => {
          console.log('export csv');
          win.webContents.send('export-csv')
        },
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

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

async function installDevtools() {
  return installExtension([REDUX_DEVTOOLS.id, REACT_DEVELOPER_TOOLS.id])
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1280,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs')
    },
  })

  if (app.isPackaged || process.env['DEBUG']) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }

  win.webContents.on('did-finish-load', async () => {
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(installDevtools).then(createWindow).then(registerListeners)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
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
