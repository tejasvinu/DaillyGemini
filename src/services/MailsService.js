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
  },

  async getMailsSummary() {
    const cachedData = this.getCachedSummary();
    if (cachedData) return cachedData;

    const googleAuthToken = localStorage.getItem('googleAuthToken');
    if (!googleAuthToken) throw new Error('No auth token found');
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gmail/messages?summary=true`, {
      headers: {
        'Authorization': `Bearer ${googleAuthToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch summary');
    
    const data = await response.json();
    this.cacheSummary(data);
    return data;
  },

  cacheSummary(data) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresIn: 30 * 60 * 1000 // 30 minutes
    };
    localStorage.setItem('emailSummaryCache', JSON.stringify(cacheData));
  },

  getCachedSummary() {
    const cached = localStorage.getItem('emailSummaryCache');
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const now = Date.now();
    if (now - cacheData.timestamp > cacheData.expiresIn) {
      localStorage.removeItem('emailSummaryCache');
      return null;
    }

    return cacheData.data;
  }
};