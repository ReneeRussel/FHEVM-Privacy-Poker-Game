# FHEVM Quick Reference Guide

Fast reference for common FHEVM patterns and operations.

---

## 🚀 Quick Start Commands

```bash
# Setup
npm install
npm run compile
npm run test

# Generate examples
npm run create:fhe-counter                    # Single example
npm run create-category:basic                 # Category (3 examples)

# Generate docs
npm run generate-all-docs

# Deploy
npm run deploy:sepolia
```

---

## 📚 Encrypted Types

| Type | Description | Example |
|------|-------------|---------|
| `ebool` | Encrypted boolean | `ebool flag = FHE.asEbool(true);` |
| `euint8` | Encrypted 8-bit uint | `euint8 small = FHE.asEuint8(42);` |
| `euint16` | Encrypted 16-bit uint | `euint16 medium = FHE.asEuint16(1000);` |
| `euint32` | Encrypted 32-bit uint | `euint32 large = FHE.asEuint32(1000000);` |
| `euint64` | Encrypted 64-bit uint | `euint64 huge = FHE.asEuint64(1000000000);` |

---

## 🔢 FHE Operations

### Arithmetic

```solidity
// Addition
euint32 sum = FHE.add(a, b);

// Subtraction
euint32 diff = FHE.sub(a, b);

// Multiplication
euint32 product = FHE.mul(a, b);

// Division (if available)
euint32 quotient = FHE.div(a, b);
```

### Comparison

```solidity
// Equality
ebool isEqual = FHE.eq(a, b);

// Not equal
ebool notEqual = FHE.ne(a, b);

// Greater than
ebool greater = FHE.gt(a, b);

// Less than
ebool less = FHE.lt(a, b);

// Greater or equal
ebool greaterOrEqual = FHE.ge(a, b);

// Less or equal
ebool lessOrEqual = FHE.le(a, b);
```

### Logical (ebool)

```solidity
// AND
ebool both = FHE.and(condition1, condition2);

// OR
ebool either = FHE.or(condition1, condition2);

// NOT
ebool opposite = FHE.not(condition);
```

### Conditional

```solidity
// Select based on condition
euint32 result = FHE.select(
    condition,      // ebool
    valueIfTrue,    // euint32
    valueIfFalse    // euint32
);
```

---

## 🔐 Permission Management

### The Critical Pattern

**ALWAYS grant BOTH permissions:**

```solidity
// Step 1: Encrypt value
euint32 encrypted = FHE.asEuint32(value);

// Step 2: Grant contract permission
FHE.allowThis(encrypted);

// Step 3: Grant user permission
FHE.allow(encrypted, msg.sender);
```

### Permission Types

```solidity
// Contract permission - REQUIRED
FHE.allowThis(value);

// User permission - for off-chain decryption
FHE.allow(value, userAddress);

// Transient permission - temporary access
FHE.allowTransient(value, userAddress);
```

---

## 📝 Common Patterns

### Pattern 1: Store Encrypted Value

```solidity
function storeValue(uint32 plainValue) external {
    euint32 encrypted = FHE.asEuint32(plainValue);
    _state = encrypted;

    FHE.allowThis(encrypted);
    FHE.allow(encrypted, msg.sender);
}
```

### Pattern 2: Update Encrypted Value

```solidity
function incrementValue(uint32 amount) external {
    euint32 encAmount = FHE.asEuint32(amount);
    _state = FHE.add(_state, encAmount);

    // Re-grant permissions!
    FHE.allowThis(_state);
    FHE.allow(_state, msg.sender);
}
```

### Pattern 3: Compare and Select

```solidity
function max(euint32 a, euint32 b) external pure returns (euint32) {
    ebool aGreater = FHE.gt(a, b);
    return FHE.select(aGreater, a, b);
}
```

### Pattern 4: Input Proof Handling

```solidity
function processInput(inEuint32 calldata input) external {
    euint32 value = FHE.asEuint32(input);
    _state = value;

    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

---

## ❌ Common Mistakes

### Mistake 1: Forgetting allowThis()

```solidity
// ❌ WRONG
function store(uint32 value) external {
    _state = FHE.asEuint32(value);
    FHE.allow(_state, msg.sender);  // Missing allowThis!
}

// ✅ CORRECT
function store(uint32 value) external {
    _state = FHE.asEuint32(value);
    FHE.allowThis(_state);          // Contract permission
    FHE.allow(_state, msg.sender);  // User permission
}
```

### Mistake 2: Using ebool in if Statement

```solidity
// ❌ WRONG
if (FHE.eq(a, b)) {  // ebool can't be used like this!
    // ...
}

// ✅ CORRECT
ebool condition = FHE.eq(a, b);
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);
```

### Mistake 3: Trying to Decrypt in Contract

```solidity
// ❌ WRONG
function getValue() external view returns (uint32) {
    return uint32(_encryptedValue);  // Can't decrypt!
}

// ✅ CORRECT
function getValue() external view returns (euint32) {
    return _encryptedValue;  // Return encrypted
}
```

### Mistake 4: Type Mismatches

```solidity
// ❌ WRONG
euint8 small = FHE.asEuint8(10);
euint32 large = FHE.asEuint32(20);
euint32 result = FHE.add(small, large);  // Type mismatch!

// ✅ CORRECT
euint8 small = FHE.asEuint8(10);
euint32 large = FHE.asEuint32(20);
euint32 smallAs32 = FHE.asEuint32(small);
euint32 result = FHE.add(smallAs32, large);
```

---

## 🎯 Example Cheat Sheet

### FHE Counter

```solidity
contract FHECounter is ZamaEthereumConfig {
    euint32 private _count;

    function increment(uint32 value) external {
        _count = FHE.add(_count, FHE.asEuint32(value));
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }
}
```

### Encrypted Balance

```solidity
contract BalanceTracker is ZamaEthereumConfig {
    mapping(address => euint32) private _balances;

    function deposit(uint32 amount) external {
        euint32 current = _balances[msg.sender];
        euint32 newBalance = FHE.add(current, FHE.asEuint32(amount));
        _balances[msg.sender] = newBalance;

        FHE.allowThis(newBalance);
        FHE.allow(newBalance, msg.sender);
    }
}
```

### Conditional Logic

```solidity
function updateIfGreater(uint32 newValue) external {
    euint32 encNew = FHE.asEuint32(newValue);
    ebool isGreater = FHE.gt(encNew, _current);

    _current = FHE.select(isGreater, encNew, _current);

    FHE.allowThis(_current);
    FHE.allow(_current, msg.sender);
}
```

---

## 📖 Contract Template

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title YourContract
 * @dev Description of your contract
 */
contract YourContract is ZamaEthereumConfig {
    // State variables
    euint32 private _encryptedState;

    // Events
    event StateUpdated(address indexed user);

    // Constructor
    constructor() {
        _encryptedState = FHE.asEuint32(0);
    }

    // Functions
    function updateState(uint32 newValue) external {
        _encryptedState = FHE.asEuint32(newValue);

        FHE.allowThis(_encryptedState);
        FHE.allow(_encryptedState, msg.sender);

        emit StateUpdated(msg.sender);
    }

    function getState() external view returns (euint32) {
        return _encryptedState;
    }
}
```

---

## 🧪 Test Template

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("YourContract", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();

    const Factory = await hre.ethers.getContractFactory("YourContract");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Basic Functionality", function () {
    it("Should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should update state", async function () {
      await contract.updateState(42);
      const state = await contract.getState();
      expect(state).to.exist;
    });
  });
});
```

---

## 🔗 Quick Links

- **Installation**: `npm install`
- **Compile**: `npm run compile`
- **Test**: `npm run test`
- **Generate Example**: `npm run create:fhe-counter`
- **Generate Docs**: `npm run generate-all-docs`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Main overview |
| `GETTING_STARTED.md` | 5-minute quick start |
| `EXAMPLES_GUIDE.md` | All examples explained |
| `DEVELOPER_GUIDE.md` | Development guide |
| `TOOLING_GUIDE.md` | Automation tools |

---

## 🆘 Troubleshooting

### Issue: "Module not found"
```bash
npm install
```

### Issue: "Compilation failed"
```bash
npm run clean
npm run compile
```

### Issue: "Tests fail"
```bash
# Check Node.js version
node --version  # Should be v20+
```

---

## 🎓 Learning Path

1. **FHE Counter** → Basic encrypted state
2. **FHE Arithmetic** → Operations on encrypted values
3. **Encrypt Single Value** → Permission management
4. **FHE Equality** → Comparison operations
5. **Access Control** → Advanced permissions
6. **Simple Poker** → Real-world application

---

**Quick Reference Version**: 1.0
**Last Updated**: December 2025
**License**: BSD-3-Clause-Clear
