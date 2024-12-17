const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';

export const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getLocationData = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};
