import React, { useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import './Visualisation.scss';

const network = [
  { data: { id: 'one', label: 'Node 1', type: 'person' }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2', type: 'person' }, position: { x: 100, y: 0 } },
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

const Visualisation = (props) => {
  const cy = useRef(null);

  useEffect(() => {
    // this only runs once
    console.log('ran me', cy.current);

    cy.current.center();

    cy.current.on('add', (event) => {
      console.log('something added to graph', event);

      // Run the layout again
      cy.current.layout({
        name: 'random'
      });

      // Animate the viewport to the graph using the nodes selector
      cy.current.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 500
      });
    });

    cy.current.on('select', (event) => {
      console.log('A node or edge was selected', event);
    });

    console.log(cy.current.nodes().length);
  }, [cy.current]);

  const nodeCount = cy.current && cy.current.nodes().length;

  useEffect(() => {
    // Simulate adding a new node on first run
    setTimeout(() => {
      cy.current.add({
        group: 'nodes',
        data: { type: 'organisation' },
        position: { x: 600, y: 200 }
      });
    }, 2000);
  }, []);

  const layout = { name: 'random' };

  return (
    <div className="Visualisation">
      <CytoscapeComponent
        layout={layout}
        cy={(cyRef) => cy.current = cyRef}
        elements={network}
        style={{
          height: '100%'
        }}
        stylesheet={[
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
        ]}
      />
    </div>
  );
}

export default Visualisation;
