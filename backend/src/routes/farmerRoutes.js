const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/FarmerController');
const { validateFarmerRegistration } = require('../middleware/validator');

/**
 * @route   POST /api/farmers/register
 * @desc    Register new farmer (basic registration)
 * @access  Public
 */
router.post('/register', validateFarmerRegistration, farmerController.registerFarmer);

/**
 * @route   POST /api/farmers/register-with-satellite
 * @desc    Register farmer with satellite boundary selection
 * @access  Public
 */
// Make sure this line has proper handler function
// router.post('/register-with-satellite', farmerController.registerFarmerWithSatellite);

/**
 * @route   GET /api/farmers/current
 * @desc    Get current/most recent farmer with farm data (for dashboard)
 * @access  Public
 */
router.get('/current', farmerController.getCurrentFarmer);

/**
 * @route   GET /api/farmers/:phone
 * @desc    Get farmer by phone number
 * @access  Public
 */
router.get('/:phone', farmerController.getFarmerByPhone);

module.exports = router;