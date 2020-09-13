import React, { useEffect } from 'react';
import useCytoscape from '../../hooks/useCytoscape';
import Cytoscape from '../Cytoscape';
import './Visualisation.scss';

const layout = { name: 'random' };

const network = [
  { data: { id: 'one', label: 'Node 1', type: 'person' }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2', type: 'person' }, position: { x: 100, y: 0 } },
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

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
  const cy = useCytoscape();

  useEffect(() => {
    // this only runs once
    console.log('ran me', cy);

    cy.style(stylesheet);

    cy.add(network);

    cy.layout(layout);

    cy.center();

    cy.on('add', (event) => {
      console.log('something added to graph', event);

      // Run the layout again
      cy.layout({
        name: 'random'
      });

      // Animate the viewport to the graph using the nodes selector
      cy.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 500
      });
    });

    cy.on('select', (event) => {
      console.log('A node or edge was selected', event);
    });

    // Simulate adding a new node on first run
    setTimeout(() => {
      cy.add({
        group: 'nodes',
        data: { type: 'organisation' },
        position: { x: 600, y: 200 }
      });
    }, 2000);
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
