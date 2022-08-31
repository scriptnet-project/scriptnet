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
import { IpcMainEvent } from 'electron';

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

declare global {
    interface Window { api: {
      onFileSaved: Function,
      onFileOpened: Function,
      onTriggerSave: Function,
      onTriggerSaveCSV: Function,
      onTriggerSaveScreenshot: Function,
    }; }
}

const CyProvider = ({ children }: PropsWithChildren<{}>) => {
  const cyRef = useRef(Cytoscape(cyOptions));

  const [state, setState] = useState(() => ({
    id: uuid(),
  }));

  const initializeCy = (elements = []) => {
    console.info("Initializing Cytoscape");
    if (cyRef.current) {
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

  useEffect(() => {
    console.log('bind IPC events');

    window.api.onFileSaved((_: Event, filePath: string) => loadActions.updateFilePath(filePath));

    window.api.onFileOpened((_: Event, data: Object, filePath: string) => {
      console.log('onFileOpened', data, filePath);
      loadActions.loadCase(data, filePath);
    });

    window.api.onTriggerSave((event: IpcMainEvent) => {
      const response = loadActions.getSaveableData();
      console.log('onTriggerSave', event, response);
      event.sender.send('trigger-save-response', response)
    });

    window.api.onTriggerSaveCSV((event: IpcMainEvent) => {
      const response = exportActions.getCSVData();
      console.log('onTriggerSaveCSV', response);
      event.sender.send('trigger-save-csv-response', response);
    })

    window.api.onTriggerSaveScreenshot(async (event: IpcMainEvent) => {
      const imageData = await modeActions.getImageData();
      event.sender.send('trigger-save-screenshot-response', imageData)
    })

    return () => {
      console.log('remove IPC events');
      // @ts-ignore:next-line
      window.api.removeListeners();
    }
  }, [loadState])

  return (
    <CytoScapeContext.Provider value={value}>
      {children}
    </CytoScapeContext.Provider>
  );
};

export default CyProvider;
