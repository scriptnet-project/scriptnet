import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modes } from 'Store/mode';
import { actionCreators as visualisationActions } from 'Store/visualisation';
import { stylesheet } from 'Components/Cytoscape';

const useCyModes = (cy, id) => {
  const state = useSelector(s => s.mode);
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

  const enableScenePreset = () => {
    console.log('enabling stage preset');
    if (!cy.current) { return; }

    const bb = cy.current.bubbleSets();

    const colors = [
      '#ffb900',
      '#e74856',
      '#0078d7',
      '#6b69d6',
    ];


    const scenes = [
      'preparation',
      'pre-activity',
      'activity',
      'post-activity',
    ]

    // Remove any existing paths
    bb.getPaths().forEach(path => bb.removePath(path));

    scenes.forEach((scene, index) => {
      const selector = `node[${scene}="true"]`;
      bb.addPath(cy.current.nodes(selector), null, null, {
        virtualEdges: true,
        style: {
          fill: colors[index],
          opacity: 0.5,
          // stroke: 'red',
          // strokeDasharray: '5, 5, 5'
        }});
    });
  }

  const enableEdgeCreation = (type) => {
    console.log('enabling', type);
    if (!cy.current) { return; }

    const bb = cy.current.bubbleSets();

    const types = [
      'person',
      'location',
      'resource',
      'organisation'
    ];

    bb.getPaths().forEach(path => bb.removePath(path));

    types.forEach(type => {
      const selector = `node[type="${type}"]`;
      bb.addPath(cy.current.nodes(selector), null, null, {
        virtualEdges: true,
        style: {
          fill: 'rgba(255, 0, 0, 0)',
          stroke: 'red',
          strokeDasharray: '5, 5, 5'
        }});
    });

    cy.current.autounselectify(true);
    eh.current = cy.current.edgehandles({
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
    cy.current.autounselectify(false);
    if (!eh.current) { return; }
    eh.current.disableDrawMode();
    eh.current.destroy();
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

    disableNodeHighlighting();
    disableEdgeCreation();

    switch (state.mode) {
      case modes.ASSIGN_ATTRIBUTES:
        enableNodeHighlighting(state.options.highlightScene);
        break;
      case modes.CREATE_EDGES:
        enableEdgeCreation(state.options.createEdgeType);
        break;
      case modes.CONFIGURE:
        enableScenePreset();
        break;
      default:
        runLayout();
        break;
    };
  }, [id, state.mode, state.options.highlightScene, state.options.createEdgeType]); // could even respond to state.options?

  const actions = {
    runLayout,
    enableEdgeCreation,
    disableEdgeCreation,
    enableNodeHighlighting,
    disableNodeHighlighting,
  };

  return [state, actions];
};

export default useCyModes;
