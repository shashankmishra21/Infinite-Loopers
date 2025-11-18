const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Pinata
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

// Initialize blockchain provider
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load contract ABI
const contractABI = require('./artifacts/contracts/CarbonCredit.sol/CarbonCredit.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'CarbonSetu Blockchain Service',
    status: 'running',
    contract: contractAddress,
    network: 'Polygon Amoy Testnet'
  });
});

// Upload certificate data to IPFS
app.post('/upload-to-ipfs', async (req, res) => {
  try {
    const { farmerName, farmId, carbonTons, satelliteImages, certificateId } = req.body;
    
    // Create metadata JSON
    const metadata = {
      name: `Carbon Credit Certificate #${certificateId}`,
      description: `${farmerName} sequestered ${carbonTons} tons of CO2`,
      image: satelliteImages.june, // Main image
      attributes: [
        { trait_type: "Farmer", value: farmerName },
        { trait_type: "Farm ID", value: farmId },
        { trait_type: "Carbon Tons", value: carbonTons },
        { trait_type: "Certificate ID", value: certificateId },
        { trait_type: "Verification", value: "Satellite + AI" },
        { trait_type: "Standard", value: "Verra VCS Compatible" }
      ],
      external_url: `https://carbonsetu.com/certificate/${certificateId}`,
      proof: {
        january_image: satelliteImages.january,
        june_image: satelliteImages.june,
        methodology: "IPCC Tier 2",
        verification_date: new Date().toISOString()
      }
    };
    
    console.log('📤 Uploading to IPFS...');
    
    // Upload to Pinata
    const result = await pinata.pinJSONToIPFS(metadata);
    
    console.log('✅ Uploaded to IPFS:', result.IpfsHash);
    
    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    });
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mint carbon credit certificate (NFT)
app.post('/mint-certificate', async (req, res) => {
  try {
    const { farmerAddress, farmId, carbonTons, ipfsHash } = req.body;
    
    // Validate inputs
    if (!farmerAddress || !farmId || !carbonTons || !ipfsHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    console.log('🪙 Minting certificate...');
    console.log('Farmer:', farmerAddress);
    console.log('Farm:', farmId);
    console.log('Carbon:', carbonTons, 'tons');
    
    // Scale carbon tons by 100 (smart contract expects integer)
    const carbonScaled = Math.floor(carbonTons * 100);
    
    // Call smart contract
    const tx = await contract.issueCertificate(
      farmerAddress,
      farmId,
      carbonScaled,
      ipfsHash
    );
    
    console.log('⏳ Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    console.log('✅ Transaction confirmed!');
    
    // Extract token ID from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log)?.name === 'CertificateIssued';
      } catch {
        return false;
      }
    });
    
    let tokenId = null;
    if (event) {
      const parsed = contract.interface.parseLog(event);
      tokenId = parsed.args.tokenId.toString();
    }
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      tokenId: tokenId,
      explorerUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
      openseaUrl: tokenId ? `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}` : null
    });
    
  } catch (error) {
    console.error('Minting error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get certificate details
app.get('/certificate/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // Get certificate from blockchain
    const cert = await contract.getCertificate(tokenId);
    
    res.json({
      success: true,
      certificate: {
        tokenId: cert.tokenId.toString(),
        farmer: cert.farmer,
        farmId: cert.farmId,
        carbonTons: cert.carbonTons.toString() / 100, // Unscale
        issuedAt: new Date(Number(cert.issuedAt) * 1000).toISOString(),
        ipfsHash: cert.ipfsHash,
        isRetired: cert.isRetired,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`
      }
    });
    
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get total certificates
app.get('/stats', async (req, res) => {
  try {
    const total = await contract.totalCertificates();
    
    res.json({
      success: true,
      totalCertificates: total.toString(),
      contractAddress: contractAddress,
      network: 'Polygon Amoy Testnet'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blockchain service running on port ${PORT}`);
  console.log(`📝 Contract: ${contractAddress}`);
  console.log(`🌐 Network: Polygon Amoy Testnet`);
});