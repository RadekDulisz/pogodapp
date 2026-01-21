import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavoriteCities } from '../store/favoritesSlice';
import { toggleTemperatureUnit, selectTemperatureUnit } from '../store/settingsSlice';
import CityCard from '../components/CityCard';
import SearchForm from '../components/SearchForm';
import './CityList.css';

const CityList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteCities = useSelector(selectFavoriteCities);
  const temperatureUnit = useSelector(selectTemperatureUnit);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultCities = useMemo(() => [
    { name: 'Warszawa', country: 'PL' },
    { name: 'Kraków', country: 'PL' },
    { name: 'Gdańsk', country: 'PL' },
    { name: 'Wrocław', country: 'PL' },
    { name: 'Poznań', country: 'PL' },
    { name: 'Łódź', country: 'PL' }
  ], []);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return defaultCities;
    
    return defaultCities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [defaultCities, searchQuery]);

  const handleCityClick = useCallback((city) => {
    navigate(`/city/${encodeURIComponent(city.name)}`);
  }, [navigate]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleToggleUnit = useCallback(() => {
    dispatch(toggleTemperatureUnit());
  }, [dispatch]);

  return (
    <div className="city-list-page">
      <div className="header-container">
        <h1>Prognoza Pogody</h1>
        <button onClick={handleToggleUnit} className="unit-toggle">
          {temperatureUnit === 'celsius' ? '°C → °F' : '°F → °C'}
        </button>
      </div>
      
      <p className="subtitle">Wybierz miasto, aby zobaczyć szczegółową prognozę</p>
      
      <SearchForm onSearch={handleSearch} />

      {favoriteCities.length > 0 && (
        <div className="favorites-section">
          <h2>Ulubione miasta ⭐</h2>
          <div className="cities-grid">
            {defaultCities
              .filter(city => favoriteCities.includes(city.name))
              .map((city, index) => (
                <CityCard key={`fav-${index}`} city={city} onClick={handleCityClick} />
              ))}
          </div>
        </div>
      )}

      <div className="all-cities-section">
        <h2>{searchQuery ? 'Wyniki wyszukiwania' : 'Wszystkie miasta'}</h2>
        {filteredCities.length > 0 ? (
          <div className="cities-grid">
            {filteredCities.map((city, index) => (
              <CityCard key={index} city={city} onClick={handleCityClick} />
            ))}
          </div>
        ) : (
          <p className="no-results">Nie znaleziono miast pasujących do "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default CityList;
