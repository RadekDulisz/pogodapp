import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../store/favoritesSlice';
import { toggleTemperatureUnit, selectTemperatureUnit } from '../store/settingsSlice';
import axios from 'axios';
import WeatherDetail from '../components/WeatherDetail';
import ForecastCard from '../components/ForecastCard';
import './CityDetail.css';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(cityName));
  const temperatureUnit = useSelector(selectTemperatureUnit);
  
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY || 'demo';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const generateMockData = useCallback((city) => {
    const now = Math.floor(Date.now() / 1000);
    const temps = [12, 15, 18, 14, 16, 13];
    const baseTemp = temps[Math.floor(Math.random() * temps.length)];
    
    const weatherConditions = [
      { id: 800, description: 'bezchmurnie', icon: '01d', clouds: 5 },
      { id: 801, description: 'lekkie zachmurzenie', icon: '02d', clouds: 25 },
      { id: 802, description: 'częściowe zachmurzenie', icon: '03d', clouds: 50 },
      { id: 500, description: 'lekki deszcz', icon: '10d', clouds: 75 },
      { id: 803, description: 'zachmurzenie', icon: '04d', clouds: 85 }
    ];

    const currentCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    return {
      weather: {
        name: city,
        sys: { country: 'PL' },
        weather: [{ id: currentCondition.id, description: currentCondition.description, icon: currentCondition.icon }],
        main: {
          temp: baseTemp,
          feels_like: baseTemp - 2,
          humidity: 65 + Math.floor(Math.random() * 20),
          pressure: 1010 + Math.floor(Math.random() * 20)
        },
        wind: { 
          speed: 2 + Math.random() * 5,
          deg: Math.floor(Math.random() * 360)
        },
        clouds: { all: currentCondition.clouds },
        visibility: 10000
      },
      forecast: Array.from({ length: 5 }, (_, i) => {
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temp = baseTemp + (Math.random() * 6 - 3);
        const hasRain = condition.id >= 500 && condition.id < 600;
        
        return {
          dt: now + (i + 1) * 86400,
          weather: [{ id: condition.id, description: condition.description, icon: condition.icon }],
          main: { temp: temp },
          pop: hasRain ? 0.6 + Math.random() * 0.3 : Math.random() * 0.3,
          rain: hasRain ? { '3h': 1 + Math.random() * 4 } : undefined,
          wind: {
            speed: 2 + Math.random() * 6,
            deg: Math.floor(Math.random() * 360)
          },
          clouds: { all: condition.clouds }
        };
      })
    };
  }, []);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError('');

    try {
      if (!API_KEY || API_KEY === 'demo') {
        throw new Error('NO_API_KEY');
      }

      const weatherResponse = await axios.get(
        `${API_BASE_URL}/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
            lang: 'pl'
          }
        }
      );

      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `${API_BASE_URL}/forecast`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
            lang: 'pl'
          }
        }
      );

      const dailyForecasts = forecastResponse.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5);
      setForecast(dailyForecasts);
    } catch (err) {
      console.log('Using mock data for:', city, err.message);
      const mockData = generateMockData(city);
      setWeather(mockData.weather);
      setForecast(mockData.forecast);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, API_BASE_URL, generateMockData]);

  useEffect(() => {
    if (cityName) {
      fetchWeather(cityName);
    }
  }, [cityName, fetchWeather]);

  const handleBackToList = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(cityName));
  }, [dispatch, cityName]);

  const handleToggleUnit = useCallback(() => {
    dispatch(toggleTemperatureUnit());
  }, [dispatch]);

  const forecastGrid = useMemo(() => {
    if (!forecast || forecast.length === 0) return null;

    return (
      <div className="forecast-container">
        <h3>Prognoza na najbliższe 5 dni</h3>
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            <ForecastCard key={index} day={day} />
          ))}
        </div>
      </div>
    );
  }, [forecast]);

  return (
    <div className="city-detail-page">
      <div className="detail-header">
        <button onClick={handleBackToList} className="back-button">
          ← Powrót do listy
        </button>
        <div className="header-actions">
          <button onClick={handleToggleFavorite} className="favorite-button">
            {isFavorite ? '⭐ Usuń z ulubionych' : '☆ Dodaj do ulubionych'}
          </button>
          <button onClick={handleToggleUnit} className="unit-toggle">
            {temperatureUnit === 'celsius' ? '°C → °F' : '°F → °C'}
          </button>
        </div>
      </div>

      <h1>Prognoza Pogody - {cityName}</h1>

      {loading && <div className="loading">Ładowanie danych...</div>}
      {error && <div className="error-message">{error}</div>}

      {weather && (
        <>
          <WeatherDetail weather={weather} />
          {forecastGrid}
        </>
      )}
    </div>
  );
};

export default CityDetail;
