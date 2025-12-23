const hre = require("hardhat");

async function main() {
  console.log("Deploying Example contract...");

  const ExampleFactory = await hre.ethers.getContractFactory("Example");
  const example = await ExampleFactory.deploy();

  await example.waitForDeployment();

  const address = await example.getAddress();
  console.log("Example deployed to:", address);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
