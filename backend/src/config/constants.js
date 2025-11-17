module.exports = {
  // Crop factors (for carbon calculation)
  CROP_FACTORS: {
    wheat: 1.2,
    rice: 1.5,
    sugarcane: 1.8,
    cotton: 1.0,
    maize: 1.3,
    pulses: 1.1,
    vegetables: 0.9,
    mixed: 1.2
  },
  
  // Carbon calculation constants
  CARBON_PERCENTAGE: 0.45,
  CO2_RATIO: 3.67,
  ADJUSTMENT_FACTOR: 0.35,
  
  // Farm status
  FARM_STATUS: {
    PENDING: 'pending',
    VERIFIED: 'verified',
    CLAIMED: 'claimed'
  },
  
  // Credit status
  CREDIT_STATUS: {
    AVAILABLE: 'available',
    SOLD: 'sold',
    RETIRED: 'retired'
  },
  
  // Transaction status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  }
};