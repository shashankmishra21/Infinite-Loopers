#!/bin/bash

echo "🚀 CarbonSetu Blockchain Service - Quick Start"
echo "=============================================="

# Check if contract deployed
if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "❌ CONTRACT_ADDRESS not set in .env"
  echo "Run: npx hardhat run scripts/deploy.ts --network amoy"
  exit 1
fi

echo "✅ Contract Address: $CONTRACT_ADDRESS"
echo "🌐 Network: Polygon Amoy Testnet"
echo ""

# Start API server
echo "🚀 Starting blockchain API server..."
node server.js