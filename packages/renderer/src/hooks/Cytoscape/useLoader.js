import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import { actionCreators as visualisationActions } from '../../store/visualisation';

const initialState = {
  isLoading: false,
  filePath: null,
};

const useCyLoader = (cy, initializeCy) => {
  console.log('useCyLoader');
  const [state, setState] = useState(initialState);
  const visualisationOptions = useSelector(state => state.visualisation);
  const dispatch = useDispatch();
  const initializeVisualisationOptions = (options = {}) =>
    dispatch(visualisationActions.initializeVisualisationOptions(options));

  const newNetwork = () => {
    initializeCy();
    setState(initialState);
  };

  window.ipcRenderer.on('case-opened', (event, data, path) => {
    console.log('case-opened', event, data, path) // prints "pong"
    handleFileOpen(data, path);
  })

  const handleFileOpen = async (parsedData, filePath) => {
    console.log('handl', filePath);
    const elements = get(parsedData, 'network.elements', []);
    const options = get(parsedData, 'options', {});
    initializeVisualisationOptions(options.visualisation);
    initializeCy(elements);
    setState(s => ({ ...s, filePath, isLoading: false }));
  }

  const saveNetwork = async () => {
    console.log('save network', state);
    const dialogOptions = state.filePath ? { defaultPath: state.filePath } : {};

    const elements = cy.current.elements().jsons();
    const options = { visualisation: visualisationOptions };
    const data = JSON.stringify({ network: { elements }, options });

    setState({ isLoading: true });
    const jsonFilePath = await window.saveFile(dialogOptions, data, state.filePath)
    setState(s => ({ ...s, filePath: jsonFilePath, loading: false }));
  };

  const actions = {
    handleFileOpen,
    saveNetwork,
    newNetwork,
  };

  return [state, actions];
};

export default useCyLoader;

