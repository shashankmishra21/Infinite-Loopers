const User = require('../models/User');
const Farm = require('../models/Farm');

/**
 * Register new farmer
 * POST /api/farmers/register
 */
exports.registerFarmer = async (req, res) => {
  try {
    const { name, phone, lat, lng, acres, cropType, farmingPractice } = req.body;
    
    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      phone,
      role: 'farmer'
    });
    
    // Create farm
    const farm = await Farm.create({
      farmerId: user._id,
      location: { lat, lng },
      acres,
      cropType,
      farmingPractice: farmingPractice || 'conventional',
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: {
        farmerId: user._id,
        farmId: farm._id,
        farmerName: user.name
      },
      message: 'Registration successful!'
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
};

/**
 * Get farmer by phone
 * GET /api/farmers/:phone
 */
exports.getFarmerByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found'
      });
    }
    
    // Get all farms for this farmer
    const farms = await Farm.find({ farmerId: user._id });
    
    // Calculate total carbon
    const totalCarbon = farms.reduce((sum, farm) => sum + farm.carbonTons, 0);
    
    res.json({
      success: true,
      data: {
        farmer: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          walletAddress: user.walletAddress
        },
        farms: farms,
        stats: {
          totalFarms: farms.length,
          totalCarbon: totalCarbon.toFixed(2),
          totalEarnings: (totalCarbon * 3200).toFixed(2)
        }
      }
    });
    
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farmer data'
    });
  }
};