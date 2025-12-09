# Contributing to FHEVM Privacy Poker Game

Thank you for your interest in contributing to the FHEVM Privacy Poker Game example hub! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows the Zama community guidelines. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize learning and collaboration
- Help others understand FHEVM concepts

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm v10 or higher
- Basic understanding of Solidity
- Familiarity with FHEVM concepts
- Git installed

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/fhevm-poker-examples.git
   cd fhevm-poker-examples
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile contracts**
   ```bash
   npm run compile
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

5. **Verify automation tools**
   ```bash
   npm run help:create
   npm run help:docs
   ```

---

## How to Contribute

### Ways to Contribute

1. **Report Bugs**
   - Use GitHub Issues
   - Provide detailed description
   - Include steps to reproduce
   - Specify environment details

2. **Suggest Enhancements**
   - Open GitHub Issue with "enhancement" label
   - Describe the feature clearly
   - Explain use cases and benefits

3. **Improve Documentation**
   - Fix typos or clarify explanations
   - Add examples or tutorials
   - Update outdated information

4. **Add New Examples**
   - Implement new FHEVM patterns
   - Create additional game types
   - Demonstrate advanced FHE operations

5. **Write Tests**
   - Add test coverage
   - Create edge case tests
   - Improve test documentation

6. **Enhance Automation**
   - Improve scaffolding tools
   - Add new generators
   - Optimize documentation generation

---

## Development Workflow

### Adding a New Example Contract

1. **Create the contract**
   ```bash
   # Create in contracts/ directory
   touch contracts/YourExample.sol
   ```

2. **Implement with FHE**
   ```solidity
   // SPDX-License-Identifier: BSD-3-Clause-Clear
   pragma solidity ^0.8.24;

   import { FHE, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
   import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

   /**
    * @title YourExample
    * @notice Brief description of what this example demonstrates
    */
   contract YourExample is SepoliaConfig {
       // Implementation with detailed comments
   }
   ```

3. **Write comprehensive tests**
   ```bash
   # Create in test/ directory
   touch test/YourExample.test.ts
   ```

4. **Update automation scripts**

   In `automation/create-fhevm-example.ts`:
   ```typescript
   const EXAMPLES_MAP: Record<string, ExampleConfig> = {
     // ... existing examples
     'your-example': {
       contract: 'contracts/YourExample.sol',
       test: 'test/YourExample.test.ts',
       description: 'Your example description',
       category: 'Category Name',
     },
   };
   ```

   In `automation/generate-docs.ts`:
   ```typescript
   const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
     // ... existing examples
     'your-example': {
       title: 'Your Example',
       description: 'Detailed description',
       contract: 'contracts/YourExample.sol',
       test: 'test/YourExample.test.ts',
       output: 'docs/your-example.md',
       category: 'Category Name',
     },
   };
   ```

5. **Generate documentation**
   ```bash
   npm run generate-docs:your-example
   ```

6. **Test standalone generation**
   ```bash
   ts-node automation/create-fhevm-example.ts your-example ./test-output
   cd ./test-output
   npm install
   npm run compile
   npm run test
   ```

### Adding New Tests

Follow the test marking system:

```typescript
describe("Your Feature", function () {
  it("✅ CORRECT: Should demonstrate proper pattern", async function () {
    // Test implementation
  });

  it("❌ WRONG: Should reject incorrect usage", async function () {
    // Anti-pattern test
  });

  it("🔐 SECURITY: Should enforce access control", async function () {
    // Security test
  });
});
```

### Improving Documentation

1. **Inline comments** - Explain FHEVM concepts
2. **Code examples** - Show correct and incorrect usage
3. **Common pitfalls** - Highlight what to avoid
4. **Best practices** - Demonstrate optimal patterns

---

## Coding Standards

### Solidity Style Guide

1. **Formatting**
   - Use 4 spaces for indentation
   - Maximum line length: 120 characters
   - Follow Solidity official style guide

2. **Naming Conventions**
   ```solidity
   // Contracts: PascalCase
   contract PokerGame { }

   // Functions: camelCase
   function createGame() { }

   // Variables: camelCase with underscore for private
   uint256 public gameCounter;
   uint256 private _internalCounter;

   // Constants: UPPER_CASE
   uint256 public constant MAX_PLAYERS = 8;

   // Events: PascalCase
   event GameCreated();
   ```

3. **Comments**
   ```solidity
   /**
    * @notice User-facing function description
    * @dev Developer notes and implementation details
    * @param _gameId The ID of the game
    * @return The game information struct
    */
   ```

4. **FHE Best Practices**
   ```solidity
   // Always grant both permissions
   FHE.allowThis(encryptedValue);
   FHE.allow(encryptedValue, user);

   // Use descriptive variable names
   euint32 encryptedBetAmount;  // Good
   euint32 x;                   // Bad

   // Initialize encrypted types
   ebool isActive = FHE.asEbool(true);  // Good
   ebool isActive;                      // Bad - uninitialized
   ```

### TypeScript Style Guide

1. **Use TypeScript features**
   - Explicit types for parameters
   - Interfaces for complex objects
   - Enums for constants

2. **Formatting**
   - Use 2 spaces for indentation
   - Semicolons required
   - Single quotes for strings

3. **Example**
   ```typescript
   interface ExampleConfig {
     contract: string;
     test: string;
     description: string;
   }

   function createExample(name: string, config: ExampleConfig): void {
     // Implementation
   }
   ```

### Test Standards

1. **Organization**
   - Group related tests in describe blocks
   - Use descriptive test names
   - Follow ✅/❌/🔐 marking system

2. **Structure**
   ```typescript
   describe("Feature Name", function () {
     beforeEach(async function () {
       // Setup
     });

     it("✅ CORRECT: Should do X correctly", async function () {
       // Test correct behavior
       expect(result).to.equal(expected);
     });

     it("❌ WRONG: Should reject Y", async function () {
       // Test error handling
       await expect(badCall()).to.be.revertedWith("Error message");
     });
   });
   ```

3. **Coverage Requirements**
   - All public functions tested
   - Both success and failure cases
   - Edge cases and boundaries
   - Security scenarios

---

## Testing Guidelines

### Writing Good Tests

1. **Clear test names**
   ```typescript
   // Good
   it("✅ CORRECT: Should create game with valid parameters")

   // Bad
   it("test1")
   ```

2. **Independent tests**
   - No dependencies between tests
   - Use beforeEach for setup
   - Clean state for each test

3. **Comprehensive assertions**
   ```typescript
   // Verify multiple aspects
   expect(gameInfo.gameId).to.equal(1);
   expect(gameInfo.isActive).to.be.true;
   expect(gameInfo.currentPlayers).to.equal(0);
   ```

4. **Test both paths**
   ```typescript
   // Success case
   it("✅ CORRECT: Should accept valid input", async () => {
     await expect(validCall()).to.not.be.reverted;
   });

   // Failure case
   it("❌ WRONG: Should reject invalid input", async () => {
     await expect(invalidCall()).to.be.revertedWith("Error");
   });
   ```

### Running Tests

```bash
# All tests
npm run test

# Specific file
npx hardhat test test/PokerGame.test.ts

# With coverage
npx hardhat coverage

# With gas reporting
REPORT_GAS=true npm run test
```

---

## Documentation

### Code Documentation

1. **Solidity NatSpec**
   ```solidity
   /**
    * @title Contract Title
    * @notice High-level description for users
    * @dev Technical details for developers
    */
   contract Example {
     /**
      * @notice What this function does (user perspective)
      * @dev Implementation details (developer perspective)
      * @param _gameId The ID of the game
      * @return success Whether operation succeeded
      */
     function createGame(uint256 _gameId) external returns (bool success) {
       // Implementation
     }
   }
   ```

2. **TypeScript JSDoc**
   ```typescript
   /**
    * Creates a new FHEVM example repository
    *
    * @param exampleName - Name of the example to create
    * @param outputDir - Directory where example will be generated
    * @returns void
    *
    * @example
    * createExample('privacy-poker', './my-example');
    */
   function createExample(exampleName: string, outputDir: string): void {
     // Implementation
   }
   ```

3. **Inline Comments**
   - Explain WHY, not WHAT
   - Highlight FHE-specific patterns
   - Note security considerations
   - Reference documentation

### Markdown Documentation

1. **Structure**
   - Clear headings hierarchy
   - Table of contents for long docs
   - Code blocks with syntax highlighting
   - Links to related resources

2. **Examples**
   ```markdown
   ## Feature Name

   Description of the feature.

   ### Usage

   \`\`\`bash
   npm run command
   \`\`\`

   ### Example

   \`\`\`solidity
   // Code example
   \`\`\`
   ```

---

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   npm run compile
   npm run test
   npm run lint  # if available
   ```

3. **Update documentation**
   - Update relevant README sections
   - Add/update code comments
   - Generate new docs if needed

4. **Test automation**
   ```bash
   # Test example generation
   ts-node automation/create-fhevm-example.ts your-example ./test-gen
   cd ./test-gen && npm install && npm test
   ```

### Submitting Pull Request

1. **Create descriptive title**
   ```
   Add encrypted auction example
   Fix permission bug in joinGame
   Improve documentation for FHE patterns
   ```

2. **Write clear description**
   ```markdown
   ## Summary
   Brief description of changes

   ## Changes
   - Bullet list of specific changes
   - Include file names

   ## Testing
   - How you tested the changes
   - Test results

   ## Related Issues
   Closes #123
   ```

3. **Follow template** (if provided)

4. **Request review**
   - Tag relevant maintainers
   - Be responsive to feedback
   - Make requested changes promptly

### PR Review Criteria

Your PR will be reviewed for:

- **Code Quality**: Follows style guide, clean code
- **Testing**: Adequate test coverage, tests pass
- **Documentation**: Updated and clear
- **FHE Patterns**: Correct FHEVM usage
- **Security**: No vulnerabilities introduced
- **Compatibility**: Works with existing code
- **Automation**: Generates correctly

---

## Community

### Getting Help

- **Discord**: https://discord.com/invite/zama
- **Forum**: https://www.zama.ai/community
- **GitHub Issues**: For bug reports and features
- **Documentation**: https://docs.zama.ai/fhevm

### Acknowledgments

Contributors will be acknowledged in:
- CHANGELOG.md
- Project README
- Release notes

---

## License

By contributing, you agree that your contributions will be licensed under the BSD-3-Clause-Clear License.

---

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search GitHub Issues
3. Ask in Discord #development channel
4. Open a GitHub Discussion

---

**Thank you for contributing to the FHEVM ecosystem!**

We appreciate your effort to make privacy-preserving smart contracts more accessible to developers worldwide.
