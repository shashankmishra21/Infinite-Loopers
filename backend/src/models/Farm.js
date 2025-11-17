const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  location: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  
  region: {
    type: String,
    default: 'India'
  },
  
  acres: {
    type: Number,
    required: true,
    min: [0.1, 'Farm size must be at least 0.1 acres'],
    max: [1000, 'Farm size cannot exceed 1000 acres']
  },
  
  cropType: {
    type: String,
    required: true,
    enum: ['wheat', 'rice', 'sugarcane', 'cotton', 'maize', 'pulses', 'vegetables', 'mixed']
  },
  
  farmingPractice: {
    type: String,
    enum: ['organic', 'conventional', 'natural'],
    default: 'conventional'
  },
  
  carbonTons: {
    type: Number,
    default: 0,
    min: 0
  },
  
  ndviHistory: [{
    month: String,
    ndvi: Number,
    date: Date
  }],
  
  satelliteImages: {
    january: String,
    june: String
  },
  
  certificateId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  blockchainTxHash: {
    type: String,
    sparse: true
  },
  
  tokenId: {
    type: Number,
    sparse: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'verified', 'claimed'],
    default: 'pending'
  },
  
  verifiedAt: Date,
  claimedAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
farmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
farmSchema.index({ farmerId: 1 });
farmSchema.index({ status: 1 });
farmSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Farm', farmSchema);