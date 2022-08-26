import { ipcMain, dialog } from 'electron';
import { writeFile, readFile } from 'fs-extra';
import { join } from 'path';
import { getBrowserWindow } from '.';

export const SAMPLE_NETWORK_PATH = join(__dirname, '../../complex-example.case')

export const saveFile = async ({ data, filePath }) => {
  let path;

  if (filePath) {
    path = filePath;
  } else {
    console.log('No path, so prompting user...');
    const { canceled, filePath } = await dialog.showSaveDialog(getBrowserWindow(), {
      properties: ['createDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Case', extensions: ['case'] }
      ]
    });

    if (canceled) {
      return;
    }

    path = filePath;
  }

  await writeFile(path, data, 'utf8');
  getBrowserWindow()?.webContents.send('file-saved', path);
  return;
}

export const registerListeners = () => {
  ipcMain.on('trigger-save-response', async (_, response) => {
    console.log('trigger-save-response', response);
    await saveFile(response);
  })
}

