# FHE Comparison Operations

This example demonstrates comparison operations on encrypted values, returning encrypted boolean results.

## Overview

FHE Equality shows:
- **Equality Checks**: Compare if encrypted values are equal
- **Inequality Checks**: Check if values are not equal
- **Greater/Less Than**: Order comparisons on encrypted values
- **Encrypted Booleans**: Working with `ebool` type

{% hint style="info" %}
**Key Insight**: Comparison results are also encrypted! You get back an `ebool`, not a plain `bool`.
{% endhint %}

## Implementation

{% tabs %}

{% tab title="FHEEquality.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEEquality
 * @dev Demonstrates FHE comparison operations
 */
contract FHEEquality is ZamaEthereumConfig {

    function isEqual(uint32 value1, uint32 value2)
        external pure returns (ebool)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.eq(enc1, enc2);
    }

    function isNotEqual(uint32 value1, uint32 value2)
        external pure returns (ebool)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.ne(enc1, enc2);
    }

    function isGreaterThan(uint32 value1, uint32 value2)
        external pure returns (ebool)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.gt(enc1, enc2);
    }

    function isLessThan(uint32 value1, uint32 value2)
        external pure returns (ebool)
    {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.lt(enc1, enc2);
    }
}
```

{% endtab %}

{% tab title="FHEEquality.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("FHEEquality - FHE Comparisons", function () {
  let equality: any;

  beforeEach(async function () {
    const Factory = await hre.ethers.getContractFactory("FHEEquality");
    equality = await Factory.deploy();
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
  });

  describe("✅ CORRECT: Order Comparisons", function () {
    it("Should check greater than", async function () {
      const result = await equality.isGreaterThan(100, 50);
      expect(result).to.exist;
    });

    it("Should check less than", async function () {
      const result = await equality.isLessThan(30, 60);
      expect(result).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Comparison Operations

### Available Operations

| Operation | Function | Description |
|-----------|----------|-------------|
| Equal | `FHE.eq(a, b)` | Returns encrypted true if a == b |
| Not Equal | `FHE.ne(a, b)` | Returns encrypted true if a != b |
| Greater Than | `FHE.gt(a, b)` | Returns encrypted true if a > b |
| Less Than | `FHE.lt(a, b)` | Returns encrypted true if a < b |
| Greater or Equal | `FHE.ge(a, b)` | Returns encrypted true if a >= b |
| Less or Equal | `FHE.le(a, b)` | Returns encrypted true if a <= b |

### Return Type: ebool

All comparison operations return `ebool` (encrypted boolean):

```solidity
ebool result = FHE.eq(a, b);  // Encrypted boolean
```

You cannot directly use `ebool` in `if` statements:

```solidity
// ❌ WRONG - This won't work!
if (FHE.eq(a, b)) {
    // ...
}

// ✅ CORRECT - Use FHE.select for conditional logic
euint32 result = FHE.select(
    FHE.eq(a, b),
    valueIfTrue,
    valueIfFalse
);
```

## Common Pitfalls

### ❌ Pitfall 1: Using ebool in if Statements

**Wrong**:
```solidity
function checkValue(euint32 encrypted) external pure returns (string memory) {
    if (FHE.gt(encrypted, FHE.asEuint32(100))) {
        return "Greater than 100";
    }
    return "Less or equal to 100";
}
```

**Correct**:
```solidity
function checkValue(euint32 encrypted) external pure returns (euint32) {
    ebool condition = FHE.gt(encrypted, FHE.asEuint32(100));

    return FHE.select(
        condition,
        FHE.asEuint32(1),  // Return 1 if true
        FHE.asEuint32(0)   // Return 0 if false
    );
}
```

### ❌ Pitfall 2: Converting ebool to bool

**Wrong**:
```solidity
bool plainResult = bool(FHE.eq(a, b));  // Can't do this!
```

**Correct**:
```solidity
ebool encryptedResult = FHE.eq(a, b);
// Keep it encrypted or use FHE.select
```

## Usage Examples

### Example 1: Find Maximum

```solidity
function max(uint32 a, uint32 b) external pure returns (euint32) {
    euint32 encA = FHE.asEuint32(a);
    euint32 encB = FHE.asEuint32(b);

    ebool aGreaterThanB = FHE.gt(encA, encB);

    return FHE.select(aGreaterThanB, encA, encB);
}
```

### Example 2: Range Check

```solidity
function isInRange(uint32 value, uint32 min, uint32 max)
    external pure returns (ebool)
{
    euint32 encValue = FHE.asEuint32(value);
    euint32 encMin = FHE.asEuint32(min);
    euint32 encMax = FHE.asEuint32(max);

    ebool greaterThanMin = FHE.ge(encValue, encMin);
    ebool lessThanMax = FHE.le(encValue, encMax);

    return FHE.and(greaterThanMin, lessThanMax);
}
```

### Example 3: Conditional Update

```solidity
function conditionalUpdate(euint32 currentValue, uint32 newValue)
    external pure returns (euint32)
{
    euint32 encNew = FHE.asEuint32(newValue);

    // Only update if new value is greater
    ebool shouldUpdate = FHE.gt(encNew, currentValue);

    return FHE.select(shouldUpdate, encNew, currentValue);
}
```

## Logical Operations

You can combine comparisons with logical operations:

```solidity
// AND
ebool both = FHE.and(condition1, condition2);

// OR
ebool either = FHE.or(condition1, condition2);

// NOT
ebool opposite = FHE.not(condition);
```

## Performance Notes

### Gas Costs

Comparison operations have moderate gas costs:
- **eq, ne**: Similar cost to arithmetic
- **gt, lt, ge, le**: Slightly more expensive
- **Chained comparisons**: Cost accumulates

### Optimization Tips

1. **Minimize Comparisons**: Cache results when possible
2. **Use Appropriate Types**: Don't use euint256 if euint32 suffices
3. **Combine Conditions**: Use FHE.and/FHE.or efficiently

## Real-World Use Cases

### 1. Auction Systems
```solidity
// Check if bid is highest without revealing amounts
ebool isHighestBid = FHE.gt(newBid, currentHighestBid);
```

### 2. Access Control
```solidity
// Check if balance is sufficient
ebool hasSufficientBalance = FHE.ge(userBalance, requiredAmount);
```

### 3. Gaming
```solidity
// Check if player wins (higher card)
ebool playerWins = FHE.gt(playerCard, dealerCard);
```

## Next Steps

After mastering comparisons:
1. **Encrypt Single Value** - Store comparison results
2. **Access Control** - Use comparisons for permissions
3. **Simple Poker** - See comparisons in gaming context
4. **Privacy Poker** - Advanced comparison usage

## Resources

- [FHE Operations](https://docs.zama.ai/fhevm/fundamentals/operations)
- [Encrypted Booleans](https://docs.zama.ai/fhevm/fundamentals/types)
- [FHE.select Documentation](https://docs.zama.ai/fhevm/fundamentals/conditional)

---

**Difficulty**: ⭐⭐ Beginner-Intermediate
**Category**: Basic
**Concepts**: Comparisons, ebool, Conditional logic
