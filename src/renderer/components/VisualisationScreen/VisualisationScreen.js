import React, { useState } from 'react';
import Screen from 'Components/Screen';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from './CommandBar';

const VisualisationScreen = () => {
  // This might become useReducer, and contain other
  // info about the vis state, like which node is selected
  const [mode, setMode] = useState('default');

  const handleSetMode = (mode) => {
    console.log(mode);
    setMode(mode);
  }

  return (
    <Screen>
      <TopCommandBar />
      <Visualisation />
      <ControlBar onSetMode={handleSetMode} mode={mode}/>
      <PanelManager mode={mode} onSetMode={handleSetMode} />
    </Screen>
  );
};

export default VisualisationScreen;
