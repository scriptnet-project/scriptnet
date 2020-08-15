import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { loadTheme } from '@fluentui/react';
import getStore from 'Renderer/store';
import theme from './theme';
import 'Renderer/index.scss';
import App from 'Components/App';

const { store, persistor } = getStore();
loadTheme(theme);

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
), document.getElementById('app'));
