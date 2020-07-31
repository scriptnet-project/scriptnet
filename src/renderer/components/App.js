import React, { useState } from 'react';
import Modals from 'components/Modals';
import Navigation from 'components/Navigation';
import ScreensManager from 'components/ScreensManager';
import './App.scss';

function App() {
  const [screen, setScreen] = useState('visualisation');

  const onNavigate = (screen) => {
    console.log(screen);
    setScreen(screen);
  };

  return [
    <ScreensManager screen={screen} key="screen" />,
    <Navigation onNavigate={onNavigate} key="navigation" />,
    <Modals key="modals" />,
  ];
}

export default App;
