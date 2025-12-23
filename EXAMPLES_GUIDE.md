# FHEVM Examples - Complete Guide

This guide provides a comprehensive overview of all FHEVM examples included in this project, organized by difficulty and category.

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Example Categories](#example-categories)
- [Learning Path](#learning-path)
- [Example Details](#example-details)
- [Generation Tools](#generation-tools)

---

## 🚀 Quick Start

### Generate a Single Example

```bash
# Basic counter example
npm run create:fhe-counter

# Encryption example
npm run create:encrypt-single

# Gaming example
npm run create:privacy-poker
```

### Generate a Category Project

```bash
# All basic examples
npm run create-category:basic

# All encryption examples
npm run create-category:encryption

# All gaming examples
npm run create-category:gaming
```

### Generate Documentation

```bash
# All documentation
npm run generate-all-docs

# Single example documentation
npm run docs:fhe-counter
```

---

## 📂 Example Categories

### Category 1: Basic (3 Examples) ⭐

Perfect for beginners learning FHEVM fundamentals.

| Example | Difficulty | Key Concepts |
|---------|-----------|--------------|
| FHE Counter | ⭐ | Encrypted state, add/sub operations |
| FHE Arithmetic | ⭐ | FHE operations: add, sub, mul |
| FHE Equality | ⭐⭐ | Comparisons: eq, ne, gt, lt |

**Generate All Basic Examples**:
```bash
npm run create-category:basic
```

### Category 2: Encryption (2 Examples) ⭐⭐

Learn encryption patterns and permission management.

| Example | Difficulty | Key Concepts |
|---------|-----------|--------------|
| Encrypt Single Value | ⭐⭐ | Basic encryption, permissions |
| Encrypt Multiple Values | ⭐⭐ | Multiple values, struct handling |

**Generate All Encryption Examples**:
```bash
npm run create-category:encryption
```

### Category 3: Access Control (2 Examples) ⭐⭐⭐

Master advanced permission patterns.

| Example | Difficulty | Key Concepts |
|---------|-----------|--------------|
| Access Control | ⭐⭐⭐ | allowThis, allow, allowTransient |
| Input Proof | ⭐⭐⭐ | Proof validation, fromExternal |

**Generate All Access Control Examples**:
```bash
npm run create-category:access-control
```

### Category 4: Gaming (2 Examples) ⭐⭐⭐⭐

Real-world privacy-preserving gaming applications.

| Example | Difficulty | Key Concepts |
|---------|-----------|--------------|
| Simple Poker | ⭐⭐⭐ | Game state, basic poker logic |
| Privacy Poker | ⭐⭐⭐⭐ | Full game, complex state, multi-player |

**Generate All Gaming Examples**:
```bash
npm run create-category:gaming
```

---

## 🎓 Learning Path

### For Complete Beginners

1. **Start Here: FHE Counter** ⭐
   ```bash
   npm run create:fhe-counter
   ```
   - Learn: Encrypted types (euint32)
   - Learn: Basic permissions (allowThis, allow)
   - Learn: FHE operations (add, sub)

2. **Next: FHE Arithmetic** ⭐
   ```bash
   npm run create:fhe-arithmetic
   ```
   - Learn: More FHE operations (mul)
   - Practice: Working with encrypted types

3. **Then: Encrypt Single Value** ⭐⭐
   ```bash
   npm run create:encrypt-single
   ```
   - Learn: Encryption patterns
   - Learn: State management
   - Learn: Permission best practices

### For Intermediate Developers

4. **FHE Equality** ⭐⭐
   ```bash
   npm run create:fhe-equality
   ```
   - Learn: Comparison operations
   - Learn: Encrypted booleans (ebool)

5. **Encrypt Multiple Values** ⭐⭐
   ```bash
   npm run create:encrypt-multiple
   ```
   - Learn: Complex state structures
   - Learn: Multiple permission grants

6. **Access Control** ⭐⭐⭐
   ```bash
   npm run create:access-control
   ```
   - Learn: Advanced permissions
   - Learn: allowTransient pattern

### For Advanced Developers

7. **Input Proof** ⭐⭐⭐
   ```bash
   npm run create:input-proof
   ```
   - Learn: Input validation
   - Learn: Proof handling
   - Learn: External inputs

8. **Simple Poker** ⭐⭐⭐
   ```bash
   npm run create:simple-poker
   ```
   - Learn: Game state management
   - Learn: Multi-user scenarios
   - Apply: All previous concepts

9. **Privacy Poker** ⭐⭐⭐⭐
   ```bash
   npm run create:privacy-poker
   ```
   - Master: Complete FHE application
   - Master: Complex state transitions
   - Master: Production patterns

---

## 📖 Example Details

### 1. FHE Counter ⭐

**File**: `contracts/basic/FHECounter.sol`

**What It Does**:
- Maintains an encrypted counter
- Supports increment and decrement operations
- Demonstrates basic encrypted state management

**Key Code**:
```solidity
euint32 private _count;

function increment(uint32 value) external {
    euint32 encValue = FHE.asEuint32(value);
    _count = FHE.add(_count, encValue);
    FHE.allowThis(_count);
    FHE.allow(_count, msg.sender);
}
```

**Learn**:
- ✅ How to declare encrypted state
- ✅ Converting plaintext to encrypted (asEuint32)
- ✅ FHE addition/subtraction
- ✅ Permission management basics

**Generate**:
```bash
npm run create:fhe-counter
```

---

### 2. FHE Arithmetic ⭐

**File**: `contracts/basic/FHEArithmetic.sol`

**What It Does**:
- Demonstrates FHE arithmetic operations
- Shows add, subtract, multiply on encrypted values
- Pure functions for learning

**Key Code**:
```solidity
function addEncrypted(uint32 value1, uint32 value2) external pure returns (euint32) {
    euint32 enc1 = FHE.asEuint32(value1);
    euint32 enc2 = FHE.asEuint32(value2);
    return FHE.add(enc1, enc2);
}
```

**Learn**:
- ✅ FHE.add() operation
- ✅ FHE.sub() operation
- ✅ FHE.mul() operation
- ✅ Working with multiple encrypted values

**Generate**:
```bash
npm run create:fhe-arithmetic
```

---

### 3. FHE Equality ⭐⭐

**File**: `contracts/basic/FHEEquality.sol`

**What It Does**:
- Shows comparison operations on encrypted values
- Returns encrypted boolean results (ebool)
- Demonstrates all comparison operators

**Key Code**:
```solidity
function isEqual(uint32 value1, uint32 value2) external pure returns (ebool) {
    euint32 enc1 = FHE.asEuint32(value1);
    euint32 enc2 = FHE.asEuint32(value2);
    return FHE.eq(enc1, enc2);
}
```

**Learn**:
- ✅ FHE.eq() - Equality
- ✅ FHE.ne() - Not equal
- ✅ FHE.gt() - Greater than
- ✅ FHE.lt() - Less than
- ✅ Working with ebool type

**Generate**:
```bash
npm run create:fhe-equality
```

---

### 4. Encrypt Single Value ⭐⭐

**File**: `contracts/encryption/EncryptSingleValue.sol`

**What It Does**:
- Basic encryption pattern
- Store and retrieve encrypted values
- Proper permission management

**Key Code**:
```solidity
function storeSecret(uint32 secretValue) external {
    _encryptedSecret = FHE.asEuint32(secretValue);
    FHE.allowThis(_encryptedSecret);
    FHE.allow(_encryptedSecret, msg.sender);
}
```

**Learn**:
- ✅ Encryption best practices
- ✅ State storage patterns
- ✅ Why both permissions are needed

**Generate**:
```bash
npm run create:encrypt-single
```

---

### 5. Encrypt Multiple Values ⭐⭐

**File**: `contracts/encryption/EncryptMultipleValues.sol`

**What It Does**:
- Handle multiple encrypted values
- Use structs with encrypted fields
- Perform operations on stored values

**Key Code**:
```solidity
struct EncryptedPair {
    euint32 value1;
    euint32 value2;
}

function storeSecrets(uint32 secret1, uint32 secret2) external {
    euint32 enc1 = FHE.asEuint32(secret1);
    euint32 enc2 = FHE.asEuint32(secret2);

    _userSecrets[msg.sender] = EncryptedPair(enc1, enc2);

    FHE.allowThis(enc1);
    FHE.allow(enc1, msg.sender);
    FHE.allowThis(enc2);
    FHE.allow(enc2, msg.sender);
}
```

**Learn**:
- ✅ Encrypted structs
- ✅ Managing multiple encrypted values
- ✅ Mapping with encrypted values

**Generate**:
```bash
npm run create:encrypt-multiple
```

---

### 6. Access Control ⭐⭐⭐

**File**: `contracts/access-control/AccessControlExample.sol`

**What It Does**:
- Advanced permission patterns
- Shows allowThis, allow, allowTransient
- User authorization patterns

**Key Code**:
```solidity
function updateSecret(uint32 newValue) external {
    _secretValue = FHE.asEuint32(newValue);

    FHE.allowThis(_secretValue);      // Contract permission
    FHE.allow(_secretValue, msg.sender); // User permission
}

function setBalance(uint32 amount) external {
    euint32 balance = FHE.asEuint32(amount);
    _userBalances[msg.sender] = balance;

    FHE.allowThis(balance);
    FHE.allowTransient(balance, msg.sender); // Temporary permission
}
```

**Learn**:
- ✅ allowThis() vs allow()
- ✅ allowTransient() for temporary access
- ✅ When to use each permission type

**Generate**:
```bash
npm run create:access-control
```

---

### 7. Input Proof ⭐⭐⭐

**File**: `contracts/input-proof/InputProofExample.sol`

**What It Does**:
- Handle external encrypted inputs
- Validate input proofs
- Secure input processing

**Key Code**:
```solidity
function setValueWithProof(
    inEuint32 calldata encryptedInput
) external {
    euint32 value = FHE.asEuint32(encryptedInput);
    _userValues[msg.sender] = value;

    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

**Learn**:
- ✅ Input proof validation
- ✅ FHE.asEuint32(inEuint32) pattern
- ✅ External encrypted inputs

**Generate**:
```bash
npm run create:input-proof
```

---

### 8. Simple Poker ⭐⭐⭐

**File**: `contracts/PokerGameSimple.sol`

**What It Does**:
- Simplified poker game for learning
- Basic game state management
- Player actions with FHE

**Key Concepts**:
- Game lifecycle
- Player state tracking
- Encrypted decisions

**Generate**:
```bash
npm run create:simple-poker
```

---

### 9. Privacy Poker ⭐⭐⭐⭐

**File**: `contracts/PokerGame.sol`

**What It Does**:
- Full-featured privacy poker game
- Complete FHE integration
- Production-ready patterns

**Key Features**:
- 4 game types (Texas Hold'em, Five Card, Omaha, Seven Card)
- 2-8 players per game
- Encrypted cards, bets, and actions
- Complete game lifecycle management

**Generate**:
```bash
npm run create:privacy-poker
```

---

## 🛠️ Generation Tools

### Single Example Generation

**Command**:
```bash
ts-node automation/create-fhevm-example.ts <example-name> [output-dir]
```

**Available Examples**:
- `fhe-counter`
- `fhe-arithmetic`
- `fhe-equality`
- `encrypt-single-value`
- `encrypt-multiple-values`
- `access-control`
- `input-proof`
- `privacy-poker`
- `simple-poker`

**Example**:
```bash
ts-node automation/create-fhevm-example.ts fhe-counter ./my-counter
```

### Category-Based Generation

**Command**:
```bash
ts-node automation/create-fhevm-category.ts <category> [output-dir]
```

**Available Categories**:
- `basic` - 3 examples
- `encryption` - 2 examples
- `access-control` - 2 examples
- `gaming` - 2 examples

**Example**:
```bash
ts-node automation/create-fhevm-category.ts basic ./my-basic-examples
```

### Documentation Generation

**Command**:
```bash
ts-node automation/generate-docs.ts <example-name>
ts-node automation/generate-docs.ts --all
```

**Example**:
```bash
ts-node automation/generate-docs.ts fhe-counter
```

---

## 📊 Example Comparison Matrix

| Example | Difficulty | Encrypted Types | FHE Operations | Permissions | Input Proofs |
|---------|-----------|----------------|----------------|-------------|--------------|
| FHE Counter | ⭐ | euint32 | add, sub | ✓ | - |
| FHE Arithmetic | ⭐ | euint32 | add, sub, mul | - | - |
| FHE Equality | ⭐⭐ | euint32, ebool | eq, ne, gt, lt | - | - |
| Encrypt Single | ⭐⭐ | euint32 | - | ✓ | - |
| Encrypt Multiple | ⭐⭐ | euint32 | add | ✓ | - |
| Access Control | ⭐⭐⭐ | euint32 | - | ✓✓ | - |
| Input Proof | ⭐⭐⭐ | euint32 | add | ✓ | ✓ |
| Simple Poker | ⭐⭐⭐ | ebool, euint32 | eq, add, sub | ✓ | - |
| Privacy Poker | ⭐⭐⭐⭐ | ebool, euint32 | all | ✓✓ | ✓ |

---

## 🎯 Next Steps

1. **Start with Category Projects**: Generate all basic examples
   ```bash
   npm run create-category:basic
   ```

2. **Study the Code**: Read contracts and tests carefully

3. **Run Tests**: Understand correct and incorrect patterns
   ```bash
   cd output/basic-examples
   npm install
   npm test
   ```

4. **Modify Examples**: Experiment with the code

5. **Create Your Own**: Use the patterns learned

---

## 📚 Resources

- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Zama Community**: https://www.zama.ai/community
- **Discord Support**: https://discord.com/invite/zama
- **Developer Guide**: `DEVELOPER_GUIDE.md`

---

**Last Updated**: December 2025
**Total Examples**: 10
**Total Categories**: 4
**License**: BSD-3-Clause-Clear
