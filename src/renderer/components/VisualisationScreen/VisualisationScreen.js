import React, { useCallback, useEffect } from 'react';
import { remote } from 'electron';
import Screen from 'Components/Screen';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from 'Components/VisualisationScreen/CommandBar';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import WelcomeNotice from 'Components/VisualisationScreen/WelcomeNotice';
import { useCytoscape } from 'Hooks/Cytoscape';
import { useCytoscapeActions } from 'Hooks/Cytoscape';

export const DEV_MODE = process.env.NODE_ENV === 'development';


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
      handleFileOpen(`${process.cwd()}/complex-example.json`);
    }
  }, [])


  return (
    <Screen onAnimationComplete={handleAnimationComplete}>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
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
