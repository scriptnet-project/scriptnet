import { ipcMain, dialog } from 'electron';
import { writeFile, readFile } from 'fs-extra';
import { join, parse, dirname } from 'path';
import Papa from 'papaparse';
import { getBrowserWindow } from '.';

export const SAMPLE_NETWORK_PATH = join(__dirname, '../../complex-example.case')

const saveDialogOptions = {
  properties: ['createDirectory', 'showOverwriteConfirmation'],
  filters: [
    { name: 'Case', extensions: ['case'] }
  ]
};

export const ensureFilePath = async (filePath: string | null, options: Object) => {
  if (filePath) { return filePath; }

  const { canceled, filePath: path } = await dialog.showSaveDialog(getBrowserWindow(), options);

  if (canceled) {
    return;
  }

  getBrowserWindow()?.webContents.send('file-saved', path);
  return path;
}

export const openFile = async (filePath: string) => {
  console.log('Opening file: ', filePath);
  const data = await readFile(filePath, 'utf8');
  getBrowserWindow()?.webContents.send('file-opened', JSON.parse(data), filePath);
}

export const saveFile = async ({ data, filePath }) => {
  const path = await ensureFilePath(filePath, saveDialogOptions);

  if (!path) { return; }

  await writeFile(path, data, 'utf8');
  getBrowserWindow()?.webContents.send('file-saved', path);
  return;
}

const saveCSV = async ({ edges, nodes, filePath }) => {
  const path = await ensureFilePath(filePath, saveDialogOptions);
  if (!path) { return; }

  const cwd = dirname(path);

  const dialogOptions = {
    title: 'Select location for CSV files',
    buttonLabel: 'Save',
    defaultPath: cwd,
    properties: ['openDirectory', 'createDirectory'],
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(getBrowserWindow(), dialogOptions);

  if (canceled) { return; }

  const { name } = parse(path);
  const dir = filePaths[0];

  const nodesFilePath = join(dir, `${name}_nodes.csv`);
  const edgesFilePath = join(dir, `${name}_edges.csv`);

  console.log('Exporting CSV:', {
    dir,
    filePaths,
    name,
    path,
    nodesFilePath,
    edgesFilePath,
  })
  await writeFile(nodesFilePath, Papa.unparse(nodes), 'utf8');
  await writeFile(edgesFilePath, Papa.unparse(edges), 'utf8');
}

export const registerListeners = async () => {
  ipcMain.on('trigger-save-response', async (_, response) => {
    console.log('trigger-save-response', response);
    await saveFile(response);
  })

  ipcMain.on('trigger-save-csv-response', async (_, response) => {
    await saveCSV(response);
  })

  ipcMain.on('trigger-save-screenshot-response', () => {
  });

  return;
}

