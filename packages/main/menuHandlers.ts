import { dialog } from 'electron';
import { join } from 'path';
import { readFile, writeFile } from 'fs-extra';
import { getBrowserWindow } from '.';
import { openFile } from './fileOperations';

/**
 * New Case:
 * 1. Main chooses file path
 * 2. Main sends file-opened(data, filePath) to renderer
 * 3. Renderer updates state
 */
export const handleNewCase = async () => {
  const { canceled, filePath } = await dialog.showSaveDialog(getBrowserWindow(), {
    properties: ['createDirectory', 'showOverwriteConfirmation'],
    filters: [
      { name: 'Case', extensions: ['case'] }
    ]
  })

  if (canceled) {
    return;
  }

  // write minimal file
  await writeFile(filePath, "{}");

  getBrowserWindow()?.webContents.send('file-opened', null, filePath);
}

/**
 *
 * Open Case:
 * 1. Main selects a path
 * 2. Main reads the data from the disk
 * 3. Main sends file-opened(data, filePath) to renderer
 */
export const handleOpenCase = async () => {
  console.log('open case');

  const { canceled, filePaths } = await dialog.showOpenDialog(getBrowserWindow(), {
    properties: ['openFile'],
    filters: [
      { name: 'Case', extensions: ['case'] }
    ]
  });

  if (canceled) {
    return;
  }

  const filePath = filePaths[0];

  await openFile(filePath);
};

/**
 * 1. Main requests data and path from renderer
 * 2. Renderer responds with data and path
 * 3. If no path, Main shows save dialog
 * 4. Main writes data to path
 */
export const handleSaveCase = () => {
  console.log('save case');

  // Request renderer to respond with data and path
  // Rest takes place in saveCase()
  getBrowserWindow()?.webContents.send('trigger-save');
};

/**
 * Save As:
 * 1. Main requests data and path from renderer
 * 2. Uses path to set starting directory for save dialog
 * 3. Main writes data to path
 */
export const handleSaveAsCase = async () => {
  console.log('save case as');

  // Open a save dialog to get a path to save the file to
  const { canceled, filePath } = await dialog.showSaveDialog(getBrowserWindow(), {
    properties: ['createDirectory', 'showOverwriteConfirmation'],
    filters: [
      { name: 'Case', extensions: ['case'] }
    ]
  });

  if (canceled) {
    return;
  }

  getBrowserWindow()?.webContents.send('file-saved', filePath);

  getBrowserWindow()?.webContents.send('trigger-save');
};

export const handleExportCSV = async () => {
  getBrowserWindow()?.webContents.send('trigger-save-csv');
};

export const handleExportScreenshot = async () => {
  getBrowserWindow()?.webContents.send('trigger-save-screenshot');
};
