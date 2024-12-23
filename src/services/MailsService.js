export const mailsService = {
  async getMails() {
    const googleAuthToken = localStorage.getItem('googleAuthToken');
    if (!googleAuthToken) throw new Error('No auth token found');

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gmail/messages`, {
      headers: {
        'Authorization': `Bearer ${googleAuthToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch emails');
    return response.json();
  }
};