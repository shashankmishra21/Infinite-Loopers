const mongoose = require('mongoose');

const carbonCreditSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  tons: {
    type: Number,
    required: true,
    min: 0
  },
  
  pricePerTon: {
    type: Number,
    required: true,
    default: 3200
  },
  
  totalValue: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    enum: ['available', 'sold', 'retired'],
    default: 'available'
  },
  
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  tokenId: {
    type: Number
  },
  
  blockchainTxHash: {
    type: String
  },
  
  ipfsHash: {
    type: String
  },
  
  listedAt: {
    type: Date,
    default: Date.now
  },
  
  soldAt: Date,
  retiredAt: Date
});

// Calculate total value before saving
carbonCreditSchema.pre('save', function(next) {
  this.totalValue = this.tons * this.pricePerTon;
  next();
});

// Indexes
carbonCreditSchema.index({ farmId: 1 });
carbonCreditSchema.index({ farmerId: 1 });
carbonCreditSchema.index({ status: 1 });
carbonCreditSchema.index({ buyerId: 1 });

module.exports = mongoose.model('CarbonCredit', carbonCreditSchema);