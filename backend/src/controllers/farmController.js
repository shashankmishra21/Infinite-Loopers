const Farm = require('../models/Farm');
const User = require('../models/User');
const mlService = require('../services/mlService');

/**
 * Get farm by ID
 * GET /api/farms/:farmId
 */
exports.getFarmById = async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const farm = await Farm.findById(farmId).populate('farmerId', 'name phone');
    
    if (!farm) {
      return res.status(404).json({
        success: false,
        error: 'Farm not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        farmId: farm._id,
        farmerName: farm.farmerId.name,
        location: farm.location,
        region: farm.region,
        acres: farm.acres,
        cropType: farm.cropType,
        farmingPractice: farm.farmingPractice,
        carbonTons: farm.carbonTons,
        ndviHistory: farm.ndviHistory,
        satelliteImages: farm.satelliteImages,
        status: farm.status,
        certificateId: farm.certificateId,
        blockchainTxHash: farm.blockchainTxHash,
        tokenId: farm.tokenId,
        createdAt: farm.createdAt
      }
    });
    
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm data'
    });
  }
};

/**
 * Trigger carbon calculation
 * POST /api/farms/:farmId/calculate
 */
exports.calculateFarmCarbon = async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        error: 'Farm not found'
      });
    }
    
    // Call ML service
    const carbonResponse = await mlService.calculateCarbon({
  farmId: farm._id.toString(),
  location: farm.location,
  acres: farm.acres,
  cropType: farm.cropType
});

// Destructure `data` property from response
const carbonData = carbonResponse.data;

farm.carbonTons = carbonData.carbonTons;
farm.region = carbonData.region;
farm.satelliteImages = carbonData.satelliteImages;
farm.ndviHistory = [
  { month: 'January', ndvi: carbonData.ndvi.baseline, date: new Date() },
  { month: 'June', ndvi: carbonData.ndvi.current, date: new Date() }
];
farm.status = 'verified';
farm.earningsEstimate = carbonData.earningsEstimate;
farm.verifiedAt = new Date();

await farm.save();

    res.json({
      success: true,
      data: {
        farmId: farm._id,
        carbonTons: farm.carbonTons,
        earningsEstimate: carbonData.earnings_estimate,
        ndviBaseline: carbonData.ndvi_baseline,
        ndviCurrent: carbonData.ndvi_current,
        confidence: carbonData.confidence,
        status: farm.status
      },
      message: 'Carbon calculation completed!'
    });
    
  } catch (error) {
    console.error('Calculation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Carbon calculation failed',
      details: error.message
    });
  }
};
