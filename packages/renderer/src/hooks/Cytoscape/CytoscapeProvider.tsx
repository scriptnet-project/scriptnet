import { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Cytoscape, { CytoscapeOptions } from 'cytoscape';
// import cytoscapeLeaflet from 'cytoscape-leaflet';
import leaflet from 'cytoscape-leaf';
import cola from 'cytoscape-cola';
import BubbleSets from 'cytoscape-bubblesets';
import edgeHandles from 'cytoscape-edgehandles';
import CytoScapeContext from './CytoscapeContext';
import useLoader from './useLoader';
import useModes from './useModes';
import useHelpers from './useHelpers';
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

const CyProvider = ({ children }) => {
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

    window.api.onTriggerSaveScreenshot((event: IpcMainEvent) => {
      event.sender.send('trigger-save-screenshot-response')
    })

    return () => {
      console.log('remove IPC events');
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
