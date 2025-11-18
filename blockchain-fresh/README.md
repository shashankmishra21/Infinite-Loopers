# Sample Hardhat 3 Beta Project (`mocha` and `ethers`)

This project showcases a Hardhat 3 Beta project using `mocha` for tests and the `ethers` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using `mocha` and ethers.js
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

# CarbonSetu Blockchain Service - Complete Setup Guide

## 🎯 Overview
This blockchain service handles carbon credit certificate minting as NFTs on Polygon Amoy testnet, with IPFS metadata storage via Pinata.

## 📁 Project Structure
```
blockchain-fresh/
├── contracts/
│   └── CarbonCredit.sol              # Smart contract
├── scripts/
│   ├── deploy.ts                     # Deployment script
│   └── test-mint.ts                  # Testing script
├── server.js                         # Express API server
├── test-api.js                       # API testing script
├── start.sh                          # Quick start script
├── hardhat.config.js                 # Hardhat configuration
├── package.json                      # Dependencies
├── .env                              # Environment variables
└── README.md                         # This file
```

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Update `.env` file with your credentials:
```bash
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=your_private_key_here
POLYGON_TESTNET_RPC=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PORT=9000
```

### Step 3: Compile Contract
```bash
npx hardhat compile
```

### Step 4: Deploy Contract (if not deployed)
```bash
# Local deployment
npx hardhat run scripts/deploy.ts

# Amoy testnet deployment (need MATIC tokens)
npx hardhat run scripts/deploy.ts --network amoy
```

### Step 5: Test Minting
```bash
npx hardhat run scripts/test-mint.ts
```

### Step 6: Start API Server
```bash
# Using start script
./start.sh

# Or directly
node server.js
```

## 🛠️ API Endpoints

### Health Check
```bash
GET http://localhost:9000/
```

### Upload to IPFS
```bash
POST http://localhost:9000/upload-to-ipfs
Content-Type: application/json

{
  "farmerName": "Ramesh Kumar",
  "farmId": "farm123",
  "carbonTons": 4.2,
  "satelliteImages": {
    "january": "/images/jan.jpg",
    "june": "/images/jun.jpg"
  },
  "certificateId": "CC-001"
}
```

### Mint Certificate
```bash
POST http://localhost:9000/mint-certificate
Content-Type: application/json

{
  "farmerAddress": "0xYourAddress",
  "farmId": "farm123",
  "carbonTons": 4.2,
  "ipfsHash": "QmHashFromPreviousStep"
}
```

### Get Certificate
```bash
GET http://localhost:9000/certificate/:tokenId
```

### Get Stats
```bash
GET http://localhost:9000/stats
```

## 🎉 Success! 

Your blockchain service is now ready to:
✅ Mint carbon credit NFTs
✅ Store metadata on IPFS
✅ Provide REST APIs
✅ Track certificates on blockchain
✅ Support OpenSea marketplace

You can also selectively run the Solidity or `mocha` tests:

```shell
npx hardhat test solidity
npx hardhat test mocha
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
