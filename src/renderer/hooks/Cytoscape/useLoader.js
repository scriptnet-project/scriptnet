import { useState } from 'react';
import electron from 'electron';
import fse from 'fs-extra';
const dialog = electron.remote.dialog;
const browserWindow = electron.remote.getCurrentWindow();

const initialState = {
  isLoading: false,
  filePath: null,
};

const baseOptions = {
  filters: [{
    name: 'ScriptNet Case File',
    extensions: ['json']
  }]
};

const useCyLoader = (cy, setCy) => {
  const [state, setState] = useState(initialState);

  const openNetwork = () => {
    dialog.showOpenDialog(browserWindow, { ...baseOptions })
      .then(({ cancelled, filePaths }) => {
        if (cancelled) { return; }
        return filePaths[0];
      })
      .then(filePath => fse.readFile(filePath, 'utf8'))
      .then((data) => {
        const parsedData = JSON.parse(data);
        const { elements } = parsedData.network;
        setCy(elements);
      });
  };

  const saveNetwork = () => {
    const options = state.filePath ? { defaultPath: state.filePath, ...baseOptions } : { ...baseOptions };
    dialog.showSaveDialog(browserWindow, options)
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return; }
        return filePath;
      })
      .then((filePath) => {
        const elements = cy.current.elements().jsons()
        const data = JSON.stringify({ network: { elements } });
        fse.writeFile(filePath, data, 'utf8');
      });
  };

  return [state, { openNetwork, saveNetwork }];
};

export default useCyLoader;

