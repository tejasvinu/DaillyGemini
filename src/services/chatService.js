import api from './api';

export const chatService = {
  
  sendMessage: async (message, history, assistantType) => {
    const googleAuthToken = localStorage.getItem('googleAuthToken');
    const response = await api.post('/api/google/chat', {
      message,
      history,
      assistantType,
      googleAuthToken
    });
    return response.data;
  }
};
