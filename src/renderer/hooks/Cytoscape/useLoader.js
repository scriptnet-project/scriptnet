import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import electron from 'electron';
import fse from 'fs-extra';
import path from 'path'
import { get } from 'lodash';
import { actionCreators as visualisationActions } from 'Store/visualisation';

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
  const visualisationOptions = useSelector(state => state.visualisation);
  const dispatch = useDispatch();
  const initializeVisualisationOptions = (options = {}) =>
    dispatch(visualisationActions.initializeVisualisationOptions(options));

  const newNetwork = () => {
    initializeCy();
    setState(initialState);
  };

  const openNetwork = () => {
    const dialogOptions = state.filePath ? { ...baseOptions, defaultPath: path.dirname(state.filePath) } : baseOptions;
    dialog.showOpenDialog(browserWindow, dialogOptions)
      .then(({ canceled, filePaths, ...rest }) => {
        if (canceled) { return; }
        setState({ isLoading: true, filePath: null }); // could set filePath here?
        const filePath = filePaths[0];
        fse.readFile(filePath, 'utf8')
          .then((data) => {
            const parsedData = JSON.parse(data);
            const elements = get(parsedData, 'network.elements', []);
            const options = get(parsedData, 'options', {});
            initializeVisualisationOptions(options.visualisation);
            initializeCy(elements);
            setState(s => ({ ...s, filePath }));
          })
          .finally(() => { setState(s => ({ ...s, isLoading: false })); });
      });

  };

  const saveNetwork = () => {
    const dialogOptions = state.filePath ? { ...baseOptions, defaultPath: state.filePath } : baseOptions;
    dialog.showSaveDialog(browserWindow, dialogOptions)
      .then(({ canceled, filePath }) => {
        if (canceled) { return; }
        return path.parse(filePath);
      })
      .then((filePath) => {
        setState({ isLoading: true, filePath: null });
        const elements = cy.current.elements().jsons();
        const options = { visualisation: visualisationOptions };
        const data = JSON.stringify({ network: { elements }, options });
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

