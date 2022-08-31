import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modes } from '../../store/mode';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import {
  baseStylesheet,
  labelledNodes,
  withEntityColors,
  unlabelledNodes,
} from '../../components/Cytoscape/stylesheets';
import { baseJurisdictionOptions } from '../../components/Forms/sharedOptions';
import { getMode, getModeOptions } from '../../store/selectors/mode';
import { getAutomaticLayout, getShowLabels, getShowMap } from '../../store/selectors/visualisation';
import { getLegendImage, getSVGImage } from '../../utils/canvasImage';
import { get } from 'lodash';

let filteredElements;

const useCyModes = (cy, id) => {
  const mode = useSelector(getMode);
  const layout = useRef();
  const modeOptions = useSelector(getModeOptions);
  const showLabels = useSelector(getShowLabels);
  const automaticLayout = useSelector(getAutomaticLayout);
  const showMap = useSelector(getShowMap);
  const [nodeCount, setNodeCount] = useState(0);

  const dispatch = useDispatch();
  const eh = useRef(null);
  const bb = useRef(null);

  const initializeMap = () => {
    // Filter nodes that don't have a location
    filteredElements = cy.current.nodes().filter('[!location]').remove();

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
    stopLayout();
  }

  const destroyMap = () => {
    console.log('Destroy map');
    if (window.leaf) {
      console.info('Removing leaflet map with id', window.leaf.map._container._leaflet_id);
      window.leaf.destroy();
    }

    if (filteredElements && !showMap) {
      filteredElements.restore();
      filteredElements = null;
    }

    runLayout();
  }

  useEffect(() => {
    console.log('Show Map changed', showMap);
    if (!cy.current) { return; }

    if (showMap) {
      initializeMap();
    }

    if (!showMap) {
      if (window.leaf) {
        destroyMap();
      }
    }

  }, [showMap])

  useEffect(() => {
    if (!cy.current) { return; }

    resetStyles();
    runLayout();

    // Use regex to check if any class in the classes array begins with 'eh-'
    const isForbiddenType = (classes) => {
      const re = new RegExp('^eh-');
      const forbidden = classes.some(c => re.test(c));
      return forbidden;
    }

    // Bind event handlers for interactions
    cy.current.on('add remove', 'node', (event) => {
      const node = event.target;
      console.log('test', node.classes(), isForbiddenType(node.classes()));

      if (isForbiddenType(node.classes())) {
        return;
      }

      setNodeCount(cy.current.nodes().length);
    });

    cy.current.on('select', 'node', (event) => {
      // Don't select if we are in anything other than default mode
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

    cy.current.on('select', 'edge', (event) => {
      const selectedID = event.target.data().id;
      console.log('An edge was selected', selectedID);
      // Animate to the selected node
      cy.current.animate({
        fit: {
          eles: 'edge:selected',
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

    // 'eh' is the edge creation extension: https://github.com/cytoscape/cytoscape.js-edgehandles
    cy.current.on('ehstart', (event) => {
      stopLayout();
    });

    cy.current.on('ehcomplete', (event) => {
      console.log('ehcompleteevent');
      runLayout();
    });

    return () => {
      if (cy.current) {
        cy.current.removeAllListeners();
      }

      if (window.leaf) {
        destroyMap();
      }
    }

  }, [id]);

  useEffect(() => {
    console.log('layout use effect');
    if (automaticLayout) {
      runLayout();
    } else {
      stopLayout();
    }
  }, [automaticLayout]);

  const runLayout = (force = false) => {
    console.log('runLayout', automaticLayout);

    if (!force) {
      if (!cy.current) { return; }
      if (!automaticLayout) { return; }
      if (showMap) { return; }
    } else {
      console.info('Forcing runLayout()!');
    }


    if (layout.current) {
      stopLayout();
    }

    // See: https://github.com/cytoscape/cytoscape.js-cola#api
    const layoutOptions = {
      name: 'cola',
      infinite: true,
      fit: false,
    };

    layout.current = cy.current.layout(layoutOptions);
    layout.current.run();
  };

  const stopLayout = () => {
    console.log('stop layout');
    if (!layout.current) return;

    layout.current.stop();
    layout.current.destroy();
    layout.current = null;
  }

  const applyRelationshipPreset = () => {
    if (!cy.current) { return; }

    cy.current.autounselectify(true);

    const localHideEdges = modeOptions.hideEdges || [];

    cy.current.elements((ele) => {
      if (ele.isEdge() && localHideEdges.includes(ele.data('type'))) { ele.addClass('hidden') }
      if (ele.isNode()) {
        const edges = ele.connectedEdges().filter((edge) => !localHideEdges.includes(edge.data('type')));

        if (edges.length === 0) {
          ele.addClass('half-opacity');
        }
      }
    });
  }

  const generateBubblesFromScenes = () => {
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

    const bubbleScenes = scenes.filter(scene => !get(modeOptions, 'hideScenes', []).includes(scene))

    bubbleScenes.forEach((scene, index) => {
      const selector = `node[${scene}="true"]`;
      const nodes = cy.current.nodes(selector)
      bb.current.addPath(nodes, null, null, {
        virtualEdges: true,
        drawPotentialArea: true,
        style: {
          stroke: colors[index],
          strokeWidth: 4,
          fill: colors[index],
        }
      });
    });
  }

  const applyScenePreset = () => {
    console.log('applyscenepreset');
    if (!cy.current) { return; }

    cy.current.autounselectify(true);

    if (!bb.current) {
      enableAttributeBoundingBoxes();
    } else {
      disableAttributeBoundingBoxes();
      enableAttributeBoundingBoxes();
    }

    // Apply styles:
    applyStylesheet([
      ...baseStylesheet,
      ...(showLabels ? labelledNodes : unlabelledNodes),
    ]);

    generateBubblesFromScenes();
  }

  const applyJurisdictionPreset = () => {
    if (!cy.current) { return; }

    if (!bb.current) {
      enableAttributeBoundingBoxes();
    } else {
      disableAttributeBoundingBoxes();
      enableAttributeBoundingBoxes();
    }

    // Apply styles:
    applyStylesheet([
      ...baseStylesheet,
      ...(showLabels ? labelledNodes : unlabelledNodes),
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
        }
      });
    });
  }

  const applyStylesheet = (stylesheet) => {
    if (!cy.current) { return; }
    cy.current.style(stylesheet);
  }

  const resetStyles = () => {
    console.log('Reset styles');
    if (!cy.current) { return; }

    cy.current.elements().removeClass('hidden half-opacity');

    applyStylesheet([
      ...baseStylesheet,
      ...withEntityColors,
      ...(showLabels ? labelledNodes : unlabelledNodes),
    ]);
  }

  const disableAttributeBoundingBoxes = () => {
    if (!bb.current) { return; }
    // Remove any existing paths
    bb.current.getPaths().forEach((path) => {
      console.log('Disabling path');
      path.remove();
    })
    bb.current.destroy();
    bb.current = null;
  };

  const enableAttributeBoundingBoxes = () => {
    if (!cy.current) { return; }
    disableAttributeBoundingBoxes();
    bb.current = cy.current.bubbleSets();
  }

  const enableEdgeCreation = (type) => {
    if (!cy.current) { return; }

    cy.current.autounselectify(true);
    eh.current = cy.current.edgehandles({
      edgeParams: (sourceNode, targetNode, i) => {
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

    cy.current.autounselectify(true);

    // Get nodes with attribute and apply .highlighted class
    const selector = `node[${attribute} = "true"]`;
    cy.current.nodes(selector).addClass('highlighted');

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
    cy.current.autounselectify(false);
    cy.current.nodes().removeClass('highlighted');
    cy.current.removeListener('tap');
  };

  const getImageData = async () => {
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
    const { width, height } = cytoElement.getBoundingClientRect();
    virtualCanvas.width = width * 4;
    virtualCanvas.height = height * 4;
    const context = virtualCanvas.getContext('2d');

    if (
      mode == modes.CONFIGURE &&
      (modeOptions.preset === 'scene' || modeOptions.preset === 'geography' || modeOptions.preset === 'jurisdiction')
    ) {
      const svgImage = await getSVGImage();
      context.putImageData(svgImage, 0, 0);
    }

    const cytopng = cy.current.png({ scale: 4 });
    await drawImageToVirtualCanvas(cytopng);
    const legendImage = await getLegendImage();

    // bottom right
    const legendX = virtualCanvas.width - legendImage.width;
    const legendY = virtualCanvas.height - legendImage.height;
    context.putImageData(legendImage, legendX, legendY);

    let canvasBitmap = virtualCanvas.toDataURL();
    const data = canvasBitmap.replace(/^data:image\/\w+;base64,/, "");
    return data;
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
    console.log('apply preset');
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
    console.log('node count changed', nodeCount);

    if (mode == modes.CONFIGURE) {
      applyPreset();
    }
    runLayout();
  }, [nodeCount])

  useEffect(() => {
    if (showMap) {
      if (window.leaf) {
        window.leaf.fit();
      }
    }
  }, [showMap, window.leaf])

  useEffect(() => {
    console.log('Main use Effect');
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
    // id,
    mode,
    modeOptions,
  ]);

  useEffect(() => {
    if (!cy.current) { return; }
    applyStylesheet([
      ...cy.current.style().json(),
      ...(showLabels ? labelledNodes : unlabelledNodes),
    ]);
  }, [showLabels])

  const actions = {
    runLayout,
    applyStylesheet,
    applyScenePreset,
    applyPreset,
    enableEdgeCreation,
    disableEdgeCreation,
    enableNodeHighlighting,
    disableNodeHighlighting,
    getImageData,
  };

  return [mode, actions];
};

export default useCyModes;
