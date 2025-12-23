# FHEVM Privacy Poker Game - Complete Example Hub

A comprehensive, standalone FHEVM example repository demonstrating privacy-preserving smart contracts through a real-world gaming application. This submission fulfills all requirements of the Zama Bounty Program Challenge: "Build The FHEVM Example Hub."

[FHEVM Privacy Poker Game.mp4](https://youtu.be/eW3eDEPCXlM)

[Live Demo](https://fhevm-privacy-poker-game.vercel.app/)

## Project Overview

The Privacy Poker Game serves as a complete learning hub for FHEVM development, featuring:

- **Standalone Hardhat-Based Repository**: Self-contained, minimal, focused design
- **Automated Example Generation**: CLI tools for scaffolding new repositories
- **Multiple Example Implementations**: Full-featured and learning-focused versions
- **Comprehensive Documentation**: Auto-generated GitBook-compatible guides
- **50+ Test Cases**: Demonstrating correct usage, pitfalls, and security patterns
- **Production-Ready Tools**: Complete automation for maintenance and updates

## Bounty Challenge Fulfillment

### Requirement 1: Project Structure & Simplicity ✅

**Implementation**:
- Single Hardhat-based repository (no monorepo)
- Minimal project structure with clear organization
- Uses only `@fhevm/solidity` and `@openzeppelin/contracts`
- Clean separation: contracts/, test/, automation/, docs/

### Requirement 2: Scaffolding / Automation ✅

**`create-fhevm-example.ts`** - Repository Generator
```bash
# Generate standalone example
ts-node automation/create-fhevm-example.ts privacy-poker ./output/my-example

# Next steps
cd ./output/my-example
npm install
npm run compile
npm run test
```

Features:
- Clones and customizes base Hardhat template
- Inserts specific Solidity contract into contracts/
- Copies matching test files
- Auto-generates README.md with setup instructions
- Updates hardhat.config, package.json, deploy scripts
- Provides comprehensive colored terminal output

**`generate-docs.ts`** - Documentation Generator
```bash
# Generate single example documentation
ts-node automation/generate-docs.ts privacy-poker

# Generate all examples
ts-node automation/generate-docs.ts --all
```

Features:
- Extracts contract and test code
- Generates GitBook-formatted markdown with tabs
- Auto-generates SUMMARY.md index
- Organizes documentation by category
- Fully automated pipeline

### Requirement 3: Multiple Example Types ✅

**Implemented Examples**:

#### 1. Privacy Poker Game (Advanced)
- Full-featured game with encrypted state
- Complex FHE operations: `FHE.eq()`, `FHE.gt()`, `FHE.add()`, `FHE.sub()`
- Encrypted types: `ebool` arrays, `euint32` values
- Advanced access control patterns
- Real-world gaming application

**Concepts Demonstrated**:
- Encrypted card dealing and betting
- Confidential player actions (call, raise, fold)
- Secure hand comparison
- FHE.allow() and FHE.allowThis() permissions
- State management with encrypted values
- Game lifecycle management

#### 2. Simple Poker Game (Learning-Focused)
- Simplified implementation for beginners
- Basic encrypted types and operations
- Focus on understanding core patterns
- Progressive learning path
- Educational comments throughout

**Core Patterns Demonstrated**:
- Basic ebool and euint32 usage
- Input proof handling: `FHE.fromExternal()`
- Permission management fundamentals
- Simple game state tracking
- Type conversions and comparisons

#### 3. Beyond Requirements - Additional Coverage

The submission also demonstrates patterns for:
- **Access Control**: `FHE.allowThis()` and `FHE.allow()` best practices
- **Input Proofs**: Proper use of `externalEuint32` and validation
- **Type Safety**: Comparing and converting encrypted types
- **Error Handling**: Common pitfalls and prevention strategies
- **State Management**: Encrypted mappings, arrays, and structures

### Requirement 4: Documentation Strategy ✅

**Code-Level Documentation**:
- Comprehensive JSDoc/NatSpec comments
- Inline explanations of FHEVM patterns
- Examples of correct and incorrect usage
- Security considerations highlighted

**Auto-Generated Documentation**:
```bash
npm run generate-all-docs
```

Output includes:
- GitBook-compatible markdown format
- Tabbed interface showing Contract | Test
- Common pitfalls section with solutions
- Automatic SUMMARY.md index generation
- Category-based organization

**Developer Guide**: `DEVELOPER_GUIDE.md`
- 400+ lines covering all aspects
- FHEVM pattern explanations
- Testing best practices
- Deployment procedures
- Common pitfalls and solutions
- FAQ section

**Project Documentation**:
- `README.md` - Project overview (this file)
- `docs/privacy-poker.md` - Full example documentation
- `docs/simple-poker.md` - Simple example documentation
- `docs/SUMMARY.md` - Documentation index
- `BOUNTY_SUBMISSION.md` - Complete submission details

## Key Features & Bonus Points

### Creative Examples ⭐

Poker game demonstrates creative FHEVM application:
- Complex game logic with privacy
- Real-world use case (gaming)
- Scalable to other card games (Blackjack, Baccarat, etc.)
- Professional gaming experience

### Advanced Patterns ⭐

Sophisticated FHE implementations:
- Encrypted state arrays and structures
- Multi-level permission management
- Complex game state transitions
- Provable fairness mechanisms

### Clean Automation ⭐

Professional TypeScript automation tools:
- Color-coded terminal output
- Comprehensive error handling
- Progress indicators
- Built-in help documentation
- npm script integration

### Comprehensive Documentation ⭐

Professional-grade docs:
- 50+ detailed test cases
- Clear learning progression (simple → advanced)
- Pitfall explanations with solutions
- GitBook integration ready
- Auto-generated index

### Testing Coverage ⭐

Extensive test suite:
- ✅ Correct usage patterns
- ❌ Common mistakes explained
- 🔐 Security best practices
- Edge cases and error conditions
- Real-world gaming scenarios

### Maintenance Tools ⭐

Long-term sustainability:
- Automated documentation generation
- Scaffolding for new examples
- Consistent project structure
- Dependency management
- Version-agnostic design

## Technology Stack

### Blockchain Layer
- **Solidity**: ^0.8.24 (compatible)
- **FHEVM**: @fhevm/solidity ^0.7.0
- **OpenZeppelin**: @openzeppelin/contracts ^5.1.0
- **Hardhat**: ^2.24.3 (development framework)

### Build & Testing
- **TypeScript**: ^5.0.0
- **ts-node**: ^10.9.0
- **Hardhat Plugin**: @fhevm/hardhat-plugin 0.0.1-3

### Automation & Documentation
- **Custom CLI Tools**: TypeScript-based scaffolding
- **GitBook Compatible**: Markdown documentation
- **npm Scripts**: Integrated automation commands

## Quick Start

### Installation
```bash
git clone <repository>
cd PokerGame
npm install
```

### Compilation & Testing
```bash
npm run compile
npm run test
```

### Generate Standalone Examples
```bash
# Privacy Poker (full-featured)
npm run create-example:privacy-poker

# Simple Poker (learning-focused)
npm run create-example:simple-poker

# Custom example
ts-node automation/create-fhevm-example.ts privacy-poker ./my-poker-example
```

### Generate Documentation
```bash
# Single example
npm run generate-docs:privacy-poker

# All examples
npm run generate-all-docs
```

### Deployment
```bash
# Local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

## Project Structure

```
PokerGame/
├── contracts/                           # Smart contracts
│   ├── PokerGame.sol                   # Full-featured implementation
│   └── PokerGameSimple.sol             # Learning-focused version
│
├── test/                                # Test suites
│   ├── PokerGame.test.ts               # 50+ comprehensive tests
│   └── PokerGameSimple.test.ts         # Simplified tests
│
├── automation/                          # Scaffolding & documentation
│   ├── create-fhevm-example.ts         # Repository generator
│   └── generate-docs.ts                # Documentation generator
│
├── docs/                                # Generated documentation
│   ├── README.md                       # Documentation home
│   ├── SUMMARY.md                      # Index
│   ├── privacy-poker.md                # Full example docs
│   └── simple-poker.md                 # Simple example docs
│
├── scripts/                             # Deployment
│   └── deploy.js                       # Hardhat deployment
│
├── DEVELOPER_GUIDE.md                  # Development guide
├── BOUNTY_SUBMISSION.md                # Bounty details
├── README.md                           # This file
├── hardhat.config.cjs                  # Hardhat configuration
└── package.json                        # Dependencies & scripts
```

## FHEVM Concepts Demonstrated

### Encrypted Types
```solidity
ebool playerFolded;                // Encrypted boolean
euint32 playerBet;                 // Encrypted 32-bit integer
ebool[] encryptedCards;            // Arrays of encrypted values
```

### Access Control Pattern
```solidity
// CRITICAL: Always grant both permissions
FHE.allowThis(encryptedValue);     // Contract access
FHE.allow(encryptedValue, user);   // User access
```

### FHE Operations
```solidity
ebool isEqual = FHE.eq(a, b);      // Equality comparison
euint32 sum = FHE.add(a, b);       // Encrypted addition
euint32 result = FHE.select(condition, trueVal, falseVal);
```

### Input Proofs
```solidity
function makeMove(
    externalEuint32 encryptedBet,
    bytes calldata inputProof
) external {
    // Convert and verify external input
    euint32 bet = FHE.fromExternal(encryptedBet, inputProof);
    // Use encrypted value
}
```

## Testing

### Run All Tests
```bash
npm run test
```

### Test Organization

Tests are organized by functionality with clear markers:

- **✅ CORRECT** - Shows proper FHEVM patterns to follow
- **❌ WRONG** - Demonstrates common pitfalls to avoid
- **🔐 SECURITY** - Highlights security considerations

### Test Categories

1. **Deployment Tests** - Contract initialization
2. **Game Creation Tests** - Game setup and validation
3. **Player Joining Tests** - Join mechanics and constraints
4. **Player Moves Tests** - Move recording and game updates
5. **Card Revealing Tests** - Card revelation mechanism
6. **Game Information Tests** - Data retrieval functions
7. **Access Control Tests** - Permission management
8. **FHE Pattern Tests** - Encryption and decryption
9. **Emergency Functions Tests** - Safety mechanisms

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Missing allowThis()
```solidity
// WRONG - Only grants user permission
_count = FHE.asEuint32(value);
FHE.allow(_count, msg.sender);     // Contract can't access!

// CORRECT - Grant both permissions
_count = FHE.asEuint32(value);
FHE.allowThis(_count);             // Contract access
FHE.allow(_count, msg.sender);     // User access
```

### ❌ Pitfall 2: Returning Encrypted Values from View Functions
```solidity
// WRONG - Can't decrypt in view function
function getBet() external view returns (uint32) {
    return _encryptedBet;           // Type mismatch!
}

// CORRECT - Return encrypted handle
function getBet() external view returns (euint32) {
    return _encryptedBet;           // Returns handle
}
```

### ❌ Pitfall 3: Type Mismatches
```solidity
// WRONG - Different encrypted types
ebool result = FHE.eq(euint8Value, euint32Value);

// CORRECT - Same types
euint32 value = FHE.cast(euint8Value, "euint32");
ebool result = FHE.eq(value, euint32Value);
```

## npm Scripts

```bash
# Core development
npm run compile              # Compile contracts
npm run test                # Run all tests
npm run clean              # Clean build artifacts

# Automation
npm run create-example     # Show example creation help
npm run create-example:privacy-poker  # Generate privacy-poker
npm run generate-docs      # Show docs generation help
npm run generate-all-docs  # Generate all documentation

# Deployment
npm run deploy             # Deploy to default network
npm run deploy:sepolia     # Deploy to Sepolia testnet
npm run deploy:localhost   # Deploy to local network

# Development
npm run node               # Start local Hardhat node
npm run serve              # Start HTTP server

# Help & utilities
npm run help:create        # Show create-example help
npm run help:docs          # Show generate-docs help
```

## Automation Tools Documentation

### create-fhevm-example.ts
Generates standalone repositories for individual examples.

```bash
ts-node automation/create-fhevm-example.ts <example-name> [output-dir]

# Examples:
ts-node automation/create-fhevm-example.ts privacy-poker ./my-poker
ts-node automation/create-fhevm-example.ts simple-poker ./learning-poker
```

Performs:
1. Clones base template structure
2. Inserts specific contract
3. Copies matching tests
4. Updates configuration files
5. Generates README.md
6. Provides colored progress output

### generate-docs.ts
Generates GitBook-formatted documentation.

```bash
ts-node automation/generate-docs.ts <example-name>
ts-node automation/generate-docs.ts --all

# Examples:
ts-node automation/generate-docs.ts privacy-poker
ts-node automation/generate-docs.ts --all
```

Performs:
1. Extracts contract and test code
2. Generates GitBook-formatted markdown
3. Creates tabbed interface (Contract | Test)
4. Updates SUMMARY.md index
5. Organizes by category

## Development Workflow

### Adding New Examples

1. Create contract: `contracts/YourExample.sol`
2. Create tests: `test/YourExample.test.ts`
3. Update `create-fhevm-example.ts` EXAMPLES_MAP
4. Update `generate-docs.ts` EXAMPLES_CONFIG
5. Generate documentation: `npm run generate-docs`
6. Test generation: `npm run create-example`

### Contributing

1. Follow existing code style
2. Add comprehensive comments
3. Include test cases (correct & incorrect)
4. Update documentation
5. Test standalone generation

## Deployment Guide

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet
```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat run scripts/deploy.js --network sepolia
```

### Verification
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Resources

### Official Documentation
- **FHEVM Docs**: https://docs.zama.ai/fhevm
- **FHEVM Protocol**: https://docs.zama.org/protocol/examples
- **Hardhat Guide**: https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat
- **Zama Developer Program**: https://guild.xyz/zama/bounty-program

### Community & Support
- **Discord**: https://discord.com/invite/zama
- **Community Forum**: https://www.zama.ai/community
- **GitHub Issues**: https://github.com/zama-ai/fhevm-poker-examples/issues

### Learning Resources
- FHEVM Fundamentals
- Solidity Best Practices
- Smart Contract Security
- Hardhat Development Guide

## FAQ

**Q: Can I use this in production?**
A: This is an example for learning. Always audit and test thoroughly before production.

**Q: Can I modify the contracts?**
A: Yes! The project is designed for experimentation and learning.

**Q: How do I report bugs?**
A: Please open an issue on GitHub with detailed information.

**Q: Can I create my own examples?**
A: Absolutely! Use the automation tools to scaffold new examples.

**Q: What if I have questions?**
A: Join the Zama Discord community for support and discussions.

## Security Considerations

This is an educational example. For production use:

1. **Conduct thorough security audits**
2. **Test on testnet extensively**
3. **Review all FHEVM operations**
4. **Validate access control patterns**
5. **Consider gas optimization**
6. **Implement additional safeguards**

## Future Enhancements

Extensibility examples:
- Additional poker variants (Omaha, 7-Card Stud)
- Other card games (Blackjack, Baccarat)
- Tournament structures
- Player ranking systems
- Cross-chain compatibility
- Enhanced UI components

## License

BSD-3-Clause-Clear - See LICENSE file for details

## Acknowledgments

Built with [FHEVM](https://github.com/zama-ai/fhevm) by [Zama](https://www.zama.ai/)

This project is part of the Zama Bounty Program Challenge: Build The FHEVM Example Hub (December 2025)

---

**For more information:**
- Project Documentation: See `docs/` directory
- Developer Guide: See `DEVELOPER_GUIDE.md`
- Bounty Details: See `BOUNTY_SUBMISSION.md`
- GitHub: https://github.com/zama-ai/fhevm-poker-examples

**Submission Information:**
- Challenge: Build The FHEVM Example Hub
- Period: December 2025
- Prize Pool: $10,000
- Status: Complete ✅

---

**Built with ❤️ using Fully Homomorphic Encryption**
