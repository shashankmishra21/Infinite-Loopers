const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Make farmBoundary completely optional
  farmBoundary: {
    type: {
      type: String,
      enum: ['Polygon']
    },
    coordinates: [[[Number]]]
  },
  acres: {
    type: Number,
    required: true,
    min: 0
  },
  cropType: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['rice', 'wheat', 'cotton', 'sugarcane', 'pulses', 'vegetables', 'other']
  },
  farmingPractice: {
    type: String,
    enum: ['conventional', 'organic', 'regenerative'],
    default: 'conventional'
  },
  satelliteImages: {
    january: String,
    june: String
  },
  ndviHistory: [{
    month: String,
    ndvi: Number,
    date: Date
  }],
  carbonTons: {
    type: Number,
    default: 0
  },
  earningsEstimate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'verified', 'rejected'],
    default: 'unverified'
  }
}, {
  timestamps: true
});

// REMOVE ALL INDEXES FOR NOW - uncomment later when needed
// farmSchema.index({ farmBoundary: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Farm', farmSchema);
