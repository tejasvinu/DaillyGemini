import React, { useState, useEffect } from 'react';
import { WiThermometer, WiHumidity, WiSunrise, WiSunset, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { getWeatherData, getLocationData } from '../services/weatherService';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [timeData, setTimeData] = useState({
    time: '--:--',
    date: '---',
    week: 'Week --',
    progress: 0
  });
  const [prevHour, setPrevHour] = useState(null);
  const [prevMinute, setPrevMinute] = useState(null);
  const [flipHour, setFlipHour] = useState(false);
  const [flipMinute, setFlipMinute] = useState(false);

  const BAR_COUNT = 60;
  const SECONDS_IN_DAY = 86400;

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Trigger flip animation when hour or minute changes
      if (prevHour !== null && hours !== prevHour) {
        setFlipHour(true);
        setTimeout(() => setFlipHour(false), 700);
      }
      if (prevMinute !== null && minutes !== prevMinute) {
        setFlipMinute(true);
        setTimeout(() => setFlipMinute(false), 700);
      }
      setPrevHour(hours);
      setPrevMinute(minutes);

      // Calculate seconds since the start of the day, correctly handling the rollover
      const secondsSinceStartOfDay = (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
      // No need to adjust with modulo here as we want the actual progress within the day
      const progress = (secondsSinceStartOfDay / SECONDS_IN_DAY) * BAR_COUNT;

      setTimeData(prev => ({
        ...prev,
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        date: now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        week: `Week ${Math.ceil((Math.floor((now - new Date(now.getFullYear(), 0, 1)) /
          (24 * 60 * 60 * 1000)) + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7)}`,
        progress: seconds
      }));
    };

    const fetchWeatherData = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const [weather, locationData] = await Promise.all([
          getWeatherData(latitude, longitude),
          getLocationData(latitude, longitude)
        ]);

        setWeatherData(weather);
        setLocation(locationData?.results?.[0]?.components);
        console.log(weather, locationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    updateTime();
    fetchWeatherData();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const formatLocation = (location) => {
    if (!location) return 'Loading location...';
    const city = location.city || location.town || location.village;
    const state = location.state;
    const country = location.country;
    return [city, state, country].filter(Boolean).join(', ');
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return weatherCodes[code] || 'Unknown';
  };

  return (
    <div className="w-full max-w-7xl px-2 md:px-4 lg:px-6 mb-8 mx-auto">
      <div className={`w-full rounded-2xl shadow-xl relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`absolute inset-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl`} />
        <div className="relative h-full p-4 md:p-6 flex flex-col justify-between gap-4">
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <h2 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatLocation(location)}
                </h2>
                <p className="text-xs text-gray-400">
                  {location?.postcode} • {location?.suburb}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Section */}
            <div className="md:col-span-2">
              <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="flex items-end space-x-px w-full h-8">
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 transition-all duration-500 ease-in-out ${
                        i <= Math.floor(timeData.progress) ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                      style={{ height: '100%', maxHeight: '32px', opacity: i <= Math.floor(timeData.progress) ? 1 : 0.3 }}
                    />
                  ))}
                </div>
                
                {/* Time Display */}
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline">
                    <p className={`text-5xl font-bold ${flipHour ? 'animate-hour-flip' : ''} ${darkMode ? 'text-white' : 'text-black'}`}>
                      {timeData.time.split(':')[0]}
                    </p>
                    <span className={`text-4xl mx-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>:</span>
                    <p className={`text-5xl font-bold ${flipMinute ? 'animate-minute-flip' : ''} ${darkMode ? 'text-white' : 'text-black'}`}>
                      {timeData.time.split(':')[1]}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm text-gray-500 ml-4">
                    <span>{timeData.date}</span>
                    <span>{timeData.week}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Weather Section */}
            {weatherData?.current && (
              <div className="flex flex-col justify-center">
                <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  {weatherData.current.temperature_2m}°C
                </div>
                <div className="text-lg text-gray-500">
                  Feels like: {weatherData.current.apparent_temperature}°C
                </div>
                <div className="text-base text-gray-500">
                  {getWeatherDescription(weatherData.current.weather_code)}
                </div>
              </div>
            )}
          </div>

          {/* Weather Details Grid */}
          {weatherData?.daily && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-200">
              <WeatherCard
                icon={<WiThermometer className="text-3xl" />}
                label="Temperature"
                value={`${weatherData.daily.temperature_2m_max[0]}°C`}
                subValue={`Low: ${weatherData.daily.temperature_2m_min[0]}°C`}
                darkMode={darkMode}
              />
              <WeatherCard
                icon={<WiSunrise className="text-3xl" />}
                label="Sunrise"
                value={new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                darkMode={darkMode}
              />
              <WeatherCard
                icon={<WiSunset className="text-3xl" />}
                label="Sunset"
                value={new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                darkMode={darkMode}
              />
              <WeatherCard
                icon={<WiBarometer className="text-3xl" />}
                label="UV Index"
                value={weatherData.daily.uv_index_max[0]}
                subValue={`Rain: ${weatherData.current.precipitation}mm`}
                darkMode={darkMode}
              />
              <WeatherCard
                icon={<WiHumidity className="text-3xl" />}
                label="Precipitation"
                value={`${weatherData.current.precipitation}mm`}
                subValue={`Showers: ${weatherData.current.showers}mm`}
                darkMode={darkMode}
              />
              <WeatherCard
                icon={<WiStrongWind className="text-3xl" />}
                label="Timezone"
                value={weatherData.timezone_abbreviation}
                subValue={`Elevation: ${weatherData.elevation}m`}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WeatherCard = ({ icon, label, value, subValue, darkMode }) => (
  <div className={`flex flex-col items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    {icon}
    <span className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</span>
    {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
  </div>
);

export default Header;