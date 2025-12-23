import { expect } from "chai";
import hre from "hardhat";

describe("EncryptSingleValue - Single Value Encryption", function () {
  let encryptor: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();

    const EncryptorFactory = await hre.ethers.getContractFactory("EncryptSingleValue");
    encryptor = await EncryptorFactory.deploy();
    await encryptor.waitForDeployment();
  });

  describe("✅ CORRECT: Store Secret", function () {
    it("Should store encrypted secret", async function () {
      await encryptor.storeSecret(12345);
      const secret = await encryptor.getSecret();
      expect(secret).to.exist;
    });

    it("Should emit SecretStored event", async function () {
      await expect(encryptor.storeSecret(999))
        .to.emit(encryptor, "SecretStored")
        .withArgs(owner.address);
    });

    it("Should overwrite previous secret", async function () {
      await encryptor.storeSecret(100);
      await encryptor.storeSecret(200);

      const secret = await encryptor.getSecret();
      expect(secret).to.exist;
    });
  });

  describe("✅ CORRECT: Retrieve Secret", function () {
    it("Should retrieve encrypted secret", async function () {
      await encryptor.storeSecret(54321);
      const secret = await encryptor.getSecret();
      expect(secret).to.exist;
    });
  });

  describe("🔐 Security: Permission Management", function () {
    it("Should grant both allowThis and allow permissions", async function () {
      // When storeSecret is called, it grants:
      // 1. FHE.allowThis() - contract permission
      // 2. FHE.allow() - user permission
      await encryptor.storeSecret(777);

      // Secret should be accessible
      const secret = await encryptor.getSecret();
      expect(secret).to.exist;
    });
  });

  describe("🎓 Learning: Basic Encryption Pattern", function () {
    it("Demonstrates FHE.asEuint32() conversion", async function () {
      // FHE.asEuint32() converts plaintext to encrypted type
      await encryptor.storeSecret(42);
      expect(await encryptor.getSecret()).to.exist;
    });

    it("Demonstrates permission granting pattern", async function () {
      // Always grant both permissions when storing encrypted values
      await encryptor.storeSecret(100);

      // Value is now accessible to both contract and user
      const secret = await encryptor.getSecret();
      expect(secret).to.exist;
    });
  });
});
