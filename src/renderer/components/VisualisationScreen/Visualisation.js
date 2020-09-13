import React, { useEffect } from 'react';
import useCytoscape from '../../hooks/useCytoscape';
import Cytoscape from '../Cytoscape';
import './Visualisation.scss';

const layout = { name: 'random' };

const stylesheet = [
  {
    selector: 'node[type = "person"]',
    style: {
      label: "data(id)",
      'background-color': 'blue',
      shape: 'rectangle',
    },
  },
  {
    selector: 'node[type = "organisation"]',
    style: {
      label: "data(id)",
      'background-color': 'tomato',
      shape: 'circle',
    },
  },
];

const Visualisation = (props) => {
  const [cy] = useCytoscape();

  useEffect(() => {
    // this only runs once, this might make more sense to live in useCytoscape
    console.log('ran me', cy);

    cy.style(stylesheet);

    cy.layout(layout);

    cy.center();

    cy.on('add', (event) => {
      console.log('something added to graph', event);
    });

    cy.on('select', (event) => {
      console.log('A node or edge was selected', event);
    });
  }, []);

  return (
    <div className="Visualisation">
      <Cytoscape
        style={{
          height: '100%'
        }}
      />
    </div>
  );
}

export default Visualisation;
