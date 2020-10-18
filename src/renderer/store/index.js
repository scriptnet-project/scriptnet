import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import mode from './mode';
import selectedNode from './selectedNode';
import visualisation from './visualisation';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const appReducer = combineReducers({
  mode,
  selectedNode,
  visualisation,
});


const rootReducer = (state, action) => appReducer(state, action);


const persistConfig = {
  key: 'scriptnet',
  storage,
  whitelist: [
    // mode,
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const getStore = () => {
  const store = createStore(persistedReducer, undefined, applyMiddleware(logger))
  const persistor = persistStore(store);

  return { store, persistor };
};

export default getStore;
