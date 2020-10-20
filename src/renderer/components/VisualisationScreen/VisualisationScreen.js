import React, { useCallback } from 'react';
import Screen from 'Components/Screen';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from 'Components/VisualisationScreen/CommandBar';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import WelcomeNotice from 'Components/VisualisationScreen/WelcomeNotice';
import useCytoscape from 'Hooks/useCytoscape';

const VisualisationScreen = () => {
  const [cy] = useCytoscape();

  const handleAnimationComplete = useCallback(() => {
    cy.resize();
  }, [cy]);

  return (
    <Screen onAnimationComplete={handleAnimationComplete}>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        <WelcomeNotice />
        <Visualisation/>
        <PanelManager/>
      </div>
      <ControlBar />
    </Screen>
  );
};

export default VisualisationScreen;
