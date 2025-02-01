import React from 'react';

function WeatherDisplay({ weather }) {
  return (
    <div>
      <h2>Weather in {weather.location.name}, {weather.location.region}</h2>
      <p>🌡️ Temperature: {weather.current.temp_c}°C</p>
      <p>☁️ Condition: {weather.current.condition.text}</p>
      <p>💧 Humidity: {weather.current.humidity}%</p>
      <p>🌬️ Wind: {weather.current.wind_kph} kph</p>
    </div>
  );
}

export default WeatherDisplay;
