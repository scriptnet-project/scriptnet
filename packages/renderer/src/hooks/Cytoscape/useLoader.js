import { useEffect, useState } from 'react';
import { get } from 'lodash';

const initialState = {
  filePath: null,
};

const useCyLoader = (cy, initializeCy) => {
  const [state, setState] = useState(initialState);

  const resetLoader = () => {
    console.log('reset loader');
  }

  const loadCase = async (data, filePath) => {
    console.log('load case', data, filePath);
    const elements = get(data, 'network.elements', []);
    initializeCy(elements);
    setState(s => ({ ...s, filePath }));
  }

  const getSaveableData = () => {
    console.log('saveCase', state);

    const elements = cy.current.elements().jsons();
    const data = JSON.stringify({ network: { elements } });

    // Call main process here
    return {
      data,
      filePath: state.filePath
    }
  };

  const updateFilePath = (filePath) => {
    console.log("Updating file path: ", filePath);
    setState(s => ({
      ...s, filePath
    }))
  }

  useEffect(() => {
    console.log('Loader state', state);
  }, [state]);

  const actions = {
    loadCase,
    getSaveableData,
    updateFilePath,
  };

  return [state, actions];
};

export default useCyLoader;

