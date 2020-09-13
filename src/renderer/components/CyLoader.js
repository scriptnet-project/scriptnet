import React from 'react';
import Cytoscape from 'cytoscape';
import { CyContext } from '../hooks/useCytoscape';

const cy = new Cytoscape({ headless: true });

const CyLoader = ({ children }) => {
  return (
    <CyContext.Provider value={cy}>
      {children}
    </CyContext.Provider>
  );
};

export default CyLoader;

