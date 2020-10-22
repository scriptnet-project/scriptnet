import React, { useState } from 'react';
import CyProvider from 'Hooks/useCytoscape/CyProvider';
import ScreensManager from 'Components/ScreensManager';
import 'Components/App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  return (
    <CyProvider>
      <ScreensManager screen={screen} key="screen" />
    </CyProvider>
  );
}

export default App;
