import React from 'react';
import Screen from 'Components/Screen';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from './CommandBar';

const VisualisationScreen = () => {
  return (
    <Screen>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        <Visualisation/>
        <PanelManager/>
      </div>
      <ControlBar />
    </Screen>
  );
};

export default VisualisationScreen;
