const CarbonCredit = require('../models/CarbonCredit');
const Transaction = require('../models/Transaction');
const Farm = require('../models/Farm');
const User = require('../models/User');

/**
 * Get all available carbon credits
 * GET /api/marketplace/listings
 */
exports.getListings = async (req, res) => {
  try {
    const { status, minPrice, maxPrice, region } = req.query;
    
    // Build query
    let query = { status: status || 'available' };
    
    if (minPrice || maxPrice) {
      query.pricePerTon = {};
      if (minPrice) query.pricePerTon.$gte = Number(minPrice);
      if (maxPrice) query.pricePerTon.$lte = Number(maxPrice);
    }
    
    // Get credits with farm and farmer details
    const credits = await CarbonCredit.find(query)
      .populate({
        path: 'farmId',
        select: 'location region cropType satelliteImages'
      })
      .populate({
        path: 'farmerId',
        select: 'name'
      })
      .sort({ listedAt: -1 }); // Latest first
    
    // Filter by region if specified
    let filteredCredits = credits;
    if (region) {
      filteredCredits = credits.filter(c => 
        c.farmId && c.farmId.region === region
      );
    }
    
    // Format response
    const listings = filteredCredits.map(credit => ({
      id: credit._id,
      farmLocation: credit.farmId.region || 'India',
      carbonTons: credit.tons,
      pricePerTon: credit.pricePerTon,
      totalValue: credit.totalValue,
      farmerName: credit.farmerId.name,
      cropType: credit.farmId.cropType,
      isVerified: true, // Blockchain verified
      tokenId: credit.tokenId,
      satelliteImages: credit.farmId.satelliteImages,
      listedAt: credit.listedAt
    }));
    
    res.json({
      success: true,
      count: listings.length,
      data: listings
    });
    
  } catch (error) {
    console.error('Listings fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings'
    });
  }
};

/**
 * Buy carbon credits
 * POST /api/marketplace/buy
 */
exports.buyCredits = async (req, res) => {
  try {
    const { creditId, buyerName, buyerEmail, buyerPhone } = req.body;
    
    // Get credit
    const credit = await CarbonCredit.findById(creditId)
      .populate('farmerId')
      .populate('farmId');
    
    if (!credit) {
      return res.status(404).json({
        success: false,
        error: 'Credit not found'
      });
    }
    
    // Check if available
    if (credit.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: 'Credit already sold'
      });
    }
    
    // Create or find buyer user
    let buyer = await User.findOne({ phone: buyerPhone });
    
    if (!buyer) {
      buyer = await User.create({
        name: buyerName,
        phone: buyerPhone,
        role: 'corporate'
      });
    }
    
    // Calculate amounts
    const totalAmount = credit.totalValue;
    const platformCommission = process.env.PLATFORM_COMMISSION || 0.10;
    const platformFee = totalAmount * platformCommission;
    const sellerReceives = totalAmount - platformFee;
    
    // Create transaction
    const transaction = await Transaction.create({
      creditId: credit._id,
      sellerId: credit.farmerId._id,
      buyerId: buyer._id,
      amount: totalAmount,
      platformFee: platformFee,
      sellerReceives: sellerReceives,
      paymentStatus: 'pending'
    });
    
    // Update credit status
    credit.status = 'sold';
    credit.buyerId = buyer._id;
    credit.soldAt = new Date();
    await credit.save();
    
    // Note: In production, integrate payment gateway here (Razorpay/Stripe)
    // For hackathon, simulate successful payment
    transaction.paymentStatus = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();
    
    res.json({
      success: true,
      data: {
        transactionId: transaction._id,
        creditId: credit._id,
        carbonTons: credit.tons,
        amountPaid: totalAmount,
        sellerReceives: sellerReceives,
        platformFee: platformFee,
        paymentStatus: 'completed'
      },
      message: 'Purchase successful!'
    });
    
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      error: 'Purchase failed',
      details: error.message
    });
  }
};

/**
 * Get marketplace statistics
 * GET /api/marketplace/stats
 */
exports.getStats = async (req, res) => {
  try {
    const totalCredits = await CarbonCredit.countDocuments();
    const availableCredits = await CarbonCredit.countDocuments({ status: 'available' });
    const soldCredits = await CarbonCredit.countDocuments({ status: 'sold' });
    
    const totalCarbon = await CarbonCredit.aggregate([
      { $group: { _id: null, total: { $sum: '$tons' } } }
    ]);
    
    const totalValue = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalCredits,
        availableCredits,
        soldCredits,
        totalCarbonTons: totalCarbon[0]?.total || 0,
        totalTransactionValue: totalValue[0]?.total || 0,
        averagePrice: 3200 // Can calculate dynamically
      }
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
};