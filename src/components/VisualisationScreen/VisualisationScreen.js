import React, { useState } from 'react';
import Screen from 'components/Screen';
import Visualisation from './Visualisation';
import PanelManager from './PanelManager';

const VisualisationScreen = () => {
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
