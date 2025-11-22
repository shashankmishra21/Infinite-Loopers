const express = require('express');
const router = express.Router();
const User = require('../models/User'); // FIXED: Changed from Farmer to User
const Farm = require('../models/Farm');
const axios = require('axios');

// POST /api/farmers/register-with-satellite
router.post('/register-with-satellite', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      state, 
      district, 
      village, 
      cropType, 
      farmBoundary, 
      dateRange 
    } = req.body;

    // 1. Create or find user (farmer)
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ 
        name, 
        phone, 
        address: { state, district, village },
        role: 'farmer'
      });
      await user.save();
    }

    // 2. Calculate area from boundary
    const acres = calculateAreaFromBoundary(farmBoundary);

    // 3. Fetch satellite images (if configured)
    let satelliteImages = {};
    if (process.env.SENTINEL_CLIENT_ID) {
      try {
        satelliteImages = await fetchSatelliteImages(farmBoundary, dateRange);
      } catch (error) {
        console.error('Satellite fetch error:', error.message);
        // Continue without satellite images
      }
    }

    // 4. Create farm with proper farmBoundary format
    const farmData = {
      farmer: user._id,
      acres,
      cropType: cropType.toLowerCase(),
      farmingPractice: 'conventional',
      satelliteImages,
      status: 'processing'
    };

    // Add farmBoundary ONLY if coordinates are provided and valid
    if (farmBoundary && Array.isArray(farmBoundary) && farmBoundary.length > 0) {
      farmData.farmBoundary = {
        type: 'Polygon',
        coordinates: farmBoundary // Expected format: [[[lng, lat], [lng, lat], ...]]
      };
    }

    const farm = new Farm(farmData);
    await farm.save();

    // 5. Trigger ML processing (if ML service and images available)
    if (process.env.ML_SERVICE_URL && satelliteImages.january && satelliteImages.june) {
      try {
        const mlServiceUrl = process.env.ML_SERVICE_URL;
        const mlResponse = await axios.post(`${mlServiceUrl}/ml/calculate`, {
          farmId: farm._id.toString(),
          januaryImage: satelliteImages.january,
          juneImage: satelliteImages.june,
          acres: farm.acres,
          cropType: farm.cropType
        }, {
          timeout: 30000 // 30 second timeout
        });

        // Update farm with ML results
        farm.ndviHistory = mlResponse.data.ndviHistory || [];
        farm.carbonTons = mlResponse.data.carbonTons || 0;
        farm.earningsEstimate = mlResponse.data.earningsEstimate || 0;
        farm.status = 'completed';
        await farm.save();

        res.json({ 
          success: true, 
          data: { 
            farmer: user, 
            farm,
            mlResults: mlResponse.data
          },
          message: 'Registration and processing completed successfully'
        });
      } catch (mlError) {
        console.error('ML processing error:', mlError.message);
        farm.status = 'failed';
        await farm.save();

        res.json({
          success: true,
          data: { 
            farmer: user, 
            farm
          },
          message: 'Registration successful, but ML processing failed',
          warning: mlError.message
        });
      }
    } else {
      // No ML processing - return success
      res.json({ 
        success: true, 
        data: { 
          farmer: user, 
          farm
        },
        message: 'Registration successful (ML processing skipped - service not configured)'
      });
    }

  } catch (error) {
    console.error('Satellite registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed',
      details: error.message 
    });
  }
});

// Helper: Fetch satellite images from Sentinel Hub API
async function fetchSatelliteImages(boundary, dateRange) {
  try {
    const sentinelClientId = process.env.SENTINEL_CLIENT_ID;
    const sentinelClientSecret = process.env.SENTINEL_CLIENT_SECRET;
    
    if (!sentinelClientId || !sentinelClientSecret) {
      throw new Error('Sentinel Hub credentials not configured');
    }

    // TODO: Implement actual Sentinel Hub API call
    // For now, return placeholder paths
    console.log('Fetching satellite images for boundary:', boundary);
    console.log('Date range:', dateRange);

    // Placeholder - replace with actual API implementation
    return {
      january: '/static/satellite-images/placeholder-jan.png',
      june: '/static/satellite-images/placeholder-jun.png'
    };

    /* ACTUAL IMPLEMENTATION (uncomment when ready):
    const sentinelService = require('../services/sentinelService');
    return await sentinelService.fetchImages(boundary, {
      januaryStart: '2025-01-01',
      januaryEnd: '2025-01-31',
      juneStart: '2025-06-01',
      juneEnd: '2025-06-30'
    });
    */
  } catch (error) {
    throw new Error('Failed to fetch satellite images: ' + error.message);
  }
}

// Helper: Calculate area from polygon boundary (in acres)
function calculateAreaFromBoundary(coordinates) {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
    return 5.0; // Default fallback
  }

  // TODO: Use turf.js for accurate calculation
  // npm install @turf/area
  /*
  const turf = require('@turf/area');
  const polygon = turf.polygon(coordinates);
  const areaInSquareMeters = turf.area(polygon);
  const areaInAcres = areaInSquareMeters / 4046.86; // Convert to acres
  return parseFloat(areaInAcres.toFixed(2));
  */

  // Placeholder calculation
  return 5.0;
}

module.exports = router;