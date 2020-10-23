import React, { useState } from 'react';
import CytoscapeProvider from 'Hooks/Cytoscape/CytoscapeProvider';
import ScreensManager from 'Components/ScreensManager';
import 'Components/App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  return (
    <CytoscapeProvider>
      <ScreensManager screen={screen} key="screen" />
    </CytoscapeProvider>
  );
}

export default App;
