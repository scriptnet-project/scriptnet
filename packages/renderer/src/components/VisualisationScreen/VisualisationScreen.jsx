import { useCallback } from 'react';
import Screen from '../Screen';
import ControlBar from './ControlBar';
import PanelManager from './PanelManager';
import TopCommandBar from './CommandBar';
import Visualisation from './Visualisation';
import WelcomeNotice from './WelcomeNotice';
import { useCytoscape } from '../../hooks/Cytoscape';

export const DEV_MODE = window.devMode;


const VisualisationScreen = () => {
  const { cy, id } = useCytoscape();

  const handleAnimationComplete = useCallback(() => {
    if (!cy.current) { return; }
    cy.current.resize();
  }, [id]);


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
