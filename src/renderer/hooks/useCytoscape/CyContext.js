import React from 'react';
import Cytoscape from 'cytoscape';

const cy = new Cytoscape({ headless: true });

const CyContext = React.createContext(cy);

export default CyContext;
