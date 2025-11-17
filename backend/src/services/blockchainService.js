const axios = require('axios');

const BLOCKCHAIN_SERVICE_URL = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:9000';

class BlockchainService {
  /**
   * Upload certificate data to IPFS
   */
  async uploadToIPFS(certificateData) {
    try {
      const response = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/upload-to-ipfs`, certificateData);
      return response.data;
    } catch (error) {
      console.error('IPFS Upload Error:', error.message);
      throw new Error('IPFS upload failed');
    }
  }
  
  /**
   * Mint carbon credit NFT
   */
  async mintCertificate(mintData) {
    try {
      const response = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/mint-certificate`, mintData);
      return response.data;
    } catch (error) {
      console.error('Blockchain Minting Error:', error.message);
      throw new Error('Certificate minting failed');
    }
  }
  
  /**
   * Get certificate details from blockchain
   */
  async getCertificate(tokenId) {
    try {
      const response = await axios.get(`${BLOCKCHAIN_SERVICE_URL}/certificate/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('Blockchain Fetch Error:', error.message);
      throw new Error('Certificate fetch failed');
    }
  }
}

module.exports = new BlockchainService();