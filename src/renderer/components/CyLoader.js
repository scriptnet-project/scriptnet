import React, { useEffect, useState, useRef } from 'react';
import electron from 'electron';
import fse from 'fs-extra';
import Cytoscape from 'cytoscape';
import { CyContext } from '../hooks/useCytoscape';

const dialog = electron.remote.dialog;
const cy = new Cytoscape({ headless: true });

const initialState = {
  isLoading: false,
  filePath: null,
};

const CyLoader = ({ children }) => {
  const cyRef = useRef(cy);
  const [state, setState] = useState(initialState);

  const openNetwork = () => {
    dialog.showOpenDialog()
      .then(({ cancelled, filePaths }) => {
        if (cancelled) { return; }
        return filePaths[0];
      })
      .then(filePath => fse.readFile(filePath, 'utf8'))
      .then((data) => {
        const elements = JSON.parse(data);
        cy.elements().remove();
        cy.reset();
        cy.add(elements);
      });
  };

  const saveNetwork = () => {
    const options = state.filePath ? { defaultPath: state.filePath } : {};
    dialog.showSaveDialog(options)
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return; }
        return filePath;
      })
      .then((filePath) => {
        const data = JSON.stringify(cy.elements().jsons());
        fse.writeFile(filePath, data, 'utf8');
      });
  };

  const actions = { openNetwork, saveNetwork };
  const value = [cyRef.current, actions];

  return (
    <CyContext.Provider value={value}>
      {children}
    </CyContext.Provider>
  );
};

export default CyLoader;

