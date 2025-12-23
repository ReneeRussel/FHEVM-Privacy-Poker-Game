# Encrypt Single Value

This example demonstrates the basic pattern for encrypting and storing a single value with proper permission management.

## Overview

This example teaches:
- **Basic Encryption**: Converting plaintext to encrypted type
- **State Storage**: Storing encrypted values in contract state
- **Permission Management**: Granting allowThis() and allow()
- **Retrieval Pattern**: Returning encrypted values

{% hint style="warning" %}
**Critical Pattern**: Always grant BOTH `FHE.allowThis()` and `FHE.allow()` permissions!
{% endhint %}

## Implementation

{% tabs %}

{% tab title="EncryptSingleValue.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptSingleValue
 * @dev Demonstrates encrypting a single value
 */
contract EncryptSingleValue is ZamaEthereumConfig {
    euint32 private _encryptedSecret;

    event SecretStored(address indexed user);

    function storeSecret(uint32 secretValue) external {
        // Step 1: Convert plaintext to encrypted type
        _encryptedSecret = FHE.asEuint32(secretValue);

        // Step 2: Grant contract permission
        FHE.allowThis(_encryptedSecret);

        // Step 3: Grant user permission
        FHE.allow(_encryptedSecret, msg.sender);

        emit SecretStored(msg.sender);
    }

    function getSecret() external view returns (euint32) {
        return _encryptedSecret;
    }
}
```

{% endtab %}

{% tab title="EncryptSingleValue.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("EncryptSingleValue", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("EncryptSingleValue");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Store Secret", function () {
    it("Should store encrypted secret", async function () {
      await contract.storeSecret(12345);
      const secret = await contract.getSecret();
      expect(secret).to.exist;
    });

    it("Should emit SecretStored event", async function () {
      await expect(contract.storeSecret(999))
        .to.emit(contract, "SecretStored")
        .withArgs(owner.address);
    });
  });

  describe("🔐 Security: Permission Management", function () {
    it("Should grant both allowThis and allow permissions", async function () {
      await contract.storeSecret(777);
      const secret = await contract.getSecret();
      expect(secret).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Step-by-Step Breakdown

### Step 1: Declare Encrypted State

```solidity
euint32 private _encryptedSecret;
```

The state variable uses `euint32` type, not `uint32`. This keeps the value encrypted in storage.

### Step 2: Convert to Encrypted Type

```solidity
_encryptedSecret = FHE.asEuint32(secretValue);
```

`FHE.asEuint32()` converts plaintext `uint32` to encrypted `euint32`.

### Step 3: Grant Contract Permission

```solidity
FHE.allowThis(_encryptedSecret);
```

**Critical**: Allows the contract to read/use the encrypted value.

### Step 4: Grant User Permission

```solidity
FHE.allow(_encryptedSecret, msg.sender);
```

Allows the user to access the encrypted value off-chain.

## The Permission Pattern

### Why Both Permissions?

```solidity
// ❌ WRONG - Missing allowThis
function storeSecret(uint32 value) external {
    _encryptedSecret = FHE.asEuint32(value);
    FHE.allow(_encryptedSecret, msg.sender);  // Only user permission!
    // Contract can't use _encryptedSecret in other functions!
}

// ✅ CORRECT - Both permissions
function storeSecret(uint32 value) external {
    _encryptedSecret = FHE.asEuint32(value);
    FHE.allowThis(_encryptedSecret);           // Contract permission
    FHE.allow(_encryptedSecret, msg.sender);   // User permission
}
```

### Permission Flow

```
1. User calls storeSecret(100)
2. Contract encrypts: 100 → encrypted_handle
3. Contract grants itself permission (allowThis)
4. Contract grants user permission (allow)
5. Contract can now use the value
6. User can decrypt off-chain
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting allowThis()

```solidity
// WRONG - Contract can't use the value later!
function storeSecret(uint32 value) external {
    _encryptedSecret = FHE.asEuint32(value);
    FHE.allow(_encryptedSecret, msg.sender);
}

// Contract function that will FAIL:
function doubleSecret() external {
    // ERROR: Contract doesn't have permission!
    _encryptedSecret = FHE.mul(_encryptedSecret, FHE.asEuint32(2));
}
```

### ❌ Pitfall 2: Returning Decrypted Value

```solidity
// WRONG - Can't decrypt in contract
function getSecretDecrypted() external view returns (uint32) {
    return uint32(_encryptedSecret);  // This won't work!
}

// CORRECT - Return encrypted handle
function getSecret() external view returns (euint32) {
    return _encryptedSecret;  // Return encrypted
}
```

### ❌ Pitfall 3: Not Updating Permissions After Modification

```solidity
// WRONG - Forgot to re-grant permissions
function updateSecret(uint32 newValue) external {
    _encryptedSecret = FHE.asEuint32(newValue);
    // Missing: FHE.allowThis and FHE.allow!
}

// CORRECT - Always re-grant
function updateSecret(uint32 newValue) external {
    _encryptedSecret = FHE.asEuint32(newValue);
    FHE.allowThis(_encryptedSecret);
    FHE.allow(_encryptedSecret, msg.sender);
}
```

## Usage Examples

### Example 1: Store Age

```solidity
contract AgeStorage is ZamaEthereumConfig {
    mapping(address => euint32) private _ages;

    function storeAge(uint32 age) external {
        euint32 encryptedAge = FHE.asEuint32(age);
        _ages[msg.sender] = encryptedAge;

        FHE.allowThis(encryptedAge);
        FHE.allow(encryptedAge, msg.sender);
    }

    function getAge() external view returns (euint32) {
        return _ages[msg.sender];
    }
}
```

### Example 2: Store Balance

```solidity
contract BalanceStorage is ZamaEthereumConfig {
    mapping(address => euint32) private _balances;

    function deposit(uint32 amount) external {
        euint32 currentBalance = _balances[msg.sender];
        euint32 newAmount = FHE.asEuint32(amount);

        euint32 newBalance = FHE.add(currentBalance, newAmount);
        _balances[msg.sender] = newBalance;

        FHE.allowThis(newBalance);
        FHE.allow(newBalance, msg.sender);
    }

    function getBalance() external view returns (euint32) {
        return _balances[msg.sender];
    }
}
```

## Best Practices

### 1. Always Grant Both Permissions

```solidity
// Good pattern
function store(uint32 value) external {
    euint32 encrypted = FHE.asEuint32(value);
    _state = encrypted;
    FHE.allowThis(encrypted);
    FHE.allow(encrypted, msg.sender);
}
```

### 2. Re-grant After Modifications

```solidity
function update() external {
    _state = FHE.add(_state, FHE.asEuint32(1));
    FHE.allowThis(_state);           // Re-grant!
    FHE.allow(_state, msg.sender);   // Re-grant!
}
```

### 3. Use Events for Transparency

```solidity
event ValueStored(address indexed user);

function store(uint32 value) external {
    // ... encryption and permissions ...
    emit ValueStored(msg.sender);
}
```

## Security Considerations

### 1. Access Control

Add access control if needed:
```solidity
function getSecret() external view returns (euint32) {
    require(msg.sender == owner, "Not authorized");
    return _encryptedSecret;
}
```

### 2. Input Validation

Validate inputs before encryption:
```solidity
function storeSecret(uint32 value) external {
    require(value > 0, "Value must be positive");
    require(value <= MAX_VALUE, "Value too large");
    // ... encryption ...
}
```

## Next Steps

After mastering single value encryption:
1. **Encrypt Multiple Values** - Handle multiple encrypted values
2. **FHE Arithmetic** - Perform operations on encrypted values
3. **Access Control** - Advanced permission patterns
4. **Simple Poker** - Real-world encrypted state

## Resources

- [FHEVM Types](https://docs.zama.ai/fhevm/fundamentals/types)
- [Permission System](https://docs.zama.ai/fhevm/fundamentals/acl)
- [Best Practices](https://docs.zama.ai/fhevm/guides/best-practices)

---

**Difficulty**: ⭐⭐ Beginner-Intermediate
**Category**: Encryption
**Concepts**: Encryption, Permissions, State storage
