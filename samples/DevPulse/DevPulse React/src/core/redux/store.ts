import { configureStore } from '@reduxjs/toolkit';
import { RootState } from './store-types';
import storiesReducer from '../../hnStory/slice';

export const store = configureStore<RootState>({
	reducer: {
		stories: storiesReducer
	}
});

export type AppDispatch = typeof store.dispatch;