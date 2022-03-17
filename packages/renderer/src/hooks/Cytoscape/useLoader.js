import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import { actionCreators as visualisationActions } from '../../store/visualisation';

const initialState = {
  isLoading: false,
  filePath: null,
};

const baseOptions = {
  filters: [{
    name: 'ScriptNet Case File',
    extensions: ['json']
  }],
  defaultPath: './',
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

  const handleFileOpen = async (filePath) => {
    const data = await window.openFile(filePath);

    const parsedData = JSON.parse(data);

    const elements = get(parsedData, 'network.elements', []);
    const options = get(parsedData, 'options', {});
    initializeVisualisationOptions(options.visualisation);
    initializeCy(elements);
    setState(s => ({ ...s, filePath, isLoading: false }));
  }

  const openNetwork = async () => {
    
    const dialogOptions = state.filePath ? { ...baseOptions, defaultPath: window.path.dirname(state.filePath) } : baseOptions;
    
    setState({ isLoading: true, filePath: null }); // could set filePath here?
    
    const path = await window.openDialog(dialogOptions);

    if (!path) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }

    return handleFileOpen(path);

  };

  const saveNetwork = async () => {
    const dialogOptions = state.filePath ? { ...baseOptions, defaultPath: state.filePath } : baseOptions;

    const elements = cy.current.elements().jsons();
    const options = { visualisation: visualisationOptions };
    const data = JSON.stringify({ network: { elements }, options });

    setState({ isLoading: true, filePath: null });
    const jsonFilePath = await window.saveFile(dialogOptions, data)
    setState(s => ({ ...s, filePath: jsonFilePath, loading: false }));
  };

  const actions = {
    openNetwork,
    handleFileOpen,
    saveNetwork,
    newNetwork,
  };

  return [state, actions];
};

export default useCyLoader;

