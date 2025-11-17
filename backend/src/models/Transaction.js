const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  creditId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarbonCredit',
    required: true
  },
  
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  platformFee: {
    type: Number,
    required: true
  },
  
  sellerReceives: {
    type: Number,
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  
  blockchainTxHash: {
    type: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: Date
});

// Indexes
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
