# FHE Counter Example

This example demonstrates how to build a simple encrypted counter using FHEVM, showcasing the fundamental concepts of encrypted state management.

## Overview

The FHE Counter is the simplest example demonstrating:
- **Encrypted State**: Storing encrypted integers on-chain
- **FHE Operations**: Addition and subtraction on encrypted values
- **Permission Management**: Proper use of FHE.allowThis() and FHE.allow()
- **Basic Pattern**: Foundation for all FHEVM applications

{% hint style="info" %}
**Learning Path**: This is the recommended starting point for learning FHEVM. Master this example before moving to more complex patterns.
{% endhint %}

## Implementation

{% tabs %}

{% tab title="FHECounter.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHECounter
 * @dev A simple counter using FHE encryption
 */
contract FHECounter is ZamaEthereumConfig {
    euint32 private _count;

    event Incremented(uint256 amount);
    event Decremented(uint256 amount);

    constructor() {
        _count = FHE.asEuint32(0);
    }

    function getCount() external view returns (euint32) {
        return _count;
    }

    function increment(uint32 value) external {
        euint32 encValue = FHE.asEuint32(value);
        _count = FHE.add(_count, encValue);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit Incremented(value);
    }

    function decrement(uint32 value) external {
        euint32 encValue = FHE.asEuint32(value);
        _count = FHE.sub(_count, encValue);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit Decremented(value);
    }
}
```

{% endtab %}

{% tab title="FHECounter.test.ts" %}

```typescript
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
  });

  describe("✅ CORRECT: Decrement Operations", function () {
    it("Should decrement counter by value", async function () {
      await counter.increment(20);
      await counter.decrement(5);
      const count = await counter.getCount();
      expect(count).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Key Concepts

### 1. Encrypted Types

```solidity
euint32 private _count;
```

**euint32** is an encrypted 32-bit unsigned integer. The value is never exposed in plaintext on-chain.

### 2. Converting to Encrypted Types

```solidity
euint32 encValue = FHE.asEuint32(value);
```

**FHE.asEuint32()** converts a plaintext value to an encrypted type.

### 3. FHE Operations

```solidity
_count = FHE.add(_count, encValue);  // Addition
_count = FHE.sub(_count, encValue);  // Subtraction
```

All operations happen on encrypted values without decryption.

### 4. Permission Management

```solidity
FHE.allowThis(_count);          // Contract permission
FHE.allow(_count, msg.sender);  // User permission
```

{% hint style="danger" %}
**Critical**: Always grant BOTH permissions. Forgetting `allowThis()` is the most common mistake.
{% endhint %}

## Common Pitfalls

### ❌ Pitfall 1: Missing allowThis()

**Wrong**:
```solidity
function increment(uint32 value) external {
    euint32 encValue = FHE.asEuint32(value);
    _count = FHE.add(_count, encValue);
    FHE.allow(_count, msg.sender);  // Missing allowThis!
}
```

**Correct**:
```solidity
function increment(uint32 value) external {
    euint32 encValue = FHE.asEuint32(value);
    _count = FHE.add(_count, encValue);
    FHE.allowThis(_count);           // Contract permission
    FHE.allow(_count, msg.sender);   // User permission
}
```

### ❌ Pitfall 2: Trying to Decrypt in View Function

**Wrong**:
```solidity
function getCountDecrypted() external view returns (uint32) {
    return uint32(_count);  // Can't decrypt!
}
```

**Correct**:
```solidity
function getCount() external view returns (euint32) {
    return _count;  // Return encrypted handle
}
```

## Usage Example

```javascript
// Deploy contract
const FHECounter = await ethers.getContractFactory("FHECounter");
const counter = await FHECounter.deploy();

// Increment
await counter.increment(10);
await counter.increment(5);

// Decrement
await counter.decrement(3);

// Get encrypted count
const encryptedCount = await counter.getCount();
// Note: encryptedCount is still encrypted
```

## Next Steps

After mastering the FHE Counter:
1. **FHE Arithmetic** - Learn more FHE operations (mul, div)
2. **FHE Comparisons** - Understand comparison operations
3. **Encrypt Single Value** - Learn about input proofs
4. **Access Control** - Advanced permission patterns

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Encrypted Types Reference](https://docs.zama.ai/fhevm/fundamentals/types)
- [FHE Operations](https://docs.zama.ai/fhevm/fundamentals/operations)

---

**Difficulty**: ⭐ Beginner
**Category**: Basic
**Concepts**: Encrypted state, FHE operations, Permissions
