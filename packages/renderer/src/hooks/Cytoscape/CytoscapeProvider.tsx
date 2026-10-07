import { useState, useRef, useEffect, PropsWithChildren } from 'react';
import { v4 as uuid } from 'uuid';
import Cytoscape, { CytoscapeOptions } from 'cytoscape';
// @ts-ignore:next-line
import leaflet from 'cytoscape-leaf';
// @ts-ignore:next-line
import cola from 'cytoscape-cola';
// @ts-ignore:next-line
import BubbleSets from 'cytoscape-bubblesets';
// @ts-ignore:next-line
import edgeHandles from 'cytoscape-edgehandles';
// @ts-ignore:next-line
import CytoScapeContext from './CytoscapeContext';
// @ts-ignore:next-line
import useLoader from './useLoader';
// @ts-ignore:next-line
import useModes from './useModes';
// @ts-ignore:next-line
import useHelpers from './useHelpers';
// @ts-ignore:next-line
import useExportCSV from './useExportCSV';

// Initialise extensions
Cytoscape.use(cola);
Cytoscape.use(edgeHandles);
Cytoscape.use(BubbleSets);
Cytoscape.use(leaflet);


const cyOptions: CytoscapeOptions = {
  maxZoom: 1.25,
  minZoom: 0.25,
  headless: true,
  boxSelectionEnabled: false,
  styleEnabled: true,
};


const CyProvider = ({ children }: PropsWithChildren<{}>) => {
  const cyRef = useRef<Cytoscape.Core | null>(null);
  if (!cyRef.current) cyRef.current = Cytoscape(cyOptions);

  const [state, setState] = useState(() => ({
    id: uuid(),
  }));

  const initializeCy = (elements = []) => {
    console.info("Initializing Cytoscape");
    if (cyRef.current) {
      modeActions.destroyMap();
      modeActions.stopLayout();
      cyRef.current.destroy();
    }

    const cy = Cytoscape(cyOptions);
    cy.add(elements);

    // There was a bug in the edge handles extension that caused it to fail to
    // remove the .eh-preview-active class. This was then written to all data
    // files.
    //
    // As a bodge, we remove this class from all nodes here.
    cy.nodes().removeClass('eh-preview-active');

    cyRef.current = cy;

    setState(() => ({ id: uuid() }));
  };

  const [loadState, loadActions] = useLoader(cyRef, initializeCy);
  const [exportState, exportActions] = useExportCSV(cyRef, { filePath: loadState.filePath });
  const [modeState, modeActions] = useModes(cyRef, state.id);
  const [helperActions] = useHelpers(cyRef, state.id);

  const value = [
    cyRef,
    state.id,
    { ...loadState, ...modeState, ...exportState },
    { ...loadActions, ...modeActions, ...exportActions, ...helperActions },
  ];

  console.log('provider', modeState);

  useEffect(() => {

    window.api.onFileSaved((filePath: string) => loadActions.updateFilePath(filePath));

    window.api.onFileOpened((data: Object, filePath: string) => {
      loadActions.loadCase(data, filePath);
    });

    window.api.onTriggerSave(() => {
      const response = loadActions.getSaveableData(modeActions.getAllElements());
      window.api.saveCase(response);
    });

    window.api.onTriggerSaveCSV(() => {
      const response = exportActions.getCSVData(modeActions.getAllElements());
      window.api.saveCSV(response);
    })

    window.api.onTriggerSaveScreenshot(async () => {
      const imageData = await modeActions.getImageData();
      window.api.saveScreenshot(imageData);
    })

    return () => {
      window.api.removeListeners();
    }
  }, [loadState, modeState, state.id]); // modeState needed so that getImageData has latest state

  return (
    <CytoScapeContext.Provider value={value}>
      {children}
    </CytoScapeContext.Provider>
  );
};

export default CyProvider;
