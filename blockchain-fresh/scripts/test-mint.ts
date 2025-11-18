import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🧪 Testing certificate minting...\n");
  
  // Get contract
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in .env");
  }
  
  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  const carbonCredit = CarbonCredit.attach(contractAddress);
  
  const [deployer] = await ethers.getSigners();
  
  // Test data
  const farmerAddress = deployer.address; // Use own address for testing
  const farmId = "test-farm-123";
  const carbonTons = 420; // 4.20 tons (scaled by 100)
  const ipfsHash = "QmTestHash123abc"; // Sample IPFS hash
  
  console.log("📝 Minting certificate...");
  console.log("Farmer:", farmerAddress);
  console.log("Farm ID:", farmId);
  console.log("Carbon:", carbonTons / 100, "tons");
  console.log("IPFS:", ipfsHash, "\n");
  
  // Mint certificate
  const tx = await carbonCredit.issueCertificate(
    farmerAddress,
    farmId,
    carbonTons,
    ipfsHash
  );
  
  console.log("⏳ Transaction sent:", tx.hash);
  console.log("Waiting for confirmation...\n");
  
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed!");
  console.log("Block number:", receipt?.blockNumber);
  
  // Get token ID from event
  const event = receipt?.logs.find((log: any) => {
    try {
      return carbonCredit.interface.parseLog(log)?.name === "CertificateIssued";
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsed = carbonCredit.interface.parseLog(event);
    const tokenId = parsed?.args.tokenId;
    console.log("🎫 Token ID:", tokenId.toString());
    console.log("🔗 View on OpenSea:", `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`);
    console.log("🔗 View on Amoy Polygonscan:", `https://amoy.polygonscan.com/token/${contractAddress}?a=${tokenId}`);
  }
  
  // Get certificate details
  const totalCerts = await carbonCredit.totalCertificates();
  console.log("\n📊 Total certificates:", totalCerts.toString());
  
  console.log("\n🎉 Test complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
