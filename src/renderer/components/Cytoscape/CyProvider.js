import React from 'react';
import Cytoscape from 'cytoscape';

const cy = new Cytoscape({ headless: true });

const CyContext = React.createContext(cy);

const CyProvider = CyContext.Provider;

export { CyContext };

export default CyProvider;
