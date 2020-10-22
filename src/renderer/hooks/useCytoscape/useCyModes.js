import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { stylesheet } from 'Components/VisualisationScreen/Visualisation';

const initialState = {
  mode: null,
  options: {},
};

const useCyModes = (cy, id) => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const eh = useRef(null);

  useEffect(() => {
    console.log('ran cy mode', { cy, id });

    if (!cy.current) { return; }

    cy.current.style(stylesheet);

    cy.current.center();

    cy.current.on('add', (event) => {
      console.log('something added to graph', event.target.data());
    });

    cy.current.on('select', 'node', (event) => {
      const selectedID = event.target.data().id;
      console.log('A node was selected', selectedID);
      // Animate to the selected node
      cy.current.animate({
        fit: {
          eles: 'node:selected',
          padding: 100,
        }
      }, {
        duration: 200
      });

      dispatch(visualisationActions.setSelected(selectedID));
    });

    cy.current.on('select', 'edge', (event) => {
      const selectedID = event.target.data().id;
      console.log('An edge was selected', selectedID);
      // Animate to the selected node
      cy.current.animate({
        fit: {
          eles: 'node:selected',
          padding: 100,
        }
      }, {
        duration: 200
      });

      dispatch(visualisationActions.setSelected(selectedID, 'edge'));
    });

    cy.current.on('unselect', (event) => {
      console.log('A node or edge was de-selected', event);
      dispatch(visualisationActions.clearSelected());
    });

  }, [id]);


  const runLayout = () =>
    {
      if (!cy.current) { return; }
      // See: https://github.com/cytoscape/cytoscape.js-cola#api
      const layoutOptions = { name: 'cola' };
      cy.current.layout(layoutOptions).run();

      // TODO: If there's a selected node, center on it instead
      cy.current.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 200
      });
    };


  const enableEdgeCreation = (type) => {
    console.log('enabling', type);
    if (!cy.current) { return; }
    cy.current.autounselectify(true);
    eh.current = cy.edgehandles({
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
    eh.current.enableDrawMode();
  }

  const disableEdgeCreation = () => {
    if (!cy.current) { return; }
    cy.autounselectify(false);
    if (!eh.current) { return; }
    eh.current.disableDrawMode();
    eh.destroy();
  };

  const enableNodeHighlighting = (attribute) => {
    if (!cy.current) { return; }
    console.log('enabling node highlighting', attribute)
    cy.current.autounselectify(true);

    // Get nodes with attribute and apply .highlighted class
    const selector = `node[${attribute} = "true"]`;
    cy.current.nodes(selector).addClass('highlighted') ;
    console.log('enable', selector);

    cy.current.on('tap', 'node', (event) => {
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
  };

  const disableNodeHighlighting = () => {
    console.log('disabling node highlighting');
    cy.current.autounselectify(false);
    cy.current.nodes().removeClass('highlighted') ;
    cy.current.removeListener('tap');
  };

  useEffect(() => {
    if (!cy.current) { return; }

    switch (state.mode) {
      default:
        runLayout();
        break;
    };
  }, [id, state.mode]);

  const setMode = (mode, options = {}) =>
    setState({ options, mode });

  const actions = {
    runLayout,
    enableEdgeCreation,
    disableEdgeCreation,
    enableNodeHighlighting,
    disableNodeHighlighting,
    setMode
  };

  return [state, actions];
};

export default useCyModes;
