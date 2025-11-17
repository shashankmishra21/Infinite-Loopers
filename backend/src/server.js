require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const farmerRoutes = require('./routes/farmerRoutes');
const farmRoutes = require('./routes/farmRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply rate limiting
app.use('/api/', apiLimiter);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'CarbonSetu Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      farmers: '/api/farmers',
      farms: '/api/farms',
      carbon: '/api/carbon',
      marketplace: '/api/marketplace'
    }
  });
});

// API Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`CarbonSetu Backend Server Started`);
  console.log('====================================');
  console.log(`Server running on: http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log(`ML Service: ${process.env.ML_SERVICE_URL}`);
  console.log(`Blockchain Service: ${process.env.BLOCKCHAIN_SERVICE_URL}`);
  console.log('====================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});