import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  try {
    const savedFavorites = localStorage.getItem('favoriteCities');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const initialState = {
  favoriteCities: loadFromLocalStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const cityName = action.payload;
      const index = state.favoriteCities.indexOf(cityName);
      
      if (index > -1) {
        state.favoriteCities.splice(index, 1);
      } else {
        state.favoriteCities.push(cityName);
      }
      
      try {
        localStorage.setItem('favoriteCities', JSON.stringify(state.favoriteCities));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    },
    clearFavorites: (state) => {
      state.favoriteCities = [];
      try {
        localStorage.setItem('favoriteCities', JSON.stringify([]));
      } catch (error) {
        console.error('Error clearing favorites in localStorage:', error);
      }
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavoriteCities = (state) => state.favorites.favoriteCities;
export const selectIsFavorite = (cityName) => (state) => 
  state.favorites.favoriteCities.includes(cityName);
