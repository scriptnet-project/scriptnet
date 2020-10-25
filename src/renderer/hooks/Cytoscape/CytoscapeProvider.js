import React, { useState, useRef } from 'react';
import uuid from 'uuid';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import BubbleSets from 'cytoscape-bubblesets';
import edgeHandles from 'cytoscape-edgehandles';
import CytoScapeContext from './CytoscapeContext';
import useLoader from './useLoader';
import useModes from './useModes';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);
Cytoscape.use(BubbleSets);

const CyProvider = ({ children }) => {
  const cyRef = useRef(new Cytoscape({ maxZoom: 1.5, headless: true }));

  const [state, setState] = useState(() => ({
    id: uuid(),
  }));

  const setCy = (elements) => {
    if (cyRef.current) {
      cyRef.current.destroy();
    }
    const cy = new Cytoscape({ maxZoom: 1.5, headless: true });
    cy.add(elements);
    cyRef.current = cy;
    setState(() => ({ id: uuid() }));
  };

  const [loadState, loadActions] = useLoader(cyRef, setCy);
  const [modeState, modeActions] = useModes(cyRef, state.id);

  const value = [
    cyRef,
    state.id,
    { ...loadState, ...modeState },
    { ...loadActions, ...modeActions },
  ];

  return (
    <CytoScapeContext.Provider value={value}>
      {children}
    </CytoScapeContext.Provider>
  );
};

export default CyProvider;

