# FHEVM Privacy Poker Game - Documentation

Welcome to the documentation for the Privacy Poker Game FHEVM example. This comprehensive guide covers all aspects of implementing privacy-preserving gaming applications using Fully Homomorphic Encryption.

## Quick Navigation

- **[Main Project README](../README.md)** - Project overview and features
- **[Developer Guide](../DEVELOPER_GUIDE.md)** - Development and contribution guide
- **[Privacy Poker Game](privacy-poker.md)** - Full-featured example
- **[Simple Poker Game](simple-poker.md)** - Learning-focused example
- **[Documentation Index](SUMMARY.md)** - Complete documentation structure

## Getting Started

### Installation

```bash
git clone <repository-url>
cd PokerGame
npm install
npm run compile
npm run test
```

### Generate Your Own Examples

```bash
# Create a standalone repository
npm run create-example:privacy-poker

# Generate documentation
npm run generate-all-docs
```

## What is FHEVM?

FHEVM (Fully Homomorphic Encryption Virtual Machine) by Zama enables:

- **Confidential Smart Contracts**: Execute logic on encrypted data
- **Privacy-Preserving Applications**: Build with zero-knowledge by default
- **Encrypted State**: Store sensitive data on-chain without exposure
- **Trustless Computation**: Verify results without exposing inputs

## Example Contents

### Contracts

1. **PokerGame.sol** - Full-featured privacy poker implementation
   - Complete game lifecycle
   - Advanced FHE patterns
   - Comprehensive access control

2. **PokerGameSimple.sol** - Simplified learning example
   - Basic concepts
   - Focused patterns
   - Educational value

### Tests

Comprehensive test suites demonstrating:

- ✅ **CORRECT** usage patterns
- ❌ **WRONG** patterns to avoid
- 🔐 **Security** best practices

### Automation Tools

1. **create-fhevm-example.ts** - Scaffolding CLI
   - Generate standalone repositories
   - Customize for your use case

2. **generate-docs.ts** - Documentation generator
   - GitBook-formatted output
   - Automatic index generation

## Key Concepts

### Encrypted Types

```solidity
ebool playerFolded;        // Boolean (true/false)
euint32 playerBet;         // 32-bit unsigned integer
ebool[] gameState;         // Arrays of encrypted values
```

### Access Control Pattern

```solidity
// CRITICAL: Always grant both permissions
FHE.allowThis(encryptedValue);          // Contract access
FHE.allow(encryptedValue, userAddress); // User access
```

### Common Operations

```solidity
// Comparisons
ebool isEqual = FHE.eq(value1, value2);
ebool isGreater = FHE.gt(value1, value2);

// Arithmetic
euint32 sum = FHE.add(value1, value2);
euint32 diff = FHE.sub(value1, value2);

// Conditional
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);
```

## Development Workflow

### 1. Understanding Patterns

Start with **Simple Poker Game** to learn:
- Basic encrypted types
- Access control
- Simple game logic

### 2. Advanced Implementation

Progress to **Privacy Poker Game** to explore:
- Complex state management
- Advanced access patterns
- Full game implementation

### 3. Creating Your Own

Use automation tools to generate your example:

```bash
ts-node automation/create-fhevm-example.ts privacy-poker ./my-example
cd ./my-example
npm install
npm run test
```

## Testing Your Examples

### Run All Tests

```bash
npm run test
```

### Run Specific Tests

```bash
npm run test test/PokerGame.test.ts
```

### Test File Structure

```typescript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup
  });

  it("✅ CORRECT: Should do X", async function () {
    // Correct usage
  });

  it("❌ WRONG: Should not do Y", async function () {
    // Error cases
  });

  it("🔐 Security: Should protect Z", async function () {
    // Security validation
  });
});
```

## Best Practices

### Smart Contract Development

1. **Always initialize encrypted values**
   ```solidity
   ebool status = FHE.asEbool(false);  // Good
   ebool status;                       // Bad - uninitialized
   ```

2. **Grant both permissions**
   ```solidity
   FHE.allowThis(value);
   FHE.allow(value, user);
   ```

3. **Use type-safe comparisons**
   ```solidity
   // Only compare same encrypted types
   ebool result = FHE.eq(euint32_a, euint32_b);  // Good
   ebool result = FHE.eq(euint32_a, euint8_b);   // Bad - type mismatch
   ```

### Testing

1. **Test both success and failure cases**
2. **Mark tests with ✅/❌/🔐 for clarity**
3. **Include descriptive comments**
4. **Test edge cases**

### Documentation

1. **Include JSDoc comments**
2. **Provide concrete examples**
3. **Highlight common pitfalls**
4. **Keep documentation up-to-date**

## Common Pitfalls

### Pitfall 1: Missing allowThis()

**Problem**: Only `FHE.allow()` without `FHE.allowThis()`

**Impact**: Contract cannot access its own encrypted values

**Solution**: Always use both permissions

### Pitfall 2: Type Mismatches

**Problem**: Comparing incompatible encrypted types

**Impact**: Compilation or runtime errors

**Solution**: Ensure types match before comparison

### Pitfall 3: Uninitialized Values

**Problem**: Using encrypted values before initialization

**Impact**: Unpredictable behavior

**Solution**: Always initialize with `FHE.asEbool()`, `FHE.asEuint32()`, etc.

### Pitfall 4: View Function Decryption

**Problem**: Attempting to decrypt in view functions

**Impact**: Cannot access encrypted values in view functions

**Solution**: Return encrypted handles, use off-chain decryption when needed

## Deployment

### Local Network

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Verification

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Resources

### Official Documentation

- **FHEVM Docs**: https://docs.zama.ai/fhevm
- **Zama Protocol**: https://docs.zama.org/protocol/examples
- **Hardhat Guide**: https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat

### Community

- **Discord**: https://discord.com/invite/zama
- **Forum**: https://www.zama.ai/community
- **GitHub**: https://github.com/zama-ai/fhevm

### Learning Resources

- FHEVM Fundamentals
- Solidity Programming
- Hardhat Development
- Smart Contract Security

## FAQ

### Q: Can I use this for production?

A: This is an example for learning. Always audit and test thoroughly before production deployment.

### Q: Can I modify the contracts?

A: Yes! The project is designed for learning and modification. Experiment freely.

### Q: How do I report bugs?

A: Please report issues through GitHub: https://github.com/zama-ai/fhevm-poker-examples/issues

### Q: Where can I get help?

A: Join the Zama Discord community for support and discussions.

## License

This project is licensed under BSD-3-Clause-Clear. See LICENSE file for details.

---

**Built with Fully Homomorphic Encryption by Zama**

For more information, visit: https://www.zama.ai/
