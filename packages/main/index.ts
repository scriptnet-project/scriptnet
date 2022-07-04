import { app, BrowserWindow, shell, ipcMain, dialog, Menu } from 'electron'
import { release } from 'os'
import fse from 'fs-extra';
import { join, parse } from 'path'

const isMac = process.platform === 'darwin'

let win: BrowserWindow | null = null

const template = [
  // { role: 'appMenu' }
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
  // { role: 'fileMenu' }
  {
    label: '&File',
    submenu: [
      {
        label: 'New Case...',
        click: () => {
          console.log('new');
          // win.webContents.send('new-case')
        },
        accelerator: 'CmdOrCtrl+N'
      },
      {
        label: 'Open Case',
        accelerator: 'CmdOrCtrl+O',
        click: async () => {
          console.log('open case');
          const path = await dialog.showOpenDialog(win, {
            properties: ['openFile'],
            filters: [
              { name: 'Case', extensions: ['case'] }
            ]
          });

          if (path.canceled) {
            return;
          }

          const filePath = path.filePaths[0];
          const data = await fse.readFile(filePath, 'utf8');
          win?.webContents.send('case-opened', JSON.parse(data), filePath);
        },
      },
      {
        label: 'Save Case',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          console.log('save case');
          // win.webContents.send('save-file')
        },
        disabled: true,
      },
      {
        label: 'Save Case As...',
        click: () => {
          console.log('save case as');
          // win.webContents.send('save-file')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Export',
        submenu: [
          {
            label: 'Export Screenshot...',
            click: () => {
              console.log('export screenshot');
              // win.webContents.send('export-screenshot')
            },
          },
          {
            label: 'Export CSV...',
            click: () => {
              console.log('export csv');
              // win.webContents.send('export-csv')
            },
          },
        ]
      },
      { type: 'separator' },
      { role: 'quit' }
    ],
  },
  // { role: 'editMenu' }
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
  // { role: 'viewMenu' }
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
  // { role: 'windowMenu' }
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

function registerListeners() {
  ipcMain.handle('open-sample-network', async () => {
    // Load the sample network when in dev mode
    const SAMPLE_NETWORK_PATH = join(__dirname, '../../map-example.case')
    const data = await fse.readFile(SAMPLE_NETWORK_PATH, 'utf8');
    win?.webContents.send('case-opened', JSON.parse(data), SAMPLE_NETWORK_PATH);
  });

  ipcMain.handle('save-file', async (event, options, data, existingPath) => {
      // do stuff
      if (!existingPath) {
        const path = await dialog.showSaveDialog(win, {
          title: 'Save Case',
          defaultPath: '',
          filters: [
            { name: 'Case', extensions: ['case'] }
          ],
          ...options
        });

        if (path.canceled) {
          return;
        }

        const filePath = parse(path.filePath);
        const jsonFilePath = join(filePath.dir, `${filePath.name}.case`);
        return fse.writeFile(jsonFilePath, data, 'utf8');
      }

      return fse.writeFile(existingPath, data, 'utf8');
  });
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

app.whenReady().then(createWindow).then(registerListeners)

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
