import { useCallback } from 'react';
import ControlBar from './ControlBar';
import PanelManager from './PanelManager';
import TopCommandBar from './CommandBar';
import Visualisation from './Visualisation';
import WelcomeNotice from './WelcomeNotice';
import { useCytoscape } from '../../hooks/Cytoscape';

const VisualisationScreen = () => {
  const { cy, id } = useCytoscape();

  const handleAnimationComplete = useCallback(() => {
    if (!cy.current) { return; }
    cy.current.resize();
  }, [id]);


  return (
    <>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        <Visualisation />
        <PanelManager />
      </div>
      <ControlBar />
      {!window.devMode && (
        <WelcomeNotice />
      )}
    </>
  );
};

export default VisualisationScreen;
