import CytoscapeProvider from '../hooks/Cytoscape/CytoscapeProvider';
import './App.scss';
import { loadTheme, ThemeProvider } from '@fluentui/react';
import baseTheme from '../themes/base';
import Forms from './Forms/Forms';
import VisualisationScreen from './VisualisationScreen';

function App() {
  window.removeLoading();

  loadTheme(baseTheme);

  return (
    <CytoscapeProvider>
      <ThemeProvider theme={baseTheme}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <VisualisationScreen />
        </div>

        <Forms />
      </ThemeProvider>
    </CytoscapeProvider>
  );
}

export default App;
