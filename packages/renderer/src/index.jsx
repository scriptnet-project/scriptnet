import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { loadTheme } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import getStore from './store';
import './index.scss';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import App from './components/App';
import { DEV_MODE } from './components/VisualisationScreen/VisualisationScreen';

const { store, persistor } = getStore();
initializeIcons();

if (DEV_MODE) {
  window.openSampleNetwork();
}

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
), document.getElementById('root'));
