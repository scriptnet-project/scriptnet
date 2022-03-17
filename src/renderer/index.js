import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { loadTheme } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import getStore from 'Renderer/store';
import theme from './theme';
import './index.scss';
import "leaflet/dist/leaflet.css";
import App from 'Components/App';



const { store, persistor } = getStore();
loadTheme(theme);
initializeIcons();

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
), document.getElementById('app'));
