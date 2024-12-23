export const userInfoService = {
  async getUserInfo() {
    const googleAuthToken = localStorage.getItem('googleAuthToken');
    if (!googleAuthToken) throw new Error('No auth token found');

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/google/userinfo`, {
      headers: {
        'Authorization': `Bearer ${googleAuthToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
  }
};