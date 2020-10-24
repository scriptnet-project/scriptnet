import React from 'react';
import Cytoscape from 'Components/Cytoscape';
import './Visualisation.scss';

const Visualisation = ({
  panelOpen
}) => {

  return (
    <div className={(`Visualisation ${panelOpen ? 'Visualisation--openPanel' : ''}`)}>
      <Cytoscape />
    </div>
  );
}

export default Visualisation;
