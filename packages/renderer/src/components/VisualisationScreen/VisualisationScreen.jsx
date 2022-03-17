import React, { useCallback, useEffect } from 'react';
import Screen from '../Screen';
import ControlBar from './ControlBar';
import PanelManager from './PanelManager';
import TopCommandBar from './CommandBar';
import Visualisation from './Visualisation';
import WelcomeNotice from './WelcomeNotice';
import { useCytoscape } from '../../hooks/Cytoscape';
import { useCytoscapeActions } from '../../hooks/Cytoscape';
import MapModal from '../MapModal';

export const DEV_MODE = window.devMode;


const VisualisationScreen = () => {
  const { cy, id } = useCytoscape();
  const { handleFileOpen } = useCytoscapeActions();

  const handleAnimationComplete = useCallback(() => {
    if (!cy.current) { return; }
    cy.current.resize();
  }, [id]);

  useEffect(() => {
    // Open the sample network automatically in dev mode
    if (DEV_MODE) {
      handleFileOpen();
    }
  }, [])


  return (
    <Screen onAnimationComplete={handleAnimationComplete}>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        <MapModal />
        <Visualisation/>
        <PanelManager/>
      </div>
      <ControlBar />
      { !DEV_MODE && (
        <WelcomeNotice />
      )}
    </Screen>
  );
};

export default VisualisationScreen;
