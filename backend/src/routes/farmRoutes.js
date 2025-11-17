const express = require('express');
const router = express.Router();
const farmController = require('../controllers/FarmController');

/**
 * @route   GET /api/farms/:farmId
 * @desc    Get farm details
 * @access  Public
 */
router.get('/:farmId', farmController.getFarmById);

/**
 * @route   POST /api/farms/:farmId/calculate
 * @desc    Trigger carbon calculation
 * @access  Public
 */
router.post('/:farmId/calculate', farmController.calculateFarmCarbon);

module.exports = router;