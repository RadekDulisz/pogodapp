import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../store/favoritesSlice';
import './CityCard.css';

const CityCard = ({ city, onClick }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(city.name));

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(city.name));
  };

  return (
    <div className="city-card" onClick={() => onClick(city)}>
      <div className="favorite-icon" onClick={handleFavoriteClick}>
        {isFavorite ? '⭐' : '☆'}
      </div>
      <h3>{city.name}</h3>
      <p>{city.country}</p>
    </div>
  );
};

export default CityCard;
