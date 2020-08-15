import React, { useState } from 'react';
import Navigation from 'Components/Navigation';
import ScreensManager from 'Components/ScreensManager';
import 'Components/App.scss';

function App() {
  const [screen, setScreen] = useState('visualisation');

  const onNavigate = (screen) => {
    console.log(screen);
    setScreen(screen);
  };

  return [
    <ScreensManager screen={screen} key="screen" />,
    <Navigation onNavigate={onNavigate} key="navigation" />,
  ];
}

export default App;
