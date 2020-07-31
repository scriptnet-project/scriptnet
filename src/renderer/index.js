import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import getStore from 'Renderer/store';
import 'Renderer/index.scss';
import App from 'Components/App';

const { store, persistor } = getStore();
  //   <PersistGate loading={null} persistor={persistor}>

  //   </PersistGate>
ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
