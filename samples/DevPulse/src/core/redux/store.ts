import { combineReducers, configureStore } from '@reduxjs/toolkit';
import inputSlice from '../../hnStory/inputSlice';
import outputSlice from '../../hnStory/outputSlice';
import storage from 'redux-persist/es/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage: storage,
	blacklist: ['output', 'input']
}

const reducer = combineReducers({
	input: inputSlice, //the input reducer
	output: outputSlice //the output reducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
	devTools: true
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>; //root state for reuse in other parts of the app
export type AppDispatch = typeof store.dispatch;