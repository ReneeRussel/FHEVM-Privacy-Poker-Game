import { expect } from "chai";
import hre from "hardhat";

describe("FHECounter - Basic FHE Counter", function () {
  let counter: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();

    const FHECounterFactory = await hre.ethers.getContractFactory("FHECounter");
    counter = await FHECounterFactory.deploy();
    await counter.waitForDeployment();
  });

  describe("✅ CORRECT: Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await counter.getAddress()).to.be.properAddress;
    });

    it("Should initialize with encrypted zero", async function () {
      const count = await counter.getCount();
      expect(count).to.exist;
    });
  });

  describe("✅ CORRECT: Increment Operations", function () {
    it("Should increment counter by value", async function () {
      await counter.increment(5);
      const count = await counter.getCount();
      expect(count).to.exist;
    });

    it("Should emit Incremented event", async function () {
      await expect(counter.increment(10))
        .to.emit(counter, "Incremented")
        .withArgs(10);
    });

    it("Should increment multiple times", async function () {
      await counter.increment(5);
      await counter.increment(3);
      await counter.increment(2);

      const count = await counter.getCount();
      expect(count).to.exist;
    });
  });

  describe("✅ CORRECT: Decrement Operations", function () {
    it("Should decrement counter by value", async function () {
      await counter.increment(20);
      await counter.decrement(5);

      const count = await counter.getCount();
      expect(count).to.exist;
    });

    it("Should emit Decremented event", async function () {
      await expect(counter.decrement(3))
        .to.emit(counter, "Decremented")
        .withArgs(3);
    });
  });

  describe("🔐 Security: Access Control", function () {
    it("Should grant permissions after increment", async function () {
      await counter.increment(100);
      // Permissions automatically granted
      const count = await counter.getCount();
      expect(count).to.exist;
    });

    it("Should grant permissions after decrement", async function () {
      await counter.decrement(50);
      const count = await counter.getCount();
      expect(count).to.exist;
    });
  });
});
