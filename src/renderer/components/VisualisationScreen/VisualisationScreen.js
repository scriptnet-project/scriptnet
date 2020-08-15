import React, { useState } from 'react';
import Screen from 'Components/Screen';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';

const VisualisationScreen = () => {
  // This might become useReducer, and contain othher
  // info about the vis state, like which node is selected
  const [mode, setMode] = useState('default');

  const handleSetMode = (mode) => {
    console.log(mode);
    setMode(mode);
  }

  return (
    <Screen>
      <Visualisation />
      <ControlBar onSetMode={handleSetMode} />
      <PanelManager mode={mode} />
    </Screen>
  );
};

export default VisualisationScreen;
