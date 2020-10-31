import React, { useState, useRef } from 'react';
import uuid from 'uuid';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import BubbleSets from 'cytoscape-bubblesets';
import edgeHandles from 'cytoscape-edgehandles';
import CytoScapeContext from './CytoscapeContext';
import useLoader from './useLoader';
import useModes from './useModes';
import useHelpers from './useHelpers';
import useExportCSV from './useExportCSV';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);
Cytoscape.use(BubbleSets);

const cyOptions = { maxZoom: 1.5, headless: true, wheelSensitivity: 0.25, boxSelectionEnabled: false }

const CyProvider = ({ children }) => {
  const cyRef = useRef(new Cytoscape(cyOptions));

  const [state, setState] = useState(() => ({
    id: uuid(),
  }));

  const setCy = (elements) => {
    if (cyRef.current) {
      cyRef.current.destroy();
    }
    const cy = new Cytoscape(cyOptions);
    cy.add(elements);
    cyRef.current = cy;
    setState(() => ({ id: uuid() }));
  };

  const [loadState, loadActions] = useLoader(cyRef, setCy);
  const [exportState, exportActions] = useExportCSV(cyRef, { filePath: loadState.filePath });
  const [modeState, modeActions] = useModes(cyRef, state.id);
  const [helperActions] = useHelpers(cyRef, state.id);

  const value = [
    cyRef,
    state.id,
    { ...loadState, ...modeState, ...exportState },
    { ...loadActions, ...modeActions, ...exportActions, ...helperActions },
  ];

  return (
    <CytoScapeContext.Provider value={value}>
      {children}
    </CytoScapeContext.Provider>
  );
};

export default CyProvider;

