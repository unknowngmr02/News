import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import NewsDisplay from './components/NewsDisplay';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ weather: null, news: [] });

  const fetchData = async (query) => {
    try {
      console.log(`🔹 Fetching data for: ${query}`);
      const response = await axios.get(`http://localhost:3001/api/data?query=${query}`);
      console.log("✅ API Response:", response.data);
      setData({ weather: response.data.weather, news: response.data.news });
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>🌦️ Weather & News App 📰</h1>
      <SearchBar onSearch={fetchData} />
      {data.weather && <WeatherDisplay weather={data.weather} />}
      {data.news.length > 0 && <NewsDisplay news={data.news} />}
    </div>
  );
}

export default App;
