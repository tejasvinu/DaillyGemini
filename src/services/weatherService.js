const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const OPENCAGE_API_KEY = '749016ffaaa14dc29f55569ea4cd70f1'; // Replace with your API key
const OPENCAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code&hourly=temperature_2m,apparent_temperature,rain&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum&timezone=auto`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getLocationData = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${OPENCAGE_API_URL}?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=en`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};
