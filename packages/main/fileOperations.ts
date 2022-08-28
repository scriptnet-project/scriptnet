import { ipcMain, dialog } from 'electron';
import { writeFile } from 'fs-extra';
import { join, parse } from 'path';
import Papa from 'papaparse';
import { getBrowserWindow } from '.';

export const SAMPLE_NETWORK_PATH = join(__dirname, '../../complex-example.case')

export const ensureFilePath = async (filePath: string | null, options: Object) => {
  if (filePath) { return filePath; }

  const { canceled, filePath: path } = await dialog.showSaveDialog(getBrowserWindow(), options);

  if (canceled) {
    return;
  }

  return path;
}

export const saveFile = async ({ data, filePath }) => {
  const dialogOptions = {
    properties: ['createDirectory', 'showOverwriteConfirmation'],
    filters: [
      { name: 'Case', extensions: ['case'] }
    ]
  };

  const path = await ensureFilePath(filePath, dialogOptions);

  if (!path) { return; }

  await writeFile(path, data, 'utf8');
  getBrowserWindow()?.webContents.send('file-saved', path);
  return;
}

const saveCSV = async ({ edges, nodes, filePath, cwd }) => {
  const dialogOptions = {
    // filters: [{
    //   name: 'CSV File',
    //   extensions: ['csv']
    // }],
    defaultPath: cwd,
    properties: ['openDirectory', 'createDirectory'],
  }

  let path = filePath;

  if (!filePath) {
    const { canceled, filePaths } = await dialog.showOpenDialog(getBrowserWindow(), dialogOptions);

    if (canceled) { return; }

    path = filePaths[0];
  }

  const { dir, name } = parse(path);

  const nodesFilePath = join(dir, `${name}_nodes.csv`);
  const edgesFilePath = join(dir, `${name}_edges.csv`);

  await writeFile(nodesFilePath, Papa.unparse(nodes), 'utf8');
  await writeFile(edgesFilePath, Papa.unparse(edges), 'utf8');
}

export const registerListeners = () => {
  ipcMain.on('trigger-save-response', async (_, response) => {
    console.log('trigger-save-response', response);
    await saveFile(response);
  })

  ipcMain.on('trigger-save-csv-response', () => {
    saveCSV(response);
  })

  ipcMain.on('trigger-save-screenshot-response', () => {

  })
}

