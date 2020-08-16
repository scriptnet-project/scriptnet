import React, { useState } from 'react';
import ScreensManager from 'Components/ScreensManager';
import 'Components/App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  return <ScreensManager screen={screen} key="screen" />;
}

export default App;
