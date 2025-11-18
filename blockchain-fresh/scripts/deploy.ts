import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying CarbonCredit contract...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC\n");

  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  console.log("⏳ Deploying contract...");
  
  const carbonCredit = await CarbonCredit.deploy();
  await carbonCredit.waitForDeployment();

  const contractAddress = await carbonCredit.getAddress();
  console.log("✅ CarbonCredit deployed to:", contractAddress);
  console.log("🔗 View on Amoy Polygonscan:", `https://amoy.polygonscan.com/address/${contractAddress}`);
  
  console.log("\n📋 Save this address:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });