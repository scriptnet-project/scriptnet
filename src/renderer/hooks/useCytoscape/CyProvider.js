import React, { useState, useRef } from 'react';
import uuid from 'uuid';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import edgeHandles from 'cytoscape-edgehandles';
import { CyContext } from 'Hooks/useCytoscape';
import useCyLoader from './useCyLoader';
import useCyModes from './useCyModes';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);

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

  const [loadState, loadActions] = useCyLoader(cyRef, setCy);
  const [modeState, modeActions] = useCyModes(cyRef, state.id);

  const value = [
    cyRef,
    state.id,
    { ...loadState, ...modeState },
    { ...loadActions, ...modeActions },
  ];

  return (
    <CyContext.Provider value={value}>
      {children}
    </CyContext.Provider>
  );
};

export default CyProvider;

