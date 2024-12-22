import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log(token);
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    Authorization: `Bearer ${token}`.trim()
  };
};

export const notesService = {
  async getAllNotes() {
    const response = await api.get('/api/notes', {
      headers: getAuthHeaders()
    });
    console.log(response.data);
    return response.data;
  },

  async addNote(content) {
    console.log(content);
    const response = await api.post('/api/notes', 
      { content },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/api/notes/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async updateNote(id, status) {
    const response = await api.patch(
      `/api/notes/${id}`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};
