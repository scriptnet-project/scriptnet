import React from 'react';
import Cytoscape from 'Components/Cytoscape';
import Legend from 'Components/Legend';
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
