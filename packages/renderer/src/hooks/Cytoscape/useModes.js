import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modes } from '../../store/mode';
import { saveAs } from 'file-saver';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import {
  baseStylesheet,
  labelledNodes,
  defaultEntityColours,
} from '../../components/Cytoscape/stylesheets';
import { baseJurisdictionOptions } from '../../components/Forms/sharedOptions';
import { getMode, getModeOptions } from '../../store/selectors/mode';
import { getAutomaticLayout, getShowLabels, getShowMap } from '../../store/selectors/visualisation';
import { getLegendImage, getSVGImage } from '../../utils/canvasImage';

let layout;

const useCyModes = (cy, id) => {
  const mode = useSelector(getMode);
  const modeOptions = useSelector(getModeOptions);

  const showLabels = useSelector(getShowLabels);
  const automaticLayout = useSelector(getAutomaticLayout);
  const showMap = useSelector(getShowMap);

  const dispatch = useDispatch();
  const eh = useRef(null);
  const bb = useRef(null);

  useEffect(() => {
    if (!cy.current) { return; }

    if (showMap) {
      stopLayout();
      // Filter nodes that don't have a location
      // TODO: this should add a "hidden" attribute to the nodes so it can be reverted.
      cy.current.nodes().filter('[!location]').remove();

      const options = {
        // the container in which the map should live, should be a sibling of the cytoscape container
        container: document.getElementById('cy-leaflet'),

        // the data field for latitude
        latitude: (data) => data.location.y,
        // the data field for longitude
        longitude: (data) => data.location.x,
      };

      window.leaf = cy.current.leaflet(options);
      console.info('Created leaflet map with ID', window.leaf.map._container._leaflet_id);

      // Disable automatic layout
      // Do I need to update state here?
      dispatch(visualisationActions.setAutomaticLayout(false));
    }

    if (!showMap) {
      if (window.leaf) {
        console.info('Removing leaflet map with id', window.leaf.map._container._leaflet_id);
        window.leaf.destroy();
      }

      resetStyles();
      dispatch(visualisationActions.setAutomaticLayout(true));
    }

  }, [showMap])

  useEffect(() => {
    if (!cy.current) { return; }

    resetStyles()

    // Bind event handlers for interactions
    cy.current.on('add', (event) => {
      console.log('something added to graph', event.target.classes(), event.target.data('type'));
      if (!event.target.hasClass('eh-ghost') && !event.target.hasClass('eh-preview')) { runLayout(); }
    });

    cy.current.on('select', 'node', (event) => {
      const selectedID = event.target.data().id;
      console.log('A node was selected', selectedID);

      // Animate to the selected node
      cy.current.animate({
        fit: {
          eles: 'node:selected',
          padding: 200,
        },
        center: { x: 200, y: 100 },
      }, {
        duration: 200
      });

      // Dispatch an event so that UI can update
      dispatch(visualisationActions.setSelected(selectedID));
    });

    cy.current.on('unselect', (event) => {
      console.log('A node or edge was de-selected', event);
      dispatch(visualisationActions.clearSelected());
    });

    // 'eh' is the edge creation extension: https://github.com/cytoscape/cytoscape.js-edgehandles
    cy.current.on('ehstart', (event) => {
      stopLayout();
    });

    cy.current.on('ehcomplete', (event) => {
      runLayout();
    });

    if (automaticLayout) {
      runLayout();
    } else {
      stopLayout();
    }

    return () => {
      if (cy.current) {
        cy.current.removeAllListeners();
      }
    }

  }, [id, automaticLayout]);

  const runLayout = () =>
    {
      if (!cy.current) { return; }
      if (layout) { stopLayout() }

      if (automaticLayout) {
      // See: https://github.com/cytoscape/cytoscape.js-cola#api
      const layoutOptions = { name: 'cola', infinite: true, fit: false };
      layout = cy.current.layout(layoutOptions);
      layout.run();
      }
    };

  const stopLayout = () => {
    if (!layout) return;

    layout.stop();
    layout = null;
  }

  const applyRelationshipPreset = () => {
    console.log('enabling relationship preset');
    if (!cy.current) { return; }

    const localHideEdges = modeOptions.hideEdges || [];

    cy.current.elements((ele) => {
      if (ele.isEdge() && localHideEdges.includes(ele.data('type'))) { ele.addClass('hidden') }
      if (ele.isNode()) {
        const edges = ele.connectedEdges().filter((edge) => !localHideEdges.includes(edge.data('type')));

        if (edges.length === 0 ) {
          ele.addClass('half-opacity');
        }
      }
    });
  }

  const applyScenePreset = () => {
    console.log('enabling stage preset');
    if (!cy.current) { return; }

    enableAttributeBoundingBoxes();

    // Apply styles:
    applyStylesheet([
      ...baseStylesheet,
      ...(showLabels ? labelledNodes : []),
    ]);

    const colors = [
      '#ffb90033',
      '#e7485633',
      '#0078d733',
      '#6b69d633',
    ];

    const scenes = [
      'preparation',
      'pre-activity',
      'activity',
      'post-activity',
    ]

    scenes.forEach((scene, index) => {
      if (modeOptions.hideScenes && modeOptions.hideScenes.includes(scene)) {
        return;
      }

      const selector = `node[${scene}="true"]`;
      bb.current.addPath(cy.current.nodes(selector), null, null, {
        virtualEdges: true,
        style: {
          stroke: colors[index],
          strokeWidth: 4,
          fill: colors[index],
        }});
    });
  }

  const applyJurisdictionPreset = () => {
    console.log('enabling jurisdiction preset');
    if (!cy.current) { return; }

    enableAttributeBoundingBoxes();

    // Apply styles:
    applyStylesheet([
      ...baseStylesheet,
      ...(showLabels ? labelledNodes : []),
    ]);

    const colors = [
      '#ffb90033',
      '#e7485633',
      '#0078d733',
      '#6b69d633',
    ];

    baseJurisdictionOptions.forEach((jurisdiction, index) => {
      if (modeOptions.hideJurisdiction && modeOptions.hideJurisdiction.includes(jurisdiction.key)) {
        return;
      }

      const selector = `node[jurisdiction="${jurisdiction.key}"]`;
      bb.current.addPath(cy.current.nodes(selector), null, cy.current.nodes().difference(cy.current.nodes(selector)), {
        virtualEdges: true,
        style: {
          stroke: colors[index],
          strokeWidth: 4,
          fill: colors[index],
        }});
    });
  }

  const applyStylesheet = (stylesheet) => {
    if (!cy.current) { return; }
    cy.current.style(stylesheet);
  }

  const resetStyles = () => {
    if (!cy.current) { return; }

    cy.current.elements().removeClass('hidden half-opacity');
    applyStylesheet([
      ...baseStylesheet,
      ...defaultEntityColours,
      ...(showLabels ? labelledNodes : []),
    ]);
  }

  const enableAttributeBoundingBoxes = () => {
    if (!cy.current) { return; }
    bb.current = cy.current.bubbleSets();
  }

  const disableAttributeBoundingBoxes = () => {
    if (!cy.current || !bb.current) { return; }
    // Remove any existing paths
    bb.current.getPaths().forEach(path => bb.current.removePath(path));
    bb.current.destroy();
  };

  const enableEdgeCreation = (type) => {
    console.log('enabling', type);
    if (!cy.current) { return; }

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

  const exportPNG = async () => {
    if (!cy.current) { return; }

    const drawImageToVirtualCanvas = async (imageData) => {
      return new Promise((resolve, reject) => {
        const context = virtualCanvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0, virtualCanvas.width, virtualCanvas.height);
          resolve();
        };

        image.onerror = () => reject();

        image.src = imageData;
      })
    }

    const virtualCanvas = document.createElement('canvas');
    const cytoElement = document.getElementsByClassName('Visualisation')[0];
    const {width, height} = cytoElement.getBoundingClientRect();
    virtualCanvas.width = width * 4;
    virtualCanvas.height = height * 4;
    const context = virtualCanvas.getContext('2d');

    if(
      mode == modes.CONFIGURE &&
      (modeOptions.preset === 'scene' || modeOptions.preset === 'geography' || modeOptions.preset === 'jurisdiction')
    ) {
      const svgImage = await getSVGImage();
      context.putImageData(svgImage, 0, 0);
    }

    const cytopng = cy.current.png({scale: 4});
    await drawImageToVirtualCanvas(cytopng);
    const legendImage = await getLegendImage();

    // bottom right
    const legendX = virtualCanvas.width - legendImage.width;
    const legendY = virtualCanvas.height - legendImage.height;
    context.putImageData(legendImage, legendX, legendY);

    let canvasBitmap = virtualCanvas.toDataURL();
    saveAs(canvasBitmap, 'Scriptnet Export.png');
  }

  const applyFocalIndividualPreset = () => {
    if (!cy.current) { return; }
    cy.current.autounselectify(true);

    cy.current.on('tap', 'node', (event) => {
      // Set the whole graph to 50% opacity
      cy.current.elements().addClass('half-opacity');

      // Set the neighborhood to full opacity
      event.target.removeClass('half-opacity');
      event.target.neighborhood().removeClass('half-opacity');
    });
  }

  const applyPreset = () => {
    switch (modeOptions.preset) {
      case 'scene':
        applyScenePreset();
        break;
      case 'relationship-filter':
        applyRelationshipPreset();
        break;
      case 'focal':
        applyFocalIndividualPreset();
        break;
      case 'jurisdiction':
        applyJurisdictionPreset();
        break;
      default:
        break;
    };
  }

  useEffect(() => {
    if (!cy.current) { return; }

    disableNodeHighlighting();
    disableEdgeCreation();
    disableAttributeBoundingBoxes();
    resetStyles();

    switch (mode) {
      case modes.ASSIGN_ATTRIBUTES:
        enableNodeHighlighting(modeOptions.highlightScene);
        break;
      case modes.CREATE_EDGES:
        enableEdgeCreation(modeOptions.createEdgeType);
        break;
      case modes.CONFIGURE:
        applyPreset();
        break;
      default:
    };
  }, [
    id,
    showLabels,
    mode,
    modeOptions,
  ]); // could even respond to modeOptions?

  const actions = {
    runLayout,
    applyStylesheet,
    applyScenePreset,
    enableEdgeCreation,
    disableEdgeCreation,
    enableNodeHighlighting,
    disableNodeHighlighting,
    exportPNG,
  };

  return [mode, actions];
};

export default useCyModes;
