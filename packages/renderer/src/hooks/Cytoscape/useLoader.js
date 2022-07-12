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

  const newNetwork = () => {
    initializeCy();
    setState(initialState);
  };

  window.ipcRenderer.on('case-opened', (event, data, path) => {
    // console.log('case-opened', event, data, path) // prints "pong"
    handleFileOpen(data, path);
  })

  const handleFileOpen = async (parsedData, filePath) => {
    const elements = get(parsedData, 'network.elements', []);
    initializeCy(elements);
    setState(s => ({ ...s, filePath, isLoading: false }));
  }

  const saveNetwork = async () => {
    console.log('save network', state);
    const dialogOptions = state.filePath ? { defaultPath: state.filePath } : {};

    const elements = cy.current.elements().jsons();
    const data = JSON.stringify({ network: { elements } });

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

