const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/CarbonController');

/**
 * @route   POST /api/carbon/claim
 * @desc    Claim carbon credits and mint NFT
 * @access  Public
 */
router.post('/claim', carbonController.claimCredits);

/**
 * @route   GET /api/carbon/certificate/:certificateId
 * @desc    Get certificate details
 * @access  Public
 */
router.get('/certificate/:certificateId', carbonController.getCertificate);

module.exports = router;
