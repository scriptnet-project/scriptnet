import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import electron from 'electron';
import fse from 'fs-extra';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import edgeHandles from 'cytoscape-edgehandles';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { CyContext } from 'Hooks/useCytoscape';
import { stylesheet } from './VisualisationScreen/Visualisation';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);

const dialog = electron.remote.dialog;
const browserWindow = electron.remote.getCurrentWindow();
const cy = new Cytoscape({ maxZoom: 1.5, headless: true });
let eh; // edge handler - extension for edge creation

const initialState = {
  isLoading: false,
  filePath: null,
};

const centerCy = () => {
  // Animate the viewport to the graph using the nodes selector
  cy.animate({
    fit: {
      eles: 'node',
      padding: 100,
    }
  }, {
    duration: 200
  });
};

const CyLoader = ({ children }) => {
  const cyRef = useRef(cy);
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();

  // Event bindings
  console.log('ran me', cy);

  cy.style(stylesheet);

  cy.center();

  cy.on('add', (event) => {
    console.log('something added to graph', event.target.data());
  });

  cy.on('select', 'node', (event) => {
    const selectedID = event.target.data().id;
    console.log('A node was selected', selectedID);
    // Animate to the selected node
    cy.animate({
      fit: {
        eles: 'node:selected',
        padding: 100,
      }
    }, {
      duration: 200
    });

    dispatch(visualisationActions.setSelected(selectedID));
  });

  cy.on('select', 'edge', (event) => {
    const selectedID = event.target.data().id;
    console.log('An edge was selected', selectedID);
    // Animate to the selected node
    cy.animate({
      fit: {
        eles: 'node:selected',
        padding: 100,
      }
    }, {
      duration: 200
    });

    dispatch(visualisationActions.setSelected(selectedID, 'edge'));
  });

  cy.on('unselect', (event) => {
    console.log('A node or edge was de-selected', event);
    dispatch(visualisationActions.clearSelected());
  });

  const baseOptions = {
    filters: [{
      name: 'ScriptNet Case File',
      extensions: ['json']
    }]
  };

  // Actions
  const openNetwork = () => {
    dialog.showOpenDialog(browserWindow, { ...baseOptions })
      .then(({ cancelled, filePaths }) => {
        if (cancelled) { return; }
        return filePaths[0];
      })
      .then(filePath => fse.readFile(filePath, 'utf8'))
      .then((data) => {
        const parsedData = JSON.parse(data);
        const { elements } = parsedData.network;
        cy.elements().remove();
        cy.reset();
        cy.add(elements);
        centerCy();
      });
  };

  const saveNetwork = () => {
    const options = state.filePath ? { defaultPath: state.filePath, ...baseOptions } : { ...baseOptions };
    dialog.showSaveDialog(browserWindow, options)
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return; }
        return filePath;
      })
      .then((filePath) => {
        const elements = cy.elements().jsons()
        const data = JSON.stringify({ network: { elements } });
        fse.writeFile(filePath, data, 'utf8');
      });
  };

  const importCsv = () => {};

  const exportCsv = () => {};

  const runLayout = () => {
    // See: https://github.com/cytoscape/cytoscape.js-cola#api
    const layoutOptions = { name: 'cola' };
    cy.layout(layoutOptions).run();

    // TODO: If there's a selected node, center on it instead
    centerCy();

  }

  const enableEdgeCreation = (type) => {
    console.log('enabling', type)
    cy.autounselectify(true);
    eh = cy.edgehandles({
      edgeParams: ( sourceNode, targetNode, i ) => {
        console.log('edge params', sourceNode, targetNode, i);
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        // NB: i indicates edge index in case of edgeType: 'node'
        return {
          data: {
            type,
          }
        };
      },
    });
    eh.enableDrawMode();
  }

  const disableEdgeCreation = () => {
    cy.autounselectify(false);
    if (eh) {
      eh.disableDrawMode();
      eh.destroy();
    }
  }

  const enableNodeHighlighting = (attribute) => {
    console.log('enabling node highlighting', attribute)
    cy.autounselectify(true);

    // Get nodes with attribute and apply .highlighted class
    const selector = `node[${attribute} = "true"]`;
    cy.nodes(selector).addClass('highlighted') ;
    console.log('enable', selector);

    cy.on('tap', 'node', (event) => {
      // determine if attribute is already set
      console.log('A node or edge was TAPPED', event.target.data());
      if (event.target.data(attribute) === 'true') {
        event.target.data(attribute, 'false');
        event.target.removeClass('highlighted');
        return;
      }

      event.target.data(attribute, 'true');
      event.target.addClass('highlighted');
    });
  }

  const disableNodeHighlighting = () => {
    console.log('disabling node highlighting');
    cy.autounselectify(false);
    cy.nodes().removeClass('highlighted') ;
    cy.removeListener('tap');
  }

  const recalculateSize = () => {
    console.log('recalculateSize');

    // setTimeout(() => {
    //   // cy.resize();
      // cy.fit();
      // centerCy();
    // }, 500);
  }

  const actions = {
    openNetwork,
    saveNetwork,
    importCsv,
    exportCsv,
    runLayout,
    enableEdgeCreation,
    disableEdgeCreation,
    enableNodeHighlighting,
    disableNodeHighlighting,
    recalculateSize,
  };
  const value = [cyRef.current, actions];

  return (
    <CyContext.Provider value={value}>
      {children}
    </CyContext.Provider>
  );
};

export default CyLoader;

