const axios = require('axios');

class SentinelService {
  constructor() {
    this.clientId = process.env.SENTINEL_CLIENT_ID;
    this.clientSecret = process.env.SENTINEL_CLIENT_SECRET;
    this.tokenUrl = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
    this.apiUrl = 'https://sh.dataspace.copernicus.eu/api/v1/process';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      return this.accessToken;
    } catch (error) {
      throw new Error('Failed to get Sentinel Hub token: ' + error.message);
    }
  }

  async fetchImages(boundary, dateRange) {
    try {
      const token = await this.getAccessToken();
      
      // For demo, return placeholder paths
      return {
        january: '/static/satellite-images/jan-2025.png',
        june: '/static/satellite-images/jun-2025.png'
      };
    } catch (error) {
      throw new Error('Failed to fetch satellite images: ' + error.message);
    }
  }
}

module.exports = new SentinelService();