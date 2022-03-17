import React, { useState } from 'react';
import CytoscapeProvider from '../hooks/Cytoscape/CytoscapeProvider';
import ScreensManager from './ScreensManager';
import './App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  window.removeLoading();

  return (
    <CytoscapeProvider>
      <ScreensManager screen={screen} key="screen" />
    </CytoscapeProvider>
  );
}

export default App;
