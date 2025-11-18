const hre = require("hardhat");

async function main() {
  console.log("🧪 Running simple carbon credit test...\n");

  // Deploy the contract
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  const carbonCredit = await CarbonCredit.deploy();
  await carbonCredit.waitForDeployment();

  const contractAddress = await carbonCredit.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // Test minting a certificate
  const farmerAddress = deployer.address;
  const farmId = "farm-001";
  const carbonTons = 250; // 2.50 tons (scaled by 100)
  const ipfsHash = "QmTestHash123";

  console.log("\n🌱 Minting carbon credit certificate...");
  console.log("Farmer:", farmerAddress);
  console.log("Farm ID:", farmId);
  console.log("Carbon Tons:", carbonTons / 100);
  console.log("IPFS Hash:", ipfsHash);

  const tx = await carbonCredit.issueCertificate(farmerAddress, farmId, carbonTons, ipfsHash);
  const receipt = await tx.wait();
  
  console.log("✅ Certificate minted successfully!");
  console.log("Transaction hash:", tx.hash);
  console.log("Block number:", receipt.blockNumber);

  // Check total certificates
  const totalCerts = await carbonCredit.totalCertificates();
  console.log("\n📊 Total certificates issued:", totalCerts.toString());

  console.log("\n🎉 Test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });