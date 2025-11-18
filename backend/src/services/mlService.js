const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

class MLService {
  /**
   * Calculate carbon sequestration for a farm
   */
  async calculateCarbon(farmData) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/calculate-carbon`, {
      farmId: farmData.farmId,                    // ✅ correct field name
      latitude: farmData.location.lat,            // ✅ correct field name
      longitude: farmData.location.lng,           // ✅ correct field name
      acres: farmData.acres,
      cropType: farmData.cropType                 // ✅ correct field name
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