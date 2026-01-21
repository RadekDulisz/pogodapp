import { useSelector } from 'react-redux';
import { selectTemperatureUnit } from '../store/settingsSlice';
import './WeatherDetail.css';

const WeatherDetail = ({ weather }) => {
  const temperatureUnit = useSelector(selectTemperatureUnit);

  const convertTemperature = (tempCelsius) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((tempCelsius * 9/5) + 32);
    }
    return Math.round(tempCelsius);
  };

  const getUnitSymbol = () => {
    return temperatureUnit === 'celsius' ? '°C' : '°F';
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
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
        <span className="temp-value">{convertTemperature(weather.main.temp)}{getUnitSymbol()}</span>
        <span className="temp-description">{weather.weather[0].description}</span>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Odczuwalna:</span>
          <span className="detail-value">{convertTemperature(weather.main.feels_like)}{getUnitSymbol()}</span>
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
  );
};

export default WeatherDetail;
