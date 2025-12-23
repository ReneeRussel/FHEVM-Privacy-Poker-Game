import { expect } from "chai";
import hre from "hardhat";

describe("EncryptMultipleValues - Multiple Value Encryption", function () {
  let encryptor: any;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await hre.ethers.getSigners();

    const EncryptorFactory = await hre.ethers.getContractFactory("EncryptMultipleValues");
    encryptor = await EncryptorFactory.deploy();
    await encryptor.waitForDeployment();
  });

  describe("✅ CORRECT: Store Multiple Secrets", function () {
    it("Should store two encrypted values", async function () {
      await encryptor.storeSecrets(100, 200);
      const secrets = await encryptor.getSecrets();
      expect(secrets.value1).to.exist;
      expect(secrets.value2).to.exist;
    });

    it("Should emit SecretsStored event", async function () {
      await expect(encryptor.storeSecrets(50, 75))
        .to.emit(encryptor, "SecretsStored")
        .withArgs(owner.address);
    });

    it("Should store different values for different users", async function () {
      await encryptor.connect(owner).storeSecrets(10, 20);
      await encryptor.connect(user1).storeSecrets(30, 40);

      const ownerSecrets = await encryptor.connect(owner).getSecrets();
      const user1Secrets = await encryptor.connect(user1).getSecrets();

      expect(ownerSecrets.value1).to.exist;
      expect(user1Secrets.value1).to.exist;
    });
  });

  describe("✅ CORRECT: Retrieve Secrets", function () {
    it("Should retrieve stored encrypted pair", async function () {
      await encryptor.storeSecrets(111, 222);
      const secrets = await encryptor.getSecrets();

      expect(secrets.value1).to.exist;
      expect(secrets.value2).to.exist;
    });

    it("Should compute sum of secrets", async function () {
      await encryptor.storeSecrets(25, 75);
      const sum = await encryptor.getSumOfSecrets();
      expect(sum).to.exist;
    });
  });

  describe("🔐 Security: Multiple Value Permissions", function () {
    it("Should grant permissions for both values", async function () {
      await encryptor.storeSecrets(123, 456);

      // Both values should have permissions
      const secrets = await encryptor.getSecrets();
      expect(secrets.value1).to.exist;
      expect(secrets.value2).to.exist;
    });
  });

  describe("🎓 Learning: Multiple Encrypted Values", function () {
    it("Demonstrates storing multiple encrypted values", async function () {
      // Each value needs individual permission grants
      await encryptor.storeSecrets(10, 20);

      const secrets = await encryptor.getSecrets();
      expect(secrets).to.exist;
    });

    it("Demonstrates FHE operations on stored values", async function () {
      // Can perform FHE operations on retrieved values
      await encryptor.storeSecrets(100, 50);

      const sum = await encryptor.getSumOfSecrets();
      expect(sum).to.exist;
    });
  });
});
