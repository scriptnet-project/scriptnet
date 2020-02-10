import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const rootReducer = (store, action) => ({ });

const persistConfig = {
  key: 'scriptnet',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const getStore = () => {
  const store = createStore(persistedReducer)
  const persistor = persistStore(store);

  return { store, persistor };
};

export default getStore;
