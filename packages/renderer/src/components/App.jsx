import React, { useState } from 'react';
import CytoscapeProvider from '../hooks/Cytoscape/CytoscapeProvider';
import ScreensManager from './ScreensManager';
import './App.scss';
import { loadTheme, ThemeProvider } from '@fluentui/react';
import baseTheme from '../themes/base';

function App() {
  const [screen, setScreen] = useState('default');

  window.removeLoading();

  loadTheme(baseTheme);

  return (
    <CytoscapeProvider>
      <ThemeProvider theme={baseTheme}>
        <ScreensManager screen={screen} key="screen" />
      </ThemeProvider>
    </CytoscapeProvider>
  );
}

export default App;
