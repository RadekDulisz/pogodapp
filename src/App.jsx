import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityList from './pages/CityList';
import CityDetail from './pages/CityDetail';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CityList />} />
          <Route path="/city/:cityName" element={<CityDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
