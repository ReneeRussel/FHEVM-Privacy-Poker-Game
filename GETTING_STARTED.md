# Getting Started with FHEVM Example Hub

Welcome! This guide will help you get up and running with the FHEVM Example Hub in minutes.

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** v20 or higher
- **npm** v10 or higher
- **Git** (for cloning)
- Basic understanding of Solidity

Check your versions:
```bash
node --version  # Should be v20+
npm --version   # Should be v10+
```

---

## 🚀 Quick Start (5 minutes)

### 1. Clone or Navigate to Project

```bash
cd D:\\\PokerGame
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Hardhat (development framework)
- FHEVM Solidity library
- Testing framework
- TypeScript and build tools

### 3. Compile Contracts

```bash
npm run compile
```

You should see output confirming compilation:
```
✓ Compiled successfully
```

### 4. Run Tests

```bash
npm run test
```

This runs all test suites and shows results.

### 5. Generate Your First Example

```bash
npm run create:fhe-counter
```

This generates a standalone FHE counter project in `./output/fhe-counter`

### 6. Explore the Output

```bash
cd output/fhe-counter
npm install
npm run test
```

**Congratulations!** You've successfully generated and tested your first FHEVM example! 🎉

---

## 📚 What's Next?

### Path A: Learn by Example

1. **Read the Examples Guide**
   ```bash
   cat EXAMPLES_GUIDE.md
   ```

2. **Generate All Basic Examples**
   ```bash
   npm run create-category:basic
   ```

3. **Study Each Example**
   - Read the contract code
   - Run the tests
   - Understand the patterns

### Path B: Develop Your Own

1. **Review Developer Guide**
   ```bash
   cat DEVELOPER_GUIDE.md
   ```

2. **Study a Simple Contract**
   ```bash
   cat contracts/basic/FHECounter.sol
   ```

3. **Review Test Patterns**
   ```bash
   cat test/basic/FHECounter.test.ts
   ```

4. **Create Your Own**
   - Copy an example
   - Modify it
   - Test it

### Path C: Deploy to Network

1. **Set Up Environment**
   ```bash
   # Set your private key (be careful!)
   npx hardhat vars set PRIVATE_KEY
   ```

2. **Deploy to Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

---

## 🛠️ Available Commands

### Compilation & Testing
```bash
npm run compile          # Compile contracts
npm run test            # Run all tests
npm run clean           # Clean build artifacts
npm run node            # Start local Hardhat node
```

### Generate Examples
```bash
# Single examples
npm run create:fhe-counter
npm run create:fhe-arithmetic
npm run create:fhe-equality
npm run create:encrypt-single
npm run create:encrypt-multiple
npm run create:access-control
npm run create:input-proof
npm run create:privacy-poker
npm run create:simple-poker

# Category projects
npm run create-category:basic
npm run create-category:encryption
npm run create-category:access-control
npm run create-category:gaming
```

### Generate Documentation
```bash
npm run generate-all-docs      # Generate all docs
npm run docs:fhe-counter       # Generate specific docs
npm run generate-docs          # Show help
```

### Deployment
```bash
npm run deploy                 # Deploy to default network
npm run deploy:localhost       # Deploy to local network
npm run deploy:sepolia         # Deploy to Sepolia testnet
```

### Help & Utilities
```bash
npm run help:create            # Show create-example help
npm run help:category          # Show create-category help
npm run help:docs              # Show generate-docs help
npm run format                 # Format code
npm run lint                   # Lint code
```

---

## 📁 Project Structure

```
PokerGame/
│
├── base-template/              # Base Hardhat template
│   ├── contracts/Example.sol
│   ├── test/Example.test.ts
│   ├── scripts/deploy.js
│   └── package.json
│
├── contracts/                  # All example contracts
│   ├── basic/                 # Basic FHE operations
│   ├── encryption/            # Encryption patterns
│   ├── access-control/        # Access control
│   ├── input-proof/           # Input proofs
│   ├── PokerGame.sol          # Advanced gaming
│   └── PokerGameSimple.sol    # Learning version
│
├── test/                       # Test suites
│   ├── basic/
│   ├── encryption/
│   ├── access-control/
│   ├── input-proof/
│   ├── PokerGame.test.ts
│   └── PokerGameSimple.test.ts
│
├── automation/                 # CLI tools
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   └── generate-docs.ts
│
├── docs/                       # Generated documentation
│   ├── README.md
│   ├── SUMMARY.md
│   └── *.md files
│
├── output/                     # Generated projects (created by tools)
│   ├── fhe-counter/
│   ├── basic-examples/
│   └── ...
│
└── [Documentation files]
    ├── README.md
    ├── DEVELOPER_GUIDE.md
    ├── EXAMPLES_GUIDE.md
    ├── GETTING_STARTED.md (this file)
    └── ... more guides
```

---

## 🎓 Learning Resources

### Start Here
1. **This Guide** (GETTING_STARTED.md) - What you're reading now
2. **EXAMPLES_GUIDE.md** - Overview of all examples
3. **FHE Counter Example** - Simplest example to learn from

### Going Deeper
4. **DEVELOPER_GUIDE.md** - Development best practices
5. **Code Comments** - Study the contracts
6. **Test Files** - Learn patterns from tests

### Official Resources
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Zama Community](https://www.zama.ai/community)
- [Discord](https://discord.com/invite/zama)

---

## 🔑 Key Concepts

### What is FHEVM?

FHEVM (Fully Homomorphic Encryption Virtual Machine) enables:
- **Encrypted Data**: Values stored and computed on-chain while encrypted
- **Privacy**: No decryption needed for computations
- **Smart Contracts**: Logic on encrypted data
- **Trustless**: Users verify results without exposing inputs

### Encrypted Types

```solidity
ebool    // Encrypted boolean (true/false)
euint8   // Encrypted 8-bit unsigned integer
euint16  // Encrypted 16-bit unsigned integer
euint32  // Encrypted 32-bit unsigned integer
euint64  // Encrypted 64-bit unsigned integer
```

### FHE Operations

```solidity
// Arithmetic
FHE.add(a, b)      // Addition
FHE.sub(a, b)      // Subtraction
FHE.mul(a, b)      // Multiplication

// Comparison
FHE.eq(a, b)       // Equal
FHE.ne(a, b)       // Not equal
FHE.gt(a, b)       // Greater than
FHE.lt(a, b)       // Less than
FHE.ge(a, b)       // Greater or equal
FHE.le(a, b)       // Less or equal

// Conditional
FHE.select(condition, valueIfTrue, valueIfFalse)
```

### Permission Management

**Critical Pattern - ALWAYS DO BOTH:**

```solidity
FHE.allowThis(value);        // Grant contract permission
FHE.allow(value, user);      // Grant user permission
```

Forgetting `allowThis()` is the most common mistake!

---

## 🐛 Troubleshooting

### Issue: "Module not found" error

**Solution**: Install dependencies
```bash
npm install
```

### Issue: Compilation fails

**Solution**: Clean and recompile
```bash
npm run clean
npm run compile
```

### Issue: Tests fail

**Solution**: Check your Node.js version
```bash
node --version  # Should be v20+
```

If not, update Node.js.

### Issue: Cannot find base-template

**Solution**: Ensure you're in the project root directory
```bash
pwd  # Should show PokerGame directory
ls base-template/  # Should show template files
```

### Issue: "Permission denied" when running scripts

**Solution**: Make scripts executable
```bash
chmod +x automation/*.ts
```

---

## ✨ Your First Changes

### Modify FHE Counter

1. **Generate the example**
   ```bash
   npm run create:fhe-counter
   cd output/fhe-counter
   ```

2. **Edit the contract**
   ```bash
   # Open contracts/FHECounter.sol
   # Change initial value from 0 to 100
   ```

3. **Recompile and test**
   ```bash
   npm run compile
   npm run test
   ```

4. **See your changes work!**

---

## 📊 Project Statistics

| Item | Count |
|------|-------|
| Example Contracts | 10 |
| Test Suites | 10 |
| Test Cases | 200+ |
| Automation Tools | 2 |
| Documentation Files | 15+ |
| Total Lines of Code | 10,000+ |

---

## 🎯 Next Steps

### Short Term (Today)
1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Generate first example
4. ✅ Read EXAMPLES_GUIDE.md

### Medium Term (This Week)
1. Generate all basic examples
2. Study each example
3. Modify examples
4. Run all tests

### Long Term (This Month)
1. Read DEVELOPER_GUIDE.md
2. Understand all patterns
3. Create your own examples
4. Deploy to testnet

---

## 💡 Tips & Tricks

### Tip 1: Use npm Scripts
Instead of long command lines, use npm scripts:
```bash
npm run create:fhe-counter  # Instead of long ts-node command
```

### Tip 2: Start Simple
Begin with FHE Counter, not Privacy Poker!

### Tip 3: Read Tests
Test files show correct and incorrect patterns:
```bash
cat test/basic/FHECounter.test.ts  # Look for ✅ and ❌ markers
```

### Tip 4: Use Categories
Generate all examples in a category:
```bash
npm run create-category:basic  # Get all 3 basic examples
```

### Tip 5: Keep the Base Template
Don't modify base-template/. It's used to generate new projects!

---

## 🤝 Get Help

### Resources
- **DEVELOPER_GUIDE.md** - Detailed development guide
- **EXAMPLES_GUIDE.md** - All examples explained
- **Code Comments** - Read the contracts
- **Test Files** - See patterns in action

### Community
- **Discord**: https://discord.com/invite/zama
- **Forum**: https://www.zama.ai/community
- **Docs**: https://docs.zama.ai/fhevm

---

## 📝 Summary

You now know:
- ✅ How to set up the project
- ✅ How to compile and test
- ✅ How to generate examples
- ✅ Where to find documentation
- ✅ Basic FHEVM concepts
- ✅ How to get help

**Ready to learn FHEVM? Start with EXAMPLES_GUIDE.md!**

---

**Last Updated**: December 2025
**License**: BSD-3-Clause-Clear
**Questions?** Check DEVELOPER_GUIDE.md or join our Discord!
