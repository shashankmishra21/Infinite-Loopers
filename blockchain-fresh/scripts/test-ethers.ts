import hre from "hardhat";

async function main() {
  console.log("HRE:", Object.keys(hre));
  console.log("Ethers available?", hre.ethers !== undefined);
  
  if (hre.ethers) {
    console.log("Ethers methods:", Object.keys(hre.ethers));
  }
}

main().catch(console.error);
