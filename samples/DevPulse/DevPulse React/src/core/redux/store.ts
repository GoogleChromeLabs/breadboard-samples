import { combineReducers, configureStore } from '@reduxjs/toolkit';
import inputReducer from '../../hnStory/inputSlice';
import outputReducer from '../../hnStory/outputSlice';
import storage from 'redux-persist/es/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage: storage,
	whitelist: ['input'] //only auth needs to be persisted
}

const reducer = combineReducers({
	inputReducer,
	outputReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: true
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>; //root state for reuse in other parts of the app
export type AppDispatch = typeof store.dispatch;