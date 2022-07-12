import React, { useState } from 'react';
import CytoscapeProvider from '../hooks/Cytoscape/CytoscapeProvider';
import ScreensManager from './ScreensManager';
import './App.scss';
import { loadTheme, ThemeProvider } from '@fluentui/react';
import baseTheme from '../themes/base';
import Forms from './Forms/Forms';

function App() {
  const [screen, setScreen] = useState('default');

  window.removeLoading();

  loadTheme(baseTheme);

  return (
    <CytoscapeProvider>
      <ThemeProvider theme={baseTheme}>
        <ScreensManager screen={screen} key="screen" />
        <Forms />
      </ThemeProvider>
    </CytoscapeProvider>
  );
}

export default App;
