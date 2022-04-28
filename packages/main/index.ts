import { app, BrowserWindow, shell, ipcMain, dialog, Menu } from 'electron'
import { release } from 'os'
import fse from 'fs-extra';
import { join, parse } from 'path'

const isMac = process.platform === 'darwin'

const menuTemplate = [
  {
    label: 'File',
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
        click: () => {
          console.log('open case');
          // win.webContents.send('open-file')
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
];

const menu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(menu);

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

function registerListeners() {
  ipcMain.handle('save-file', async (event, options, data) => {
      // do stuff
      return dialog.showSaveDialog(win, options)
      .then(({ canceled, filePath }) => {
        if (canceled) { return; }
        return parse(filePath);
      })
      .then(async (filePath) => {
        const jsonFilePath = join(filePath.dir, `${filePath.name}.json`);
        await fse.writeFile(jsonFilePath, data, 'utf8');

        return jsonFilePath;
      });
  });

  ipcMain.handle('open-file', (event, path = `${process.cwd()}/complex-example.json`) => {
    return fse.readFile(path, 'utf8')
  });

  ipcMain.handle('open-dialog', (options) => {
    return dialog.showOpenDialog(win, options)
      .then(({ canceled, filePaths, ...rest }) => {
        if (canceled) { return; }

        const filePath = filePaths[0];
        console.log(filePath);
        return filePath;
      });
  });

  ipcMain.handle('save-dialog', async (event, options) => {
    const path = await dialog.showSaveDialog(win!, options)
      .then(({ canceled, filePath }) => {
        if (canceled) { return; }

        if (filePath) {
          return filePath;
        }
      });

    return path;
  }
  );
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

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
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
