export const calendarService = {
  async getEvents() {
    const googleAuthToken = localStorage.getItem('googleAuthToken');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calendar/events`, {
      headers: {
        'Authorization': `Bearer ${googleAuthToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async getAuthUrl() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`);
    if (!response.ok) throw new Error('Failed to get auth URL');
    return response.json();
  },

  async handleCallback(code) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/googlecallback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    if (!response.ok) throw new Error('Auth callback failed');
    const data = await response.json();
    console.log(data);
    localStorage.setItem('googleAuthToken', data.token);
    return data;
  }
};
