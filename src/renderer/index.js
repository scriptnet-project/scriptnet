import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import getStore from './store';
import './index.scss';
// import App from 'components/App';

const { store, persistor } = getStore();
  //   <PersistGate loading={null} persistor={persistor}>
  //     <App />
  //   </PersistGate>
ReactDOM.render((
  <Provider store={store}>
    <div>hello world</div>
  </Provider>
), document.getElementById('app'));
