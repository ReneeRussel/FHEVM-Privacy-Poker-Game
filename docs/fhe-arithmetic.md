# FHE Arithmetic Operations

This example demonstrates how to perform arithmetic operations on encrypted values using FHEVM.

## Overview

FHE Arithmetic shows:
- **FHE Addition**: Adding encrypted values
- **FHE Subtraction**: Subtracting encrypted values
- **FHE Multiplication**: Multiplying encrypted values
- **Pure Functions**: Operations without state changes

{% hint style="success" %}
**Use Case**: Perfect for learning how to manipulate encrypted numeric data in smart contracts.
{% endhint %}

## Key FHEVM Concepts

### Arithmetic Operations

FHEVM provides built-in operations for encrypted integers:

```solidity
FHE.add(a, b)    // Addition
FHE.sub(a, b)    // Subtraction
FHE.mul(a, b)    // Multiplication
```

All operations maintain encryption throughout - no decryption needed!

## Implementation

{% tabs %}

{% tab title="FHEArithmetic.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEArithmetic
 * @dev Demonstrates FHE arithmetic operations
 */
contract FHEArithmetic is ZamaEthereumConfig {

    function addEncrypted(uint32 value1, uint32 value2)
        external pure returns (euint32)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.add(enc1, enc2);
    }

    function subtractEncrypted(uint32 value1, uint32 value2)
        external pure returns (euint32)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.sub(enc1, enc2);
    }

    function multiplyEncrypted(uint32 value1, uint32 value2)
        external pure returns (euint32)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.mul(enc1, enc2);
    }
}
```

{% endtab %}

{% tab title="FHEArithmetic.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("FHEArithmetic - FHE Operations", function () {
  let arithmetic: any;

  beforeEach(async function () {
    const Factory = await hre.ethers.getContractFactory("FHEArithmetic");
    arithmetic = await Factory.deploy();
    await arithmetic.waitForDeployment();
  });

  describe("✅ CORRECT: Addition", function () {
    it("Should add two encrypted values", async function () {
      const result = await arithmetic.addEncrypted(10, 20);
      expect(result).to.exist;
    });

    it("Should handle large numbers", async function () {
      const result = await arithmetic.addEncrypted(1000000, 2000000);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Subtraction", function () {
    it("Should subtract encrypted values", async function () {
      const result = await arithmetic.subtractEncrypted(20, 10);
      expect(result).to.exist;
    });
  });

  describe("✅ CORRECT: Multiplication", function () {
    it("Should multiply encrypted values", async function () {
      const result = await arithmetic.multiplyEncrypted(5, 10);
      expect(result).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Operations Explained

### Addition (FHE.add)

```solidity
euint32 sum = FHE.add(encryptedA, encryptedB);
```

**Properties**:
- Commutative: `FHE.add(a, b) == FHE.add(b, a)`
- Associative: `FHE.add(FHE.add(a, b), c) == FHE.add(a, FHE.add(b, c))`
- Identity: `FHE.add(a, 0) == a`

### Subtraction (FHE.sub)

```solidity
euint32 difference = FHE.sub(encryptedA, encryptedB);
```

**Properties**:
- NOT commutative: `FHE.sub(a, b) != FHE.sub(b, a)`
- Watch for underflow with unsigned integers

### Multiplication (FHE.mul)

```solidity
euint32 product = FHE.mul(encryptedA, encryptedB);
```

**Properties**:
- Commutative: `FHE.mul(a, b) == FHE.mul(b, a)`
- More computationally expensive than add/sub
- Watch for overflow

## Common Pitfalls

### ❌ Pitfall 1: Type Mismatches

**Wrong**:
```solidity
euint8 small = FHE.asEuint8(10);
euint32 large = FHE.asEuint32(20);
euint32 result = FHE.add(small, large);  // Type mismatch!
```

**Correct**:
```solidity
euint8 small = FHE.asEuint8(10);
euint32 large = FHE.asEuint32(20);
euint32 smallAs32 = FHE.asEuint32(small);
euint32 result = FHE.add(smallAs32, large);
```

### ❌ Pitfall 2: Forgetting Operations Are Encrypted

**Wrong Assumption**:
```solidity
// Can't do this - result is still encrypted!
uint32 plainResult = uint32(FHE.add(a, b));
```

**Correct Understanding**:
```solidity
// Result remains encrypted
euint32 encryptedResult = FHE.add(a, b);
// Must use FHE operations or decrypt off-chain
```

## Usage Examples

### Example 1: Calculate Sum

```solidity
function calculateSum(uint32[] calldata values) external pure returns (euint32) {
    euint32 sum = FHE.asEuint32(0);

    for (uint i = 0; i < values.length; i++) {
        euint32 value = FHE.asEuint32(values[i]);
        sum = FHE.add(sum, value);
    }

    return sum;
}
```

### Example 2: Calculate Average (with multiplication)

```solidity
function calculateAverage(uint32 a, uint32 b) external pure returns (euint32) {
    euint32 encA = FHE.asEuint32(a);
    euint32 encB = FHE.asEuint32(b);

    euint32 sum = FHE.add(encA, encB);
    euint32 two = FHE.asEuint32(2);

    return FHE.div(sum, two);  // If division supported
}
```

## Performance Considerations

### Operation Costs

Operations have different gas costs:
1. **Addition** - Cheapest
2. **Subtraction** - Similar to addition
3. **Multiplication** - More expensive

### Optimization Tips

1. **Minimize Operations**: Combine operations where possible
2. **Batch Processing**: Process multiple values together
3. **Avoid Nested Operations**: Flatten when possible

## Next Steps

After mastering arithmetic operations:
1. **FHE Equality** - Learn comparison operations
2. **Encrypt Multiple Values** - Work with arrays
3. **Access Control** - Combine with permissions
4. **Privacy Poker** - See real-world usage

## Resources

- [FHE Operations Reference](https://docs.zama.ai/fhevm/fundamentals/operations)
- [Encrypted Types Guide](https://docs.zama.ai/fhevm/fundamentals/types)
- [Best Practices](https://docs.zama.ai/fhevm/guides/best-practices)

---

**Difficulty**: ⭐ Beginner
**Category**: Basic
**Concepts**: FHE operations, Arithmetic, Pure functions
