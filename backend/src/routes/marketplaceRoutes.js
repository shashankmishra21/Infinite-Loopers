const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

/**
 * @route   GET /api/marketplace/listings
 * @desc    Get all available credits
 * @access  Public
 */
router.get('/listings', marketplaceController.getListings);

/**
 * @route   POST /api/marketplace/buy
 * @desc    Buy carbon credits
 * @access  Public
 */
router.post('/buy', marketplaceController.buyCredits);

/**
 * @route   GET /api/marketplace/stats
 * @desc    Get marketplace statistics
 * @access  Public
 */
router.get('/stats', marketplaceController.getStats);

module.exports = router;
