import React from 'react';
import Cytoscape from 'cytoscape';

const CyContext = React.createContext(new Cytoscape());

const CyProvider = CyContext.Provider;

export { CyContext };

export default CyProvider;
