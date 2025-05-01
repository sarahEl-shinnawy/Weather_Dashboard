'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('/bck.png');

  const fetchWeather = async () => {
    if (!city) return;

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      alert('City not found');
      return;
    }

    const data = await res.json();
    setWeather(data);
  };

  useEffect(() => {
    if (!weather) return;

    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('cloud')) {
      setBackgroundImage('/cloudy.png');
    } else if (main.includes('rain')) {
      setBackgroundImage('/rainy.png');
    } else if (main.includes('clear')) {
      setBackgroundImage('/sunny.png');
    } else {
      setBackgroundImage('/sunny.png');
    }
  }, [weather]);

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgroundImage})` }} 
    >
      <h1 className="title">🌦️ Weather Dashboard</h1>

      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="input"
        />
        <button onClick={fetchWeather} className="button">
          Get Weather
        </button>
      </div>

      {weather && (
        <div className={`weather-info ${weather.weather[0].main.toLowerCase().includes('clear') ? 'text-black' : 'text-white'}`}>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}