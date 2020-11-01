import { useState } from 'react';
import electron from 'electron';
import fse from 'fs-extra';
import path from 'path';

const dialog = electron.remote.dialog;
const browserWindow = electron.remote.getCurrentWindow();
const defaultPath = electron.remote.app.getPath('home');

const initialState = {
  isLoading: false,
  filePath: null,
};

const baseOptions = {
  filters: [{
    name: 'ScriptNet Case File',
    extensions: ['json']
  }],
  defaultPath,
};

const useCyLoader = (cy, initializeCy) => {
  const [state, setState] = useState(initialState);

  const newNetwork = () => {
    initializeCy();
    setState(initialState);
  };

  const openNetwork = () => {
    const options = state.filePath ? { ...baseOptions, defaultPath: path.dirname(state.filePath) } : baseOptions;
    dialog.showOpenDialog(browserWindow, options)
      .then(({ canceled, filePaths, ...rest }) => {
        if (canceled) { return; }
        setState({ isLoading: true, filePath: null }); // could set filePath here?
        const filePath = filePaths[0];
        fse.readFile(filePath, 'utf8')
          .then((data) => {
            const parsedData = JSON.parse(data);
            const { elements } = parsedData.network;
            initializeCy(elements);
            setState(s => ({ ...s, filePath }));
          })
          .finally(() => { setState(s => ({ ...s, isLoading: false })); });
      });

  };

  const saveNetwork = () => {
    const options = state.filePath ? { ...baseOptions, defaultPath: state.filePath } : baseOptions;
    console.log({ options, state });
    dialog.showSaveDialog(browserWindow, options)
      .then(({ canceled, filePath }) => {
        if (canceled) { return; }
        return path.parse(filePath);
      })
      .then((filePath) => {
        setState({ isLoading: true, filePath: null });
        const elements = cy.current.elements().jsons()
        const data = JSON.stringify({ network: { elements } });
        const jsonFilePath = path.join(filePath.dir, `${filePath.name}.json`);
        return fse.writeFile(jsonFilePath, data, 'utf8')
          .then(() => { setState(s => ({ ...s, filePath: jsonFilePath })); })
          .finally(() => { setState(s => ({ ...s, isLoading: false })); });
      });

  };

  const actions = {
    openNetwork,
    saveNetwork,
    newNetwork,
  };

  return [state, actions];
};

export default useCyLoader;

