import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTheme } from '@fluentui/react';
import useCytoscape from '../../hooks/useCytoscape';
import Cytoscape from '../Cytoscape';

import './Visualisation.scss';
import { useSessionStorage } from '../../hooks/useSessionStorage';

const theme = getTheme();
const stylesheet = [
  {
    selector: '.eh-handle',
    style: {
      'background-color': theme.palette.yellow,
      'width': 12,
      'height': 12,
      'shape': 'ellipse',
      'overlay-opacity': 0,
      'border-width': 5, // makes the handle easier to hit
      'border-opacity': 0
    }
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': theme.palette.yellow,
      'line-color': theme.palette.yellow,
      'target-arrow-color': theme.palette.yellow,
      'source-arrow-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      'opacity': 0
    }
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'lineColor': theme.palette.themeTertiary,
      'target-arrow-color': theme.palette.themeTertiary,
      'source-arrow-color': theme.palette.themeTertiary
    }
  },
  {
    selector: 'node',
    style: {
      'font-size': 12,
      'color': theme.palette.themePrimary,
      'text-margin-y': 5,
      "text-valign": "bottom",
      "text-halign": "bottom",
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 5,
      'border-color': theme.palette.yellow
    }
  },
  {
    selector: 'node[type = "person"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.themePrimary,
      shape: 'circle'
    },
  },
  {
    selector: 'node[type = "place"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.purple,
      shape: 'round-rectangle',
    },
  },
  {
    selector: 'node[type = "resource"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.tealLight,
      shape: 'round-triangle',
    },
  },
  {
    selector: 'node[type = "business"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.orange,
      shape: 'diamond',
    },
  },
];

const Visualisation = ({
  panelOpen
}) => {
  const [cy, cyActions] = useCytoscape();
  const [selectedNode, setSelectedNode] = useSessionStorage('selectedNode', null);


  useEffect(() => {
    // this only runs once, this might make more sense to live in useCytoscape
    console.log('ran me', cy);

    cy.style(stylesheet);

    cy.center();

    cy.on('add', (event) => {
      console.log('something added to graph', event);
    });

    cy.on('select', 'node', (event) => {
      const selectedID = event.target.data().id;
      console.log('A node or edge was selected', selectedID);
      // Animate to the selected node
      cy.animate({
        fit: {
          eles: 'node:selected',
          padding: 100,
        }
      }, {
        duration: 200
      });
      setSelectedNode(selectedID);

    });

    cy.on('unselect', (event) => {
      console.log('A node or edge was de-selected', event);
      setSelectedNode(null);
  });
  }, []);

  return (
    <div className={(`Visualisation ${panelOpen ? 'Visualisation--openPanel' : ''}`)}>
      <Cytoscape />
    </div>
  );
}

export default Visualisation;
