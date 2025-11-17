const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

class MLService {
  /**
   * Calculate carbon sequestration for a farm
   */
  async calculateCarbon(farmData) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/calculate-carbon`, {
        farm_id: farmData.farmId,
        lat: farmData.location.lat,
        lng: farmData.location.lng,
        acres: farmData.acres,
        crop_type: farmData.cropType
      });
      
      return response.data;
    } catch (error) {
      console.error('ML Service Error:', error.message);
      throw new Error('Carbon calculation failed');
    }
  }
  
  /**
   * Get satellite images for coordinates
   */
  async getSatelliteImages(lat, lng) {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/satellite-images/${lat}/${lng}`);
      return response.data;
    } catch (error) {
      console.error('ML Service Error:', error.message);
      throw new Error('Satellite image fetch failed');
    }
  }
}

module.exports = new MLService();