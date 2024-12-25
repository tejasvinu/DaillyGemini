
import api from './api';

export const cardService = {
  createFlashCards: async (topic) => {
    const response = await api.post('/api/google/cards', {
      action: 'createFlashCards',
      topic
    });
    return response.data.flashCards;
  },
  chatWithAI: async (message, context) => {
    const response = await api.post('/api/google/cards', {
      action: 'chatWithAI',
      message,
      context
    });
    return response.data.response;
  }
};