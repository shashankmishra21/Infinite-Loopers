const Farm = require('../models/Farm');
const CarbonCredit = require('../models/CarbonCredit');
const User = require('../models/User');
const mlService = require('../services/mlService');
const blockchainService = require('../services/blockchainService');
const { v4: uuidv4 } = require('uuid');

/**
 * Claim carbon credits and mint NFT
 * POST /api/carbon/claim
 */
exports.claimCredits = async (req, res) => {
  try {
    const { farmId } = req.body;
    
    // Get farm
    const farm = await Farm.findById(farmId).populate('farmerId', 'name phone walletAddress');
    
    if (!farm) {
      return res.status(404).json({
        success: false,
        error: 'Farm not found'
      });
    }
    
    // Check if already claimed
    if (farm.status === 'claimed') {
      return res.status(400).json({
        success: false,
        error: 'Credits already claimed for this farm'
      });
    }
    
    // Check if verified
    if (farm.status !== 'verified') {
      return res.status(400).json({
        success: false,
        error: 'Farm not verified yet. Please wait for carbon calculation.'
      });
    }
    
    // Check if carbon calculated
    if (!farm.carbonTons || farm.carbonTons <= 0) {
      return res.status(400).json({
        success: false,
        error: 'No carbon credits available'
      });
    }
    
    // Generate certificate ID
    const certificateId = `CC-${Date.now()}-${uuidv4().split('-')[0]}`;
    
    // Prepare certificate data for IPFS
    const certificateData = {
      farmerName: farm.farmerId.name,
      farmId: farm._id.toString(),
      carbonTons: farm.carbonTons,
      satelliteImages: farm.satelliteImages,
      certificateId: certificateId,
      location: farm.location,
      cropType: farm.cropType,
      acres: farm.acres,
      issuedDate: new Date().toISOString()
    };
    
    console.log('📤 Uploading certificate to IPFS...');
    
    // Upload to IPFS
    const ipfsResult = await blockchainService.uploadToIPFS(certificateData);
    
    if (!ipfsResult.success) {
      throw new Error('IPFS upload failed');
    }
    
    console.log('✅ IPFS uploaded:', ipfsResult.ipfsHash);
    console.log('🪙 Minting NFT on blockchain...');
    
    // Mint NFT on blockchain
    const farmerAddress = farm.farmerId.walletAddress || process.env.DEFAULT_WALLET_ADDRESS;
    
    const mintResult = await blockchainService.mintCertificate({
      farmerAddress: farmerAddress,
      farmId: farm._id.toString(),
      carbonTons: farm.carbonTons,
      ipfsHash: ipfsResult.ipfsHash
    });
    
    if (!mintResult.success) {
      throw new Error('NFT minting failed');
    }
    
    console.log('✅ NFT minted! Token ID:', mintResult.tokenId);
    
    // Update farm
    farm.certificateId = certificateId;
    farm.blockchainTxHash = mintResult.transactionHash;
    farm.tokenId = mintResult.tokenId;
    farm.status = 'claimed';
    farm.claimedAt = new Date();
    await farm.save();
    
    // Create carbon credit record
    const carbonCredit = await CarbonCredit.create({
      farmId: farm._id,
      farmerId: farm.farmerId._id,
      tons: farm.carbonTons,
      pricePerTon: process.env.CARBON_PRICE_PER_TON || 3200,
      status: 'available',
      tokenId: mintResult.tokenId,
      blockchainTxHash: mintResult.transactionHash,
      ipfsHash: ipfsResult.ipfsHash
    });
    
    res.json({
      success: true,
      data: {
        certificateId: certificateId,
        tokenId: mintResult.tokenId,
        transactionHash: mintResult.transactionHash,
        ipfsHash: ipfsResult.ipfsHash,
        ipfsUrl: ipfsResult.ipfsUrl,
        carbonTons: farm.carbonTons,
        earningsEstimate: farm.carbonTons * 3200,
        explorerUrl: mintResult.explorerUrl,
        openseaUrl: mintResult.openseaUrl
      },
      message: 'Carbon credits claimed successfully!'
    });
    
  } catch (error) {
    console.error('Claim Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to claim credits',
      details: error.message
    });
  }
};

/**
 * Get certificate details
 * GET /api/carbon/certificate/:certificateId
 */
exports.getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const farm = await Farm.findOne({ certificateId }).populate('farmerId', 'name phone');
    
    if (!farm) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }
    
    const credit = await CarbonCredit.findOne({ farmId: farm._id });
    
    res.json({
      success: true,
      data: {
        certificateId: farm.certificateId,
        farmerName: farm.farmerId.name,
        farmLocation: farm.location,
        carbonTons: farm.carbonTons,
        cropType: farm.cropType,
        acres: farm.acres,
        issuedDate: farm.claimedAt,
        blockchainTxHash: farm.blockchainTxHash,
        tokenId: farm.tokenId,
        status: credit ? credit.status : 'unknown',
        explorerUrl: `https://mumbai.polygonscan.com/tx/${farm.blockchainTxHash}`
      }
    });
    
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch certificate'
    });
  }
};