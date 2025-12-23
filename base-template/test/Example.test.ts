import { expect } from "chai";
import hre from "hardhat";

describe("Example", function () {
  let example: any;

  beforeEach(async function () {
    const ExampleFactory = await hre.ethers.getContractFactory("Example");
    example = await ExampleFactory.deploy();
    await example.waitForDeployment();
  });

  it("✅ Should be deployed correctly", async function () {
    const value = await example.getValue();
    expect(value).to.exist;
  });
});
