import React, { useState } from 'react';
import Screen from 'components/Screen';
import Visualisation from 'components/VisualisationScreen/Visualisation';
import PanelManager from 'components/VisualisationScreen/PanelManager';

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
      <PanelManager mode={mode} onSetMode={handleSetMode} />
    </Screen>
  );
};

export default VisualisationScreen;
