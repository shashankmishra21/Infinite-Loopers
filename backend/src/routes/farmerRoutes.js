const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/FarmerController');
const { validateFarmerRegistration } = require('../middleware/validator');

/**
 * @route   POST /api/farmers/register
 * @desc    Register new farmer
 * @access  Public
 */
router.post('/register', validateFarmerRegistration, farmerController.registerFarmer);

/**
 * @route   GET /api/farmers/:phone
 * @desc    Get farmer by phone number
 * @access  Public
 */
router.get('/:phone', farmerController.getFarmerByPhone);

module.exports = router;