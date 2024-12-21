//components/Header.js
import React, { useEffect, useState } from 'react';
import {
  FiSun,
  FiMapPin,
  FiThermometer,
  FiDroplet,
  FiClock,
  FiCalendar,
  FiSunrise,
  FiSunset,
  FiWind,
  FiCloudRain,
} from 'react-icons/fi';
import { getWeatherData, getLocationData } from '../services/weatherService';

// Add WeatherIcon component
const WeatherIcon = ({ condition, className }) => {
  // Placeholder for now. We'll map weather conditions to icons later.
  const iconSize = '2rem';
  switch (condition) {
    case 'clear':
      return <FiSun size={iconSize} className={className} />;
    case 'rain':
      return <FiCloudRain size={iconSize} className={className} />;
    // Add more cases as needed
    default:
      return <FiSun size={iconSize} className={className} />;
  }
};

function Header({ currentTime }) {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const [weatherResponse, locationResponse] = await Promise.all([
          getWeatherData(latitude, longitude),
          getLocationData(latitude, longitude),
        ]);

        setWeatherData(weatherResponse);
        if (locationResponse?.results?.[0]) {
          setLocation(locationResponse.results[0].components);
        }
      } catch (error) {
        console.error('Error getting location or data:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after data is fetched
      }
    };

    getUserLocation();
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
      {/* Background elements for visual enhancement */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-yellow-300 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-pink-300 blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-wider">
          Personal Dashboard
        </h1>

        {loading ? (
          // Loading Indicator
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          // Main Content
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              {/* Current Time and Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className="text-yellow-400 text-3xl mr-2" />
                    <p className="text-3xl font-semibold">{currentTime.toLocaleTimeString()}</p>
                  </div>
                  {location && (
                    <div className="flex items-center">
                      <FiMapPin className="text-red-400 text-3xl mr-2" />
                      <p className="text-xl">
                        {[
                          location.city || location.town || location.village,
                          location.county,
                          location.state,
                          location.country,
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Current Weather */}
              <div className="space-y-4">
                {weatherData?.current && (
                  <div className="bg-indigo-100 bg-opacity-20 p-4 rounded-lg">
                    <div className="flex items-center justify-center">
                      <FiThermometer className="text-red-400 text-3xl mr-2" />
                      <p className="text-3xl font-semibold">
                        {weatherData.current.temperature_2m}°C
                      </p>
                      <p className="text-xl ml-4">
                        Feels like: {weatherData.current.apparent_temperature}°C
                      </p>
                    </div>
                  </div>
                )}
                {weatherData?.current && (
                  <div className="bg-indigo-100 bg-opacity-20 p-4 rounded-lg">
                    <div className="flex items-center justify-center">
                      <FiDroplet className="text-blue-400 text-3xl mr-2" />
                      <p className="text-xl">
                        Rain: {weatherData.current.rain}mm | Precipitation: {weatherData.current.precipitation}mm
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Daily Forecast */}
            {weatherData?.daily && (
              <div className="mt-10 md:mt-12 space-y-4 flex justify-center">
                <h2 className="text-2xl md:text-3xl font-semibold flex items-center justify-center">
                  <FiCalendar className="text-yellow-300 mr-2" />
                  Daily Forecast
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-opacity-50 border-gray-300">
                    <p className="text-xl md:text-2xl font-bold">Max: {weatherData.daily.temperature_2m_max[0]}°C</p>
                    <p className="text-xl">Min: {weatherData.daily.temperature_2m_min[0]}°C</p>
                    <p className="text-xl">UV Index: {weatherData.daily.uv_index_max[0]}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-opacity-50 border-gray-300">
                    <p className="text-xl">Rain Sum: {weatherData.daily.rain_sum[0]}mm</p>
                    <p className="text-xl">
                      Sunrise: {new Date(weatherData.daily.sunrise[0]).toLocaleTimeString()}
                    </p>
                    <p className="text-xl">
                      Sunset: {new Date(weatherData.daily.sunset[0]).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Header;