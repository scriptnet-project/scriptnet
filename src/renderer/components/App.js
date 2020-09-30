import React, { useState } from 'react';
import CyLoader from 'Components/CyLoader';
import ScreensManager from 'Components/ScreensManager';
import 'Components/App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  return (
    <CyLoader>
      <ScreensManager screen={screen} key="screen" />
    </CyLoader>
  );
}

export default App;
