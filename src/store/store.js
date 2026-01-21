import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    favorites: favoritesReducer,
  },
});
