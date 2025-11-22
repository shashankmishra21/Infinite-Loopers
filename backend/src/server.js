require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const axios = require('axios');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const farmerRoutes = require('./routes/farmerRoutes');
const farmRoutes = require('./routes/farmRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const satelliteRegistrationRoutes = require('./routes/satelliteRegistration');

// Initialize express
const app = express();

// Connect to database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'CarbonSetu Backend API',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      farmers: '/api/farmers',
      farms: '/api/farms',
      carbon: '/api/carbon',
      marketplace: '/api/marketplace',
      satelliteRegistration: '/api/farmers/register-with-satellite',
      currentFarmer: '/api/farmers/current'
    },
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      mlService: process.env.ML_SERVICE_URL ? 'configured' : 'not configured',
      satelliteAPI: process.env.SENTINEL_CLIENT_ID ? 'configured' : 'not configured'
    }
  });
});

// API Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/farmers', satelliteRegistrationRoutes);

// Serve static files (for uploaded/processed images)
app.use('/static', express.static('ml-service/static'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, async () => {
  console.log('====================================');
  console.log(`CarbonSetu Backend Server Started`);
  console.log('====================================');
  console.log(`Server running on: http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${mongoose.connection.readyState === 1 ? '✓ Connected' : '✗ Not connected'}`);
  
  // Check ML Service on startup
  if (process.env.ML_SERVICE_URL) {
    try {
      await axios.get(`${process.env.ML_SERVICE_URL}/health`, { timeout: 3000 });
      console.log(`ML Service: ✓ Connected (${process.env.ML_SERVICE_URL})`);
    } catch (error) {
      console.log(`ML Service: ✗ Unreachable (${process.env.ML_SERVICE_URL})`);
    }
  } else {
    console.log(`ML Service: Not configured`);
  }
  
  // Check Satellite API configuration
  if (process.env.SENTINEL_CLIENT_ID && process.env.SENTINEL_CLIENT_SECRET) {
    console.log(`Satellite API: ✓ Configured (Sentinel Hub)`);
  } else {
    console.log(`Satellite API: Not configured`);
  }
  
  console.log('====================================\n');
  console.log('API Endpoints:');
  console.log(`  POST   /api/farmers/register`);
  console.log(`  POST   /api/farmers/register-with-satellite`);
  console.log(`  GET    /api/farmers/current`);
  console.log(`  GET    /api/farmers/:phone`);
  console.log(`  GET    /health`);
  console.log('====================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => {
    console.log('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await mongoose.connection.close();
      console.log('Database connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await mongoose.connection.close();
      console.log('Database connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
});

module.exports = app;
