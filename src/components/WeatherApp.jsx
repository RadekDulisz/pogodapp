import { useState} from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY || 'demo';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
  
  const cities = [
    { name: 'Warszawa', country: 'PL' },
    { name: 'Kraków', country: 'PL' },
    { name: 'Gdańsk', country: 'PL' },
    { name: 'Wrocław', country: 'PL' },
    { name: 'Poznań', country: 'PL' },
    { name: 'Łódź', country: 'PL' }
  ];

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');

    try {
      if (!API_KEY || API_KEY === 'demo') {
        throw new Error('NO_API_KEY');
      }

      const weatherResponse = await fetch(
        `${API_BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pl`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('API_ERROR');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `${API_BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=pl`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
        setForecast(dailyForecasts);
      }
    } catch (err) {
      console.log('Using mock data for:', cityName);
      const mockData = generateMockData(cityName);
      setWeather(mockData.weather);
      setForecast(mockData.forecast);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (cityName) => {
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
        name: cityName,
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
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    fetchWeather(city.name);
  };

  const handleBackToList = () => {
    setSelectedCity(null);
    setWeather(null);
    setForecast(null);
    setError('');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getPrecipitationType = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return 'Burza';
    if (weatherCode >= 300 && weatherCode < 400) return 'Mżawka';
    if (weatherCode >= 500 && weatherCode < 600) return 'Deszcz';
    if (weatherCode >= 600 && weatherCode < 700) return 'Śnieg';
    return 'Brak opadów';
  };

  if (!selectedCity) {
    return (
      <div className="weather-app">
        <h1>Prognoza Pogody</h1>
        <p className="subtitle">Wybierz miasto, aby zobaczyć szczegółową prognozę</p>
        
        <div className="cities-grid">
          {cities.map((city, index) => (
            <div 
              key={index} 
              className="city-card"
              onClick={() => handleCityClick(city)}
            >
              <h3>{city.name}</h3>
              <p>{city.country}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app">
      <button onClick={handleBackToList} className="back-button">
        ← Powrót do listy miast
      </button>

      <h1>Prognoza Pogody</h1>

      {loading && <div className="loading">Ładowanie...</div>}
      {error && <div className="error-message">{error}</div>}

      {weather && (
        <>
          <div className="current-weather">
            <div className="weather-header">
              <h2>{weather.name}, {weather.sys.country}</h2>
              <div className="weather-icon">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            </div>
            
            <div className="temperature">
              <span className="temp-value">{Math.round(weather.main.temp)}°C</span>
              <span className="temp-description">{weather.weather[0].description}</span>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Odczuwalna:</span>
                <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wilgotność:</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ciśnienie:</span>
                <span className="detail-value">{weather.main.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wiatr:</span>
                <span className="detail-value">
                  {Math.round(weather.wind.speed * 3.6)} km/h {getWindDirection(weather.wind.deg)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Zachmurzenie:</span>
                <span className="detail-value">{weather.clouds?.all || 0}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Widoczność:</span>
                <span className="detail-value">{weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km</span>
              </div>
            </div>
          </div>

          {forecast && forecast.length > 0 && (
            <div className="forecast-container">
              <h3>Prognoza na najbliższe 5 dni</h3>
              <div className="forecast-grid">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-date">{formatDate(day.dt)}</div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="forecast-icon"
                    />
                    <div className="forecast-temp">{Math.round(day.main.temp)}°C</div>
                    <div className="forecast-description">{day.weather[0].description}</div>
                    
                    <div className="forecast-details">
                      <div className="forecast-detail">
                        <span className="detail-icon">💧</span>
                        <span>Opady: {day.pop ? (day.pop * 100).toFixed(0) : 0}%</span>
                      </div>
                      {day.rain && (
                        <div className="forecast-detail">
                          <span className="detail-icon">🌧️</span>
                          <span>{getPrecipitationType(day.weather[0].id)}: {day.rain['3h']?.toFixed(1) || 0} mm</span>
                        </div>
                      )}
                      {day.snow && (
                        <div className="forecast-detail">
                          <span className="detail-icon">❄️</span>
                          <span>Śnieg: {day.snow['3h']?.toFixed(1) || 0} mm</span>
                        </div>
                      )}
                      <div className="forecast-detail">
                        <span className="detail-icon">💨</span>
                        <span>Wiatr: {Math.round(day.wind.speed * 3.6)} km/h {getWindDirection(day.wind.deg)}</span>
                      </div>
                      <div className="forecast-detail">
                        <span className="detail-icon">☁️</span>
                        <span>Zachmurzenie: {day.clouds?.all || 0}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherApp;
