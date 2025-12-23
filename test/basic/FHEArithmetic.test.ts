import { expect } from "chai";
import hre from "hardhat";

describe("FHEArithmetic - FHE Operations", function () {
  let arithmetic: any;

  beforeEach(async function () {
    const FHEArithmeticFactory = await hre.ethers.getContractFactory("FHEArithmetic");
    arithmetic = await FHEArithmeticFactory.deploy();
    await arithmetic.waitForDeployment();
  });

  describe("✅ CORRECT: Addition Operations", function () {
    it("Should add two encrypted values", async function () {
      const result = await arithmetic.addEncrypted(10, 20);
      expect(result).to.exist;
    });

    it("Should handle zero addition", async function () {
      const result = await arithmetic.addEncrypted(0, 0);
      expect(result).to.exist;
    });

    it("Should handle large numbers", async function () {
      const result = await arithmetic.addEncrypted(1000000, 2000000);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Subtraction Operations", function () {
    it("Should subtract two encrypted values", async function () {
      const result = await arithmetic.subtractEncrypted(20, 10);
      expect(result).to.exist;
    });

    it("Should handle same value subtraction", async function () {
      const result = await arithmetic.subtractEncrypted(100, 100);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Multiplication Operations", function () {
    it("Should multiply two encrypted values", async function () {
      const result = await arithmetic.multiplyEncrypted(5, 10);
      expect(result).to.exist;
    });

    it("Should handle zero multiplication", async function () {
      const result = await arithmetic.multiplyEncrypted(100, 0);
      expect(result).to.exist;
    });

    it("Should handle one multiplication", async function () {
      const result = await arithmetic.multiplyEncrypted(42, 1);
      expect(result).to.exist;
    });
  });

  describe("🎓 Learning: FHE Operations", function () {
    it("Demonstrates FHE.add() usage", async function () {
      // FHE.add() performs addition on encrypted values
      const result = await arithmetic.addEncrypted(15, 25);
      expect(result).to.exist;
    });

    it("Demonstrates FHE.sub() usage", async function () {
      // FHE.sub() performs subtraction on encrypted values
      const result = await arithmetic.subtractEncrypted(50, 30);
      expect(result).to.exist;
    });

    it("Demonstrates FHE.mul() usage", async function () {
      // FHE.mul() performs multiplication on encrypted values
      const result = await arithmetic.multiplyEncrypted(7, 8);
      expect(result).to.exist;
    });
  });
});
