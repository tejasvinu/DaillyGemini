import React, { useEffect, useState } from 'react';
import { 
  WiDaySunny,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiCloudy,
  WiThermometer,
  WiHumidity,
} from 'react-icons/wi';
import { 
  FiMapPin, 
  FiClock, 
  FiCalendar 
} from 'react-icons/fi';
import { getWeatherData, getLocationData } from '../services/weatherService';

const WeatherIcon = ({ condition, size = 24, className = '' }) => {
  const icons = {
    clear: WiDaySunny,
    rain: WiRain,
    snow: WiSnow,
    thunderstorm: WiThunderstorm,
    fog: WiFog,
    cloudy: WiCloudy
  };

  const IconComponent = icons[condition] || WiDaySunny;
  return <IconComponent size={size} className={className} />;
};

const WeatherCard = ({ icon: Icon, title, value, unit = '', className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3 ${className}`}>
    <Icon className="text-white/80" size={24} />
    <div>
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-lg font-semibold text-white">{value}{unit}</p>
    </div>
  </div>
);

const DailyForecast = ({ data }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
    <div className="flex items-center space-x-2 mb-3">
      <FiCalendar size={20} className="text-white/80" />
      <h3 className="text-lg font-semibold text-white">Daily Forecast</h3>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-white/60">Temperature</p>
        <p className="text-lg font-semibold text-white">
          {data.temperature_2m_max[0]}°C / {data.temperature_2m_min[0]}°C
        </p>
      </div>
      <div>
        <p className="text-sm text-white/60">UV Index</p>
        <p className="text-lg font-semibold text-white">{data.uv_index_max[0]}</p>
      </div>
      <div>
        <p className="text-sm text-white/60">Sunrise</p>
        <p className="text-lg font-semibold text-white">
          {new Date(data.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div>
        <p className="text-sm text-white/60">Sunset</p>
        <p className="text-lg font-semibold text-white">
          {new Date(data.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

function Header({ currentTime }) {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const [weather, location] = await Promise.all([
          getWeatherData(latitude, longitude),
          getLocationData(latitude, longitude)
        ]);

        setWeatherData(weather);
        setLocation(location?.results?.[0]?.components);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLocation = (location) => {
    if (!location) return '';
    const parts = [
      location.city || location.town || location.village,
      location.state,
      location.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl shadow-xl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Location and Time */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <FiMapPin className="text-red-300" size={24} />
            <h2 className="text-xl text-white font-medium">{formatLocation(location)}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <FiClock className="text-yellow-300" size={24} />
            <p className="text-xl text-white font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Current Weather */}
        {weatherData?.current && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeatherCard 
              icon={WiThermometer}
              title="Temperature"
              value={weatherData.current.temperature_2m}
              unit="°C"
              className="md:col-span-2"
            />
            <WeatherCard 
              icon={WiHumidity}
              title="Precipitation"
              value={weatherData.current.precipitation}
              unit="mm"
            />
          </div>
        )}

        {/* Daily Forecast */}
        {weatherData?.daily && (
          <div className="mt-6">
            <DailyForecast data={weatherData.daily} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;