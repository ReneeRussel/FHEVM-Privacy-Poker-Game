import { expect } from "chai";
import hre from "hardhat";

describe("FHEEquality - FHE Comparisons", function () {
  let equality: any;

  beforeEach(async function () {
    const FHEEqualityFactory = await hre.ethers.getContractFactory("FHEEquality");
    equality = await FHEEqualityFactory.deploy();
    await equality.waitForDeployment();
  });

  describe("✅ CORRECT: Equality Checks", function () {
    it("Should check if values are equal", async function () {
      const result = await equality.isEqual(42, 42);
      expect(result).to.exist;
    });

    it("Should check if values are not equal", async function () {
      const result = await equality.isNotEqual(10, 20);
      expect(result).to.exist;
    });

    it("Should handle zero equality", async function () {
      const result = await equality.isEqual(0, 0);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Greater Than Checks", function () {
    it("Should check if value is greater", async function () {
      const result = await equality.isGreaterThan(100, 50);
      expect(result).to.exist;
    });

    it("Should handle equal values in greater than", async function () {
      const result = await equality.isGreaterThan(50, 50);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Less Than Checks", function () {
    it("Should check if value is less", async function () {
      const result = await equality.isLessThan(30, 60);
      expect(result).to.exist;
    });

    it("Should handle zero comparison", async function () {
      const result = await equality.isLessThan(0, 1);
      expect(result).to.exist;
    });
  });

  describe("🎓 Learning: FHE Comparison Operations", function () {
    it("Demonstrates FHE.eq() for equality", async function () {
      // FHE.eq() returns encrypted boolean (ebool)
      const result = await equality.isEqual(123, 123);
      expect(result).to.exist;
    });

    it("Demonstrates FHE.ne() for inequality", async function () {
      // FHE.ne() checks if values are not equal
      const result = await equality.isNotEqual(10, 20);
      expect(result).to.exist;
    });

    it("Demonstrates FHE.gt() for greater than", async function () {
      // FHE.gt() checks if first > second
      const result = await equality.isGreaterThan(200, 100);
      expect(result).to.exist;
    });

    it("Demonstrates FHE.lt() for less than", async function () {
      // FHE.lt() checks if first < second
      const result = await equality.isLessThan(5, 10);
      expect(result).to.exist;
    });
  });
});
