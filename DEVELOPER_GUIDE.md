# Developer Guide - Privacy Poker Game

This guide covers developing, testing, and deploying the Privacy Poker Game FHEVM example.

## Table of Contents

- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Working with FHEVM](#working-with-fhevm)
- [Running Tests](#running-tests)
- [Automation Tools](#automation-tools)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Development Environment

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Hardhat**: Latest version
- **Solidity**: v0.8.24 or compatible

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile contracts:
   ```bash
   npm run compile
   ```

4. Verify setup:
   ```bash
   npm run test
   ```

## Project Structure

```
PokerGame/
├── contracts/
│   ├── PokerGame.sol              # Main poker game with FHE
│   └── PokerGameSimple.sol        # Simplified learning example
│
├── test/
│   ├── PokerGame.test.ts          # Main contract tests
│   └── PokerGameSimple.test.ts    # Simple version tests
│
├── automation/
│   ├── create-fhevm-example.ts    # Scaffolding CLI tool
│   └── generate-docs.ts           # Documentation generator
│
├── docs/
│   ├── README.md                  # Documentation home
│   ├── DEVELOPER_GUIDE.md         # This file
│   ├── SUMMARY.md                 # Documentation index
│   ├── privacy-poker.md           # Main example documentation
│   └── simple-poker.md            # Simple version documentation
│
├── scripts/
│   └── deploy.js                  # Deployment scripts
│
├── hardhat.config.cjs             # Hardhat configuration
├── package.json                   # Dependencies and npm scripts
└── README.md                       # Project overview
```

## Working with FHEVM

### Understanding Encrypted Types

The Privacy Poker Game demonstrates FHEVM encrypted types:

#### ebool - Encrypted Boolean

Used for game state flags:
```solidity
ebool hasFolded;      // Player fold status
ebool isActive;       // Player active status
ebool encryptedCall;  // Encrypted call decision
```

#### euint32 - Encrypted 32-bit Integer

Used for numeric game values:
```solidity
euint32 encryptedBet;     // Player's encrypted bet amount
euint32[] playerCards;    // Could store encrypted card values
```

### Key FHEVM Patterns

#### 1. Creating Encrypted Values

```solidity
// From plaintext input
ebool decision = FHE.asEbool(true);
euint32 betAmount = FHE.asEuint32(uint32(1000));

// In tests - using encrypted input
const encryptedValue = await fhevm.createEncryptedInput(contractAddress, userAddress)
  .add32(123)
  .encrypt();
```

#### 2. Access Control - The Critical Pattern

**Always grant both permissions:**

```solidity
// Grant contract permission to use the value
FHE.allowThis(encryptedValue);

// Grant user permission to use the value
FHE.allow(encryptedValue, msg.sender);
```

**Common Mistake - Missing allowThis():**
```solidity
// WRONG - This will fail!
function badExample(euint32 value) external {
    _count = value;
    FHE.allow(_count, msg.sender); // Missing allowThis!
}

// CORRECT
function goodExample(euint32 value) external {
    _count = value;
    FHE.allowThis(_count);          // Contract permission
    FHE.allow(_count, msg.sender);  // User permission
}
```

#### 3. FHE Operations

```solidity
// Comparison
ebool isEqual = FHE.eq(value1, value2);
ebool isGreater = FHE.gt(value1, value2);

// Arithmetic
euint32 sum = FHE.add(value1, value2);
euint32 difference = FHE.sub(value1, value2);

// Conditional
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);
```

#### 4. External Encrypted Inputs

```solidity
// In contract
function makeMove(
    uint256 gameId,
    externalEuint32 encryptedBetHandle,
    bytes calldata inputProof
) external {
    // Convert external input to internal
    euint32 bet = FHE.fromExternal(encryptedBetHandle, inputProof);

    // Use in contract logic
    _playerBets[gameId][msg.sender] = bet;
    FHE.allowThis(bet);
    FHE.allow(bet, msg.sender);
}
```

### Common Pitfalls

#### Pitfall 1: Forgetting allowThis()

**Problem:**
```solidity
// Only grants user permission
_count = FHE.asEuint32(value);
FHE.allow(_count, msg.sender);
// Contract can't access _count now!
```

**Solution:**
```solidity
_count = FHE.asEuint32(value);
FHE.allowThis(_count);          // Contract needs this
FHE.allow(_count, msg.sender);  // User needs this
```

#### Pitfall 2: Returning Encrypted Values from View Functions

**Problem:**
```solidity
// WRONG - Can't decrypt in view function
function getPlayerBet() external view returns (uint32) {
    return _encryptedBet;  // Type mismatch!
}
```

**Solution:**
```solidity
// CORRECT - Return encrypted type
function getPlayerBet() external view returns (euint32) {
    require(msg.sender == owner(), "Not authorized");
    return _encryptedBet;  // Return encrypted handle
}
```

#### Pitfall 3: Not Handling Input Proofs

**Problem:**
```solidity
// Input proof validation is required!
function makeMove(externalEuint32 bet, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(bet, proof); // Proof is validated
}
```

#### Pitfall 4: Type Mismatches in Comparisons

**Problem:**
```solidity
// WRONG - Can't compare different encrypted types
ebool result = FHE.eq(euint8Value, euint32Value);
```

**Solution:**
```solidity
// CORRECT - Convert to same type
euint32 value32 = FHE.cast(euint8Value, "euint32");
ebool result = FHE.eq(value32, euint32Value);
```

## Running Tests

### All Tests

```bash
npm run test
```

### Specific Test File

```bash
npm run test test/PokerGame.test.ts
```

### Tests with Gas Reporting

```bash
npm run test -- --reporter=spec
```

### Test Coverage

Tests are organized by functionality:

- **Deployment Tests**: Verify contract initialization
- **Game Creation Tests**: Test game creation logic
- **Player Joining Tests**: Test join mechanics and validation
- **Player Moves Tests**: Test move recording and game updates
- **Card Revealing Tests**: Test card revelation mechanism
- **Access Control Tests**: Test permission management
- **FHE Pattern Tests**: Demonstrate correct FHEVM usage

Each test is marked:
- ✅ CORRECT: Shows proper patterns to follow
- ❌ WRONG: Shows common mistakes to avoid
- 🔐 Security: Highlights security considerations

### Writing New Tests

When adding tests, follow this pattern:

```typescript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup - create contracts and signers
  });

  it("✅ CORRECT: Should describe correct behavior", async function () {
    // Test correct usage
  });

  it("❌ WRONG: Should describe what to avoid", async function () {
    // Test error conditions
  });
});
```

## Automation Tools

### Creating Standalone Examples

Generate a self-contained repository for a specific example:

```bash
# Create privacy-poker example
ts-node automation/create-fhevm-example.ts privacy-poker ./output/my-poker

# Navigate and test
cd ./output/my-poker
npm install
npm run compile
npm run test
```

Available examples:
- `privacy-poker`: Full-featured poker game
- `simple-poker`: Simplified learning version

### Generating Documentation

Generate GitBook-formatted markdown documentation:

```bash
# Single example
ts-node automation/generate-docs.ts privacy-poker

# All examples
ts-node automation/generate-docs.ts --all
```

Output files are placed in `docs/` directory.

### Customizing Automation

Edit the automation scripts to add new examples:

1. **create-fhevm-example.ts**:
   - Add to `EXAMPLES_MAP`
   - Specify contract and test paths
   - Add description

2. **generate-docs.ts**:
   - Add to `EXAMPLES_CONFIG`
   - Specify title and description
   - Add output path

## Deployment

### Local Development

Start Hardhat node:
```bash
npx hardhat node
```

In another terminal, deploy:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet

1. Set up environment variables:
   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   ```

2. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Verify contract:
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### Mainnet Deployment

**Never deploy without thorough testing!**

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## Contributing

### Adding a New Example

1. Create contract in `contracts/YourExample.sol`
2. Create tests in `test/YourExample.test.ts`
3. Update `create-fhevm-example.ts`:
   ```typescript
   'your-example': {
     contract: 'contracts/YourExample.sol',
     test: 'test/YourExample.test.ts',
     description: 'Your example description',
     category: 'Your Category',
   }
   ```
4. Update `generate-docs.ts` similarly
5. Generate documentation: `ts-node automation/generate-docs.ts your-example`
6. Test standalone generation: `ts-node automation/create-fhevm-example.ts your-example ./test-output`

### Code Quality

- Follow existing code style
- Add JSDoc comments to functions
- Include test cases for new features
- Update documentation
- Test both correct usage and error cases

### Testing Requirements

- All new features must have tests
- Tests should cover success and failure cases
- Mark tests with ✅/❌ for clarity
- Include explanatory comments

## Best Practices

### Security

1. **Always validate inputs** at contract boundaries
2. **Use ReentrancyGuard** for state-changing functions
3. **Proper access control** with FHE permissions
4. **Test edge cases** thoroughly

### Code Quality

1. **Clear comments** explaining FHEVM concepts
2. **Consistent formatting** across contract files
3. **Meaningful variable names**
4. **DRY principle** - don't repeat code

### Documentation

1. **JSDoc comments** for all public functions
2. **Example code** showing correct usage
3. **Common pitfalls** highlighted in tests
4. **Updated SUMMARY.md** for new examples

## Debugging

### Compilation Errors

```bash
# Clean build
npm run clean
npm run compile
```

### Test Failures

1. Check error messages carefully
2. Verify contract state between operations
3. Test with smaller amounts first
4. Add console.log for debugging

### Gas Issues

- Check for infinite loops
- Verify array iterations have bounds
- Profile gas usage with:
  ```bash
  npm run test -- --reporter=json
  ```

## Resources

- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Solidity Patterns**: https://docs.zama.ai/protocol/solidity-guides/
- **Hardhat Documentation**: https://hardhat.org/docs
- **Testing Guide**: https://hardhat.org/hardhat-runner/docs/guides/testing
- **Zama Community**: https://www.zama.ai/community
- **Discord**: https://discord.com/invite/zama

## FAQ

### How do I understand encrypted types?

Encrypted types (ebool, euint32) represent values that are encrypted at runtime. They can't be decrypted in view functions - they must be handled via FHE operations or sent to off-chain decryption.

### Why do I need both allowThis and allow?

- `allowThis()`: Grants the contract permission to use the encrypted value
- `allow(value, address)`: Grants a specific user permission

Both are needed because the contract and user are separate entities with separate permissions.

### Can I see the unencrypted values?

Not on-chain in view functions. To see values, use:
1. FHE operations (comparisons, arithmetic)
2. Off-chain decryption (via Zama's decryption oracle)
3. Emit events with plaintext (careful with privacy!)

### How do I test encrypted values?

See the test files for patterns:
- Use `FHE.asEbool()` and `FHE.asEuint32()` for basic values
- Create encrypted inputs in tests using the FHEVM test environment
- Test FHE operations with known results

### What's the difference between internal and external encrypted types?

- `ebool`, `euint32`: Internal encrypted types (stored in state)
- `externalEuint32`: External type for function parameters
- Use `FHE.fromExternal()` to convert external to internal

## Support

For questions or issues:
1. Check this guide first
2. Review the example tests
3. Check FHEVM documentation
4. Ask in Zama Discord: https://discord.com/invite/zama

---

**Built with Fully Homomorphic Encryption by Zama**
