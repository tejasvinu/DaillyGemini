import React, { useEffect, useState } from 'react';
import { FiSun, FiMapPin, FiThermometer, FiDroplet, FiClock, FiCalendar } from 'react-icons/fi';
import { getWeatherData, getLocationData } from '../services/weatherService';

function Header({ currentTime }) {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });

            // Fetch weather data
            const data = await getWeatherData(latitude, longitude);
            setWeatherData(data);

            // Fetch location data
            const locationData = await getLocationData(latitude, longitude);
            if (locationData?.results?.[0]) {
              setLocation(locationData.results[0].components);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    getUserLocation();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 shadow-lg mb-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Personal Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Weather */}
        <div className="space-y-4">
          <div className="flex items-center">
            <FiClock className="text-yellow-300 text-2xl mr-2" />
            <p className="text-2xl font-semibold">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          {weatherData?.current && (
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <FiThermometer className="text-red-300 text-2xl mr-2" />
                <p className="text-2xl font-semibold">
                  {weatherData.current.temperature_2m}°C
                </p>
              </div>
              <p className="text-lg">
                Feels like: {weatherData.current.apparent_temperature}°C
              </p>
            </div>
          )}

          {weatherData?.current && (
            <div className="flex items-center">
              <FiDroplet className="text-blue-300 text-2xl mr-2" />
              <p className="text-lg">
                Rain: {weatherData.current.rain}mm | Precipitation: {weatherData.current.precipitation}mm
              </p>
            </div>
          )}

          {location && (
            <div className="flex items-center">
              <FiMapPin className="text-red-300 text-2xl mr-2" />
              <p className="text-lg">
                {[
                  location.city || location.town || location.village,
                  location.county,
                  location.state,
                  location.country
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Daily Forecast */}
        {weatherData?.daily && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <FiCalendar className="text-yellow-300 mr-2" />
              Daily Forecast
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg">Max: {weatherData.daily.temperature_2m_max[0]}°C</p>
                <p className="text-lg">Min: {weatherData.daily.temperature_2m_min[0]}°C</p>
                <p className="text-lg">UV Index: {weatherData.daily.uv_index_max[0]}</p>
              </div>
              <div>
                <p className="text-lg">Rain Sum: {weatherData.daily.rain_sum[0]}mm</p>
                <p className="text-lg">Sunrise: {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString()}</p>
                <p className="text-lg">Sunset: {new Date(weatherData.daily.sunset[0]).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
