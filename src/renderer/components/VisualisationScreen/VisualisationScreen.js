import React, { useCallback, useState } from 'react';
import Screen from 'Components/Screen';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from './CommandBar';
import useCytoscape from '../../hooks/useCytoscape';

const VisualisationScreen = () => {
  const [cy] = useCytoscape();
  const [state, setState] = useState({ animationComplete: false });

  const handleAnimationComplete = useCallback(() => {
    setState({ animationComplete: true });
  }, [cy]);

  return (
    <Screen onAnimationComplete={handleAnimationComplete}>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        { state.animationComplete && <Visualisation/> }
        <PanelManager/>
      </div>
      <ControlBar />
    </Screen>
  );
};

export default VisualisationScreen;
