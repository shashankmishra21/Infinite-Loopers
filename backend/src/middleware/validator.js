const { body, validationResult } = require('express-validator');

exports.validateFarmerRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('state').notEmpty().withMessage('State is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('village').notEmpty().withMessage('Village is required'),
  body('acres').isFloat({ min: 0.1 }).withMessage('Farm size must be positive'),
  body('cropType').notEmpty().withMessage('Crop type is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateSatelliteRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('cropType').notEmpty().withMessage('Crop type is required'),
  body('farmBoundary').isArray().withMessage('Farm boundary must be an array'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
