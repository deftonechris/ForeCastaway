import React, { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import Search from '@components/Search';
import WeatherCard from '@components/WeatherCard';
import ForecastCard from '@components/ForecastCard';
import RecentSearches from '@components/RecentSearches';


interface WeatherData {
  location: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  date: number;
}

interface ForecastData {
  date: number;
  icon: string;
  temp: number;
}

const Home = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    setRecentSearches(savedSearches ? JSON.parse(savedSearches) : []);
  }, []);
  
  

  const handleSearch = async (location: string) => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
  
    if (response.ok) {
      const data = await response.json();
  
      console.log(data);
  
      setWeatherData({
        location: `${data.name}, ${data.sys.country}`,
        description: data.weather[0].description,
        temperature: (data.main.temp * 9) / 5 + 32, // Convert to Fahrenheit
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        date: data.dt,
      });
  
      handleRecentSearch(`${data.name}, ${data.sys.country}`);
    } else {
      console.error(`Error fetching weather data: ${response.statusText}`);
    }
  
    // Fetch the 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );
  
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      const dailyData = forecastData.list.filter((item: any) =>
        item.dt_txt.includes('12:00:00')
      );
      setForecastData(
        dailyData.map((item: any) => ({
          date: item.dt,
          icon: item.weather[0].icon,
          temp: (item.main.temp * 9) / 5 + 32, 
        }))
      );
    } else {
      console.error(`Error fetching forecast data: ${forecastResponse.statusText}`);
    }
  };
  
  const handleRecentSearch = (location: string) => {
    const isLocationAlreadySearched = recentSearches.includes(location);
    if (!isLocationAlreadySearched) {
      const updatedSearches = [...recentSearches, location].slice(-5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };
  

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };


  return (
    <Layout weather={weatherData?.description}>
      <div className="flex">
        <RecentSearches
          searches={recentSearches}
          onSearchItemClick={handleSearch}
          onClear={clearRecentSearches}
        />
        <div className="flex flex-col w-full">
          <Search onSearch={handleSearch} />
          {weatherData && <WeatherCard data={weatherData} />}
          <div className="flex justify-center">
            {forecastData.map((data, index) => (
              <ForecastCard key={index} data={data} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
  
};

export default Home;








