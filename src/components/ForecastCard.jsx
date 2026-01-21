import { useSelector } from 'react-redux';
import { selectTemperatureUnit } from '../store/settingsSlice';
import './ForecastCard.css';

const ForecastCard = ({ day }) => {
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

  return (
    <div className="forecast-card">
      <div className="forecast-date">{formatDate(day.dt)}</div>
      <img 
        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
        alt={day.weather[0].description}
        className="forecast-icon"
      />
      <div className="forecast-temp">{convertTemperature(day.main.temp)}{getUnitSymbol()}</div>
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
  );
};

export default ForecastCard;
