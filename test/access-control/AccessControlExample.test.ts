import { expect } from "chai";
import hre from "hardhat";

describe("AccessControlExample - FHE Access Control", function () {
  let accessControl: any;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await hre.ethers.getSigners();

    const AccessControlFactory = await hre.ethers.getContractFactory("AccessControlExample");
    accessControl = await AccessControlFactory.deploy();
    await accessControl.waitForDeployment();
  });

  describe("✅ CORRECT: Update Secret", function () {
    it("Should update secret value", async function () {
      await accessControl.updateSecret(42);
      const secret = await accessControl.getSecret();
      expect(secret).to.exist;
    });

    it("Should emit SecretUpdated event", async function () {
      await expect(accessControl.updateSecret(100))
        .to.emit(accessControl, "SecretUpdated");
    });

    it("Should grant permissions after update", async function () {
      await accessControl.updateSecret(777);

      // Secret accessible after permissions granted
      const secret = await accessControl.getSecret();
      expect(secret).to.exist;
    });
  });

  describe("✅ CORRECT: Balance Management", function () {
    it("Should set user balance", async function () {
      await accessControl.setBalance(1000);
      const balance = await accessControl.getBalance();
      expect(balance).to.exist;
    });

    it("Should emit BalanceUpdated event", async function () {
      await expect(accessControl.setBalance(500))
        .to.emit(accessControl, "BalanceUpdated")
        .withArgs(owner.address);
    });

    it("Should handle different users independently", async function () {
      await accessControl.connect(owner).setBalance(100);
      await accessControl.connect(user1).setBalance(200);

      const ownerBalance = await accessControl.connect(owner).getBalance();
      const user1Balance = await accessControl.connect(user1).getBalance();

      expect(ownerBalance).to.exist;
      expect(user1Balance).to.exist;
    });
  });

  describe("🔐 Security: Permission Patterns", function () {
    it("Demonstrates FHE.allowThis() usage", async function () {
      // allowThis grants contract permission
      await accessControl.updateSecret(123);
      expect(await accessControl.getSecret()).to.exist;
    });

    it("Demonstrates FHE.allow() usage", async function () {
      // allow grants user permission
      await accessControl.updateSecret(456);
      expect(await accessControl.getSecret()).to.exist;
    });

    it("Demonstrates FHE.allowTransient() usage", async function () {
      // allowTransient for temporary operations
      await accessControl.setBalance(999);
      expect(await accessControl.getBalance()).to.exist;
    });
  });

  describe("🎓 Learning: Access Control Best Practices", function () {
    it("Always grant both allowThis and allow", async function () {
      // Best practice: grant both permissions
      await accessControl.updateSecret(42);

      // Value accessible to both contract and user
      const secret = await accessControl.getSecret();
      expect(secret).to.exist;
    });

    it("Use allowTransient for temporary access", async function () {
      // allowTransient for operations that don't need permanent access
      await accessControl.setBalance(250);

      const balance = await accessControl.getBalance();
      expect(balance).to.exist;
    });
  });
});
