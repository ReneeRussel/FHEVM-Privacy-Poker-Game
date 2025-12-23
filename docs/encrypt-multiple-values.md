# Encrypt Multiple Values

This example demonstrates how to work with multiple encrypted values in a single contract, including struct-based storage patterns.

## Overview

This example teaches:
- **Multiple Encrypted Values**: Managing several encrypted state variables
- **Struct Storage**: Organizing encrypted values in structs
- **Batch Permissions**: Granting permissions for multiple values
- **Data Organization**: Patterns for complex encrypted state

{% hint style="info" %}
**Real-World Use**: Perfect for applications requiring multiple private fields per user (profile data, credentials, scores).
{% endhint %}

## Implementation

{% tabs %}

{% tab title="EncryptMultipleValues.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptMultipleValues
 * @dev Demonstrates managing multiple encrypted values
 */
contract EncryptMultipleValues is ZamaEthereumConfig {

    struct UserProfile {
        euint32 age;
        euint32 balance;
        euint8 level;
    }

    mapping(address => UserProfile) private _profiles;

    event ProfileCreated(address indexed user);
    event ProfileUpdated(address indexed user);

    function createProfile(
        uint32 age,
        uint32 balance,
        uint8 level
    ) external {
        euint32 encAge = FHE.asEuint32(age);
        euint32 encBalance = FHE.asEuint32(balance);
        euint8 encLevel = FHE.asEuint8(level);

        _profiles[msg.sender] = UserProfile({
            age: encAge,
            balance: encBalance,
            level: encLevel
        });

        // Grant permissions for all values
        FHE.allowThis(encAge);
        FHE.allow(encAge, msg.sender);

        FHE.allowThis(encBalance);
        FHE.allow(encBalance, msg.sender);

        FHE.allowThis(encLevel);
        FHE.allow(encLevel, msg.sender);

        emit ProfileCreated(msg.sender);
    }

    function updateBalance(uint32 newBalance) external {
        euint32 encNewBalance = FHE.asEuint32(newBalance);
        _profiles[msg.sender].balance = encNewBalance;

        FHE.allowThis(encNewBalance);
        FHE.allow(encNewBalance, msg.sender);

        emit ProfileUpdated(msg.sender);
    }

    function getProfile()
        external
        view
        returns (euint32, euint32, euint8)
    {
        UserProfile memory profile = _profiles[msg.sender];
        return (profile.age, profile.balance, profile.level);
    }
}
```

{% endtab %}

{% tab title="EncryptMultipleValues.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("EncryptMultipleValues", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("EncryptMultipleValues");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Profile Creation", function () {
    it("Should create profile with multiple values", async function () {
      await contract.createProfile(25, 1000, 5);
      const [age, balance, level] = await contract.getProfile();
      expect(age).to.exist;
      expect(balance).to.exist;
      expect(level).to.exist;
    });

    it("Should emit ProfileCreated event", async function () {
      await expect(contract.createProfile(30, 5000, 10))
        .to.emit(contract, "ProfileCreated")
        .withArgs(owner.address);
    });
  });

  describe("✅ CORRECT: Profile Updates", function () {
    beforeEach(async function () {
      await contract.createProfile(25, 1000, 5);
    });

    it("Should update balance", async function () {
      await contract.updateBalance(2000);
      const [, balance] = await contract.getProfile();
      expect(balance).to.exist;
    });

    it("Should emit ProfileUpdated event", async function () {
      await expect(contract.updateBalance(3000))
        .to.emit(contract, "ProfileUpdated")
        .withArgs(owner.address);
    });
  });

  describe("🔐 Security: Permission Management", function () {
    it("Should grant permissions for all values", async function () {
      await contract.createProfile(25, 1000, 5);
      const [age, balance, level] = await contract.getProfile();
      expect(age).to.exist;
      expect(balance).to.exist;
      expect(level).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Key Concepts

### Struct-Based Storage

```solidity
struct UserProfile {
    euint32 age;
    euint32 balance;
    euint8 level;
}

mapping(address => UserProfile) private _profiles;
```

**Benefits**:
- Organizes related encrypted data
- Easy to extend with new fields
- Clear data structure

### Batch Permission Granting

```solidity
// Grant permissions for all struct fields
FHE.allowThis(encAge);
FHE.allow(encAge, msg.sender);

FHE.allowThis(encBalance);
FHE.allow(encBalance, msg.sender);

FHE.allowThis(encLevel);
FHE.allow(encLevel, msg.sender);
```

**Important**: Each encrypted value needs separate permission calls!

## Common Pitfalls

### ❌ Pitfall 1: Forgetting Permissions for All Values

**Wrong**:
```solidity
function createProfile(uint32 age, uint32 balance) external {
    euint32 encAge = FHE.asEuint32(age);
    euint32 encBalance = FHE.asEuint32(balance);

    _profiles[msg.sender] = UserProfile(encAge, encBalance);

    // Only granting for one value!
    FHE.allowThis(encAge);
    FHE.allow(encAge, msg.sender);
    // Missing permissions for encBalance!
}
```

**Correct**:
```solidity
function createProfile(uint32 age, uint32 balance) external {
    euint32 encAge = FHE.asEuint32(age);
    euint32 encBalance = FHE.asEuint32(balance);

    _profiles[msg.sender] = UserProfile(encAge, encBalance);

    // Grant for all values
    FHE.allowThis(encAge);
    FHE.allow(encAge, msg.sender);

    FHE.allowThis(encBalance);
    FHE.allow(encBalance, msg.sender);
}
```

### ❌ Pitfall 2: Type Mismatches in Structs

**Wrong**:
```solidity
struct Data {
    euint32 value1;
    euint8 value2;
}

// Type mismatch when using
euint32 val = FHE.add(data.value1, data.value2);  // Can't mix types!
```

**Correct**:
```solidity
struct Data {
    euint32 value1;
    euint8 value2;
}

// Convert to same type first
euint32 value2As32 = FHE.asEuint32(data.value2);
euint32 val = FHE.add(data.value1, value2As32);
```

### ❌ Pitfall 3: Partial Updates Without Re-granting

**Wrong**:
```solidity
function updateBalance(uint32 newBalance) external {
    _profiles[msg.sender].balance = FHE.asEuint32(newBalance);
    // Missing permission grants!
}
```

**Correct**:
```solidity
function updateBalance(uint32 newBalance) external {
    euint32 encNewBalance = FHE.asEuint32(newBalance);
    _profiles[msg.sender].balance = encNewBalance;

    FHE.allowThis(encNewBalance);
    FHE.allow(encNewBalance, msg.sender);
}
```

## Usage Examples

### Example 1: Gaming Profile

```solidity
contract GameProfile is ZamaEthereumConfig {
    struct PlayerStats {
        euint32 score;
        euint32 coins;
        euint8 level;
        euint16 experience;
    }

    mapping(address => PlayerStats) private _players;

    function initializePlayer() external {
        euint32 score = FHE.asEuint32(0);
        euint32 coins = FHE.asEuint32(100);
        euint8 level = FHE.asEuint8(1);
        euint16 exp = FHE.asEuint16(0);

        _players[msg.sender] = PlayerStats(score, coins, level, exp);

        // Grant all permissions
        FHE.allowThis(score);
        FHE.allow(score, msg.sender);
        FHE.allowThis(coins);
        FHE.allow(coins, msg.sender);
        FHE.allowThis(level);
        FHE.allow(level, msg.sender);
        FHE.allowThis(exp);
        FHE.allow(exp, msg.sender);
    }
}
```

### Example 2: Financial Data

```solidity
contract FinancialProfile is ZamaEthereumConfig {
    struct Account {
        euint32 balance;
        euint32 debt;
        euint32 creditScore;
    }

    mapping(address => Account) private _accounts;

    function createAccount(uint32 initialBalance) external {
        euint32 balance = FHE.asEuint32(initialBalance);
        euint32 debt = FHE.asEuint32(0);
        euint32 creditScore = FHE.asEuint32(700);

        _accounts[msg.sender] = Account(balance, debt, creditScore);

        // Permission management
        FHE.allowThis(balance);
        FHE.allow(balance, msg.sender);
        FHE.allowThis(debt);
        FHE.allow(debt, msg.sender);
        FHE.allowThis(creditScore);
        FHE.allow(creditScore, msg.sender);
    }

    function makePayment(uint32 amount) external {
        Account storage account = _accounts[msg.sender];

        euint32 payment = FHE.asEuint32(amount);
        account.balance = FHE.sub(account.balance, payment);
        account.debt = FHE.sub(account.debt, payment);

        // Re-grant permissions for modified values
        FHE.allowThis(account.balance);
        FHE.allow(account.balance, msg.sender);
        FHE.allowThis(account.debt);
        FHE.allow(account.debt, msg.sender);
    }
}
```

### Example 3: Medical Records

```solidity
contract MedicalRecords is ZamaEthereumConfig {
    struct HealthData {
        euint8 bloodPressureSystolic;
        euint8 bloodPressureDiastolic;
        euint16 heartRate;
        euint8 bloodSugar;
    }

    mapping(address => HealthData) private _records;

    function recordVitals(
        uint8 systolic,
        uint8 diastolic,
        uint16 heartRate,
        uint8 bloodSugar
    ) external {
        euint8 encSystolic = FHE.asEuint8(systolic);
        euint8 encDiastolic = FHE.asEuint8(diastolic);
        euint16 encHeartRate = FHE.asEuint16(heartRate);
        euint8 encBloodSugar = FHE.asEuint8(bloodSugar);

        _records[msg.sender] = HealthData(
            encSystolic,
            encDiastolic,
            encHeartRate,
            encBloodSugar
        );

        // Grant permissions for all health data
        FHE.allowThis(encSystolic);
        FHE.allow(encSystolic, msg.sender);
        FHE.allowThis(encDiastolic);
        FHE.allow(encDiastolic, msg.sender);
        FHE.allowThis(encHeartRate);
        FHE.allow(encHeartRate, msg.sender);
        FHE.allowThis(encBloodSugar);
        FHE.allow(encBloodSugar, msg.sender);
    }
}
```

## Best Practices

### 1. Consistent Permission Pattern

```solidity
// Always follow this pattern for each value:
euint32 value = FHE.asEuint32(plainValue);
FHE.allowThis(value);
FHE.allow(value, msg.sender);
```

### 2. Use Helper Functions

```solidity
function _grantPermissions(euint32 value) private {
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}

function createProfile(uint32 age, uint32 balance) external {
    euint32 encAge = FHE.asEuint32(age);
    euint32 encBalance = FHE.asEuint32(balance);

    _profiles[msg.sender] = UserProfile(encAge, encBalance);

    _grantPermissions(encAge);
    _grantPermissions(encBalance);
}
```

### 3. Emit Events for Tracking

```solidity
event ProfileCreated(address indexed user);
event ProfileUpdated(address indexed user, string field);

function updateBalance(uint32 newBalance) external {
    // ... update logic ...
    emit ProfileUpdated(msg.sender, "balance");
}
```

### 4. Consider Gas Costs

Multiple encrypted values = higher gas costs:
- Each encryption costs gas
- Each permission grant costs gas
- Consider batching updates when possible

## Performance Considerations

### Gas Cost Analysis

| Operation | Cost | Notes |
|-----------|------|-------|
| Single value encryption | Moderate | Base cost |
| Struct with 3 values | 3x single | Linear scaling |
| Permission grants (2 per value) | 2x per value | Don't skip these |
| Struct retrieval | Low | View function |

### Optimization Tips

1. **Batch Updates**: Update multiple fields together when possible
2. **Right-Size Types**: Use euint8 instead of euint32 for small values
3. **Lazy Initialization**: Only encrypt values when needed
4. **Consider Access Patterns**: Frequently updated fields may benefit from separate storage

## Security Considerations

### 1. Permission Isolation

```solidity
// Each user can only access their own data
function getProfile() external view returns (...) {
    return _profiles[msg.sender];  // msg.sender ensures isolation
}
```

### 2. Selective Sharing

```solidity
// Share specific fields with specific addresses
function shareBalance(address recipient) external {
    FHE.allow(_profiles[msg.sender].balance, recipient);
}
```

### 3. Input Validation

```solidity
function createProfile(uint32 age, uint32 balance) external {
    require(age > 0 && age < 150, "Invalid age");
    require(balance > 0, "Invalid balance");
    // ... encryption ...
}
```

## Next Steps

After mastering multiple encrypted values:
1. **Access Control** - Advanced permission patterns
2. **Input Proof** - Handle user-encrypted inputs
3. **Simple Poker** - See multiple values in gaming
4. **Privacy Poker** - Advanced multi-value usage

## Resources

- [Structs with FHEVM](https://docs.zama.ai/fhevm/guides/structs)
- [Permission Management](https://docs.zama.ai/fhevm/fundamentals/acl)
- [Gas Optimization](https://docs.zama.ai/fhevm/guides/gas-optimization)

---

**Difficulty**: ⭐⭐⭐ Intermediate
**Category**: Encryption
**Concepts**: Multiple values, Structs, Batch permissions, Data organization
