const Joi = require('joi');

/**
 * Validate farmer registration
 */
exports.validateFarmerRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    acres: Joi.number().min(0.1).max(1000).required(),
    cropType: Joi.string().valid('wheat', 'rice', 'sugarcane', 'cotton', 'maize', 'pulses', 'vegetables', 'mixed').required(),
    farmingPractice: Joi.string().valid('organic', 'conventional', 'natural').optional()
  });
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details[0].message
    });
  }
  
  next();
};