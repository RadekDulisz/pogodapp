import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  try {
    const savedUnit = localStorage.getItem('temperatureUnit');
    return savedUnit || 'celsius';
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return 'celsius';
  }
};

const initialState = {
  temperatureUnit: loadFromLocalStorage(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      try {
        localStorage.setItem('temperatureUnit', state.temperatureUnit);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      try {
        localStorage.setItem('temperatureUnit', state.temperatureUnit);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
  },
});

export const { toggleTemperatureUnit, setTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectTemperatureUnit = (state) => state.settings.temperatureUnit;
