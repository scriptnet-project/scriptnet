import React, { useEffect, useState, useRef } from 'react';
import electron from 'electron';
import fse from 'fs-extra';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import edgeHandles from 'cytoscape-edgehandles';
import { CyContext } from '../hooks/useCytoscape';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);

const dialog = electron.remote.dialog;
const cy = new Cytoscape({ maxZoom: 1.5, headless: true });
let eh;

const initialState = {
  isLoading: false,
  filePath: null,
};

const centerCy = () => {
  // Animate the viewport to the graph using the nodes selector
  cy.animate({
    fit: {
      eles: 'node',
      padding: 100,
    }
  }, {
    duration: 500
  });
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
        centerCy();
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

  const runLayout = () => {
    // See: https://github.com/cytoscape/cytoscape.js-cola#api
    const layoutOptions = { name: 'cose' };
    cy.layout(layoutOptions).run();
  }

  const enableEdgeCreation = () => {
    eh = cy.edgehandles();
    eh.enable();
  }

  const disableEdgeCreation = () => {
    if (eh) {
      eh.disable();
      eh.destroy();
    }
  }

  const actions = {
    openNetwork,
    saveNetwork,
    runLayout,
    enableEdgeCreation,
    disableEdgeCreation,
  };
  const value = [cyRef.current, actions];

  return (
    <CyContext.Provider value={value}>
      {children}
    </CyContext.Provider>
  );
};

export default CyLoader;

