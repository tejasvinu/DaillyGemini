import api from './services/api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials, {
      skipAuthRedirect: true
    });
    const { token } = response.data;
    if (token) {
      const cleanToken = token.trim();
      localStorage.setItem('token', cleanToken);
      return { ...response.data, token: cleanToken };
    }
    throw new Error('No token received');
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data;
  } else if (error.request) {
    // Request made but no response
    return { message: 'No response from server. Please try again.' };
  } else {
    // Request setup error
    return { message: 'Request failed. Please try again.' };
  }
};
