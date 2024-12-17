import React, { useEffect, useState } from 'react';
import { FiSun, FiMapPin } from 'react-icons/fi';
import { getWeatherData, getLocationData } from '../services/weatherService';

function Header({ currentTime }) {
  const [temperature, setTemperature] = useState(null);
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
            const weatherData = await getWeatherData(latitude, longitude);
            if (weatherData?.hourly) {
              const currentHourIndex = new Date().getHours();
              setTemperature(weatherData.hourly.temperature_2m[currentHourIndex]);
            }

            // Fetch location data
            const locationData = await getLocationData(latitude, longitude);
            if (locationData?.results?.[0]) {
              setLocation(locationData.results[0]);
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
      <h1 className="text-3xl font-bold">Personal Dashboard</h1>
      <div className="flex items-center mt-2 space-x-4">
        <div className="flex items-center">
          <FiSun className="text-yellow-300 text-xl mr-2" />
          <p className="text-xl">{currentTime.toLocaleTimeString()}</p>
        </div>
        {temperature !== null && (
          <div className="flex items-center">
            <FiSun className="text-yellow-300 text-xl mr-2" />
            <p className="text-xl">{temperature}°C</p>
          </div>
        )}
        {location && (
          <div className="flex items-center">
            <FiMapPin className="text-red-300 text-xl mr-2" />
            <p className="text-xl">{location.city || location.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
