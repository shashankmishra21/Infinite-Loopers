const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  
  role: {
    type: String,
    enum: ['farmer', 'corporate', 'admin'],
    default: 'farmer'
  },
  
  walletAddress: {
    type: String,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid Ethereum address'
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
// userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);