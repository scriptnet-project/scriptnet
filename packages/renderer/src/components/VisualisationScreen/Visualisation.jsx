import React from 'react';
import Cytoscape from '../Cytoscape';
import Legend from '../Legend';
import './Visualisation.scss';

const Visualisation = ({
  panelOpen
}) => (
  <div className={`Visualisation ${panelOpen ? 'Visualisation--openPanel' : ''}`}>
    <Legend />
    <Cytoscape />
  </div>
);

export default Visualisation;
