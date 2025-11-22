const User = require('../models/User');
const Farm = require('../models/Farm');
const axios = require('axios');

// Basic registration
exports.registerFarmer = async (req, res) => {
  try {
    const { name, phone, state, district, village, acres, cropType, farmingPractice } = req.body;
    
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ success: false, error: 'Phone number already registered' });
    }
    
    user = await User.create({
      name,
      phone,
      address: { state, district, village },
      role: 'farmer'
    });
    
    const farm = await Farm.create({
      farmer: user._id,
      acres,
      cropType: cropType.toLowerCase(),
      farmingPractice: farmingPractice || 'conventional',
      status: 'pending'
      // Don't include satelliteImages or farmBoundary at all
    });
    
    user.farms = user.farms || [];
    user.farms.push(farm._id);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: { farmer: user, farm },
      message: 'Registration successful!'
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, error: 'Registration failed', details: error.message });
  }
};

// Satellite registration
exports.registerFarmerWithSatellite = async (req, res) => {
  try {
    const { name, phone, state, district, village, cropType, farmBoundary } = req.body;

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ name, phone, address: { state, district, village }, role: 'farmer' });
    }

    const farmData = {
      farmer: user._id,
      acres: 5.0,
      cropType: cropType.toLowerCase(),
      farmingPractice: 'conventional',
      status: 'processing'
    };

    if (farmBoundary && Array.isArray(farmBoundary) && farmBoundary.length > 0) {
      farmData.farmBoundary = { type: 'Polygon', coordinates: farmBoundary };
    }

    const farm = await Farm.create(farmData);
    user.farms = user.farms || [];
    user.farms.push(farm._id);
    await user.save();

    res.status(201).json({ success: true, data: { farmer: user, farm } });
  } catch (error) {
    console.error('Satellite registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get current farmer
exports.getCurrentFarmer = async (req, res) => {
  try {
    const user = await User.findOne({ role: 'farmer' }).sort({ createdAt: -1 }).populate('farms').limit(1);
    if (!user) return res.json({ success: true, data: { farms: [] } });
    res.json({ success: true, data: { farmer: user, farms: user.farms || [] } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch farmer data' });
  }
};

// Get farmer by phone
exports.getFarmerByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone }).populate('farms');
    if (!user) return res.status(404).json({ success: false, error: 'Farmer not found' });
    
    const farms = user.farms || [];
    const totalCarbon = farms.reduce((sum, farm) => sum + (farm.carbonTons || 0), 0);
    const totalEarnings = farms.reduce((sum, farm) => sum + (farm.earningsEstimate || 0), 0);
    
    res.json({
      success: true,
      data: {
        farmer: { id: user._id, name: user.name, phone: user.phone },
        farms,
        stats: { totalFarms: farms.length, totalCarbon: totalCarbon.toFixed(2), totalEarnings: totalEarnings.toFixed(2) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch farmer data' });
  }
};
