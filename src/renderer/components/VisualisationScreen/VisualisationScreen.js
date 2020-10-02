import React, { useState } from 'react';
import Screen from 'Components/Screen';
import Visualisation from 'Components/VisualisationScreen/Visualisation';
import ControlBar from 'Components/VisualisationScreen/ControlBar';
import PanelManager from 'Components/VisualisationScreen/PanelManager';
import TopCommandBar from './CommandBar';
import { modes } from './config';
import { useSessionStorage } from '../../hooks/useSessionStorage';

const VisualisationScreen = () => {
  // This might become useReducer, and contain other
  // info about the vis state, like which node is selected
  const [mode, setMode] = useState('default');
  const [selectedNode, setSelectedNode] = useSessionStorage('selectedNode', null);

  const handleSetMode = (mode) => {
    console.log(mode);
    setMode(mode);
  }


  return (
    <Screen>
      <TopCommandBar />
      <div style={{ flex: '1 auto', display: 'flex' }}>
        <PanelManager mode={mode} onSetMode={handleSetMode} />
        <Visualisation panelOpen={mode !== modes.DEFAULT || selectedNode}/>
      </div>
      <ControlBar onSetMode={handleSetMode} mode={mode}/>
    </Screen>
  );
};

export default VisualisationScreen;
