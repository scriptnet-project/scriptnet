import React, { useState } from 'react';
import Modals from 'components/Modals';
import Navigation from 'components/Navigation';
import Screens from 'components/Screens';
import './App.scss';

function App() {
  const [screen, setScreen] = useState('default');

  const onNavigate = (screen) => {
    console.log(screen);
    setScreen(screen);
  };

  return [
    <Screens screen={screen} key="screen" />,
    <Navigation onNavigate={onNavigate} key="navigation" />,
    <Modals key="modals" />,
  ];
}

export default App;
