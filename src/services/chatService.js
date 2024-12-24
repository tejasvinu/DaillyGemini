import api from './api';

export const chatService = {
  sendMessage: async (message, history, assistantType) => {
    const response = await api.post('/api/google/chat', {
      message,
      history,
      assistantType
    });
    return response.data;
  }
};
