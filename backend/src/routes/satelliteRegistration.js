const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Farm = require('../models/Farm');
const axios = require('axios');

const turf = require('@turf/helpers');
const area = require('@turf/area');

// area calculation using Turf.js
function calculateAreaFromBoundary(coordinates) {
  if (!coordinates || !Array.isArray(coordinates) || coordinates[0].length < 3) {
    return 2.5; // Default fallback
  }

  try {
    // Create GeoJSON polygon
    const polygon = turf.polygon(coordinates);

    // Calculate area in square meters
    const areaInSquareMeters = area.default(polygon);

    // Convert to acres (1 acre = 4046.86 square meters)
    const areaInAcres = areaInSquareMeters / 4046.86;

    console.log(`📏 Area calculation:`);
    console.log(`   Square meters: ${areaInSquareMeters.toFixed(2)}`);
    console.log(`   Acres: ${areaInAcres.toFixed(2)}`);

    // Return reasonable value between 0.1-50 acres
    const finalAcres = Math.max(0.1, Math.min(50, areaInAcres));
    return parseFloat(finalAcres.toFixed(2));

  } catch (error) {
    console.error('Area calculation error:', error);
    return 2.5;
  }
}


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

    // 1. Create or find user
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

    // 2. Calculate area from boundary automatically
    const acres = calculateAreaFromBoundary(farmBoundary);
    console.log(`📏 Calculated area: ${acres} acres from map boundary`);

    // 3. Fetch satellite images (if configured)
    let satelliteImages = {};
    if (process.env.SENTINEL_CLIENT_ID) {
      try {
        console.log('Fetching satellite images for boundary:', farmBoundary);
        console.log('Date range:', dateRange);
        // TODO: Implement actual Sentinel Hub API call
      } catch (error) {
        console.error('Satellite fetch error:', error.message);
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

    // Add farmBoundary ONLY if coordinates exist
    if (farmBoundary && Array.isArray(farmBoundary) && farmBoundary.length > 0) {
      farmData.farmBoundary = {
        type: 'Polygon',
        coordinates: farmBoundary
      };
    }

    const farm = new Farm(farmData);
    await farm.save();

    console.log(`✅ Farm created: ${farm._id}`);

    // 5. Trigger ML processing
    if (process.env.ML_SERVICE_URL) {
      try {
        console.log(`🤖 Calling ML service for farm ${farm._id}...`);

        const mlResponse = await axios.post(
          `${process.env.ML_SERVICE_URL}/ml/calculate`,
          {
            farmId: farm._id.toString(),
            acres: farm.acres,
            cropType: farm.cropType
          },
          { timeout: 30000 }
        );

        if (mlResponse.data.success) {
          console.log(`✅ ML calculation successful`);

          farm.ndviHistory = mlResponse.data.ndviHistory;
          farm.carbonTons = mlResponse.data.carbonTons;
          farm.earningsEstimate = mlResponse.data.earningsEstimate;
          farm.status = 'completed';
          await farm.save();

          console.log(`✅ Farm updated with ML results`);
        }
      } catch (mlError) {
        console.error('❌ ML processing error:', mlError.message);
        farm.status = 'failed';
        await farm.save();
      }
    }

    // 6. Link farm to user
    user.farms = user.farms || [];
    user.farms.push(farm._id);
    await user.save();

    res.status(201).json({
      success: true,
      data: { farmer: user, farm },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Satellite registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
});

module.exports = router;