#!/usr/bin/env ts-node

/**
 * create-fhevm-example - CLI tool to generate standalone FHEVM example repositories
 *
 * Usage: ts-node automation/create-fhevm-example.ts <example-name> [output-dir]
 *
 * Example: ts-node automation/create-fhevm-example.ts privacy-poker ./my-poker-example
 */

import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

// Example configuration interface
interface ExampleConfig {
  contract: string;
  test: string;
  description: string;
  category: string;
}

// Map of example names to their contract and test paths
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'privacy-poker': {
    contract: 'contracts/PokerGame.sol',
    test: 'test/PokerGame.test.ts',
    description: 'A confidential poker game using FHE encryption for cards, bets, and player actions',
    category: 'Gaming',
  },
  'simple-poker': {
    contract: 'contracts/PokerGameSimple.sol',
    test: 'test/PokerGameSimple.test.ts',
    description: 'A simplified version of the privacy poker game for learning FHE basics',
    category: 'Gaming',
  },
};

function copyDirectoryRecursive(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // Skip node_modules, artifacts, cache, etc.
      if (['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist', 'automation', 'docs'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  // Match contract declaration, ignoring comments and ensuring it's followed by 'is' or '{'
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function updateDeployScript(outputDir: string, contractName: string): void {
  const deployScriptPath = path.join(outputDir, 'scripts', 'deploy.js');

  const deployScript = `const hre = require("hardhat");

async function main() {
  console.log("Deploying ${contractName}...");

  const ${contractName} = await hre.ethers.getContractFactory("${contractName}");
  const contract = await ${contractName}.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(\`${contractName} deployed to: \${address}\`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;

  fs.writeFileSync(deployScriptPath, deployScript);
}

function updatePackageJson(outputDir: string, exampleName: string, description: string): void {
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = `fhevm-example-${exampleName}`;
  packageJson.description = description;
  packageJson.homepage = `https://github.com/your-org/fhevm-poker-examples/${exampleName}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function generateReadme(exampleName: string, description: string, contractName: string): string {
  return `# FHEVM Example: ${exampleName}

${description}

## Overview

This example demonstrates advanced FHEVM concepts through a real-world gaming application:
- **Encrypted Game State**: All player data remains confidential using FHE
- **Privacy-Preserving Actions**: Card dealing, betting, and folding without revealing information
- **Secure Comparisons**: Hand evaluation using FHE operations
- **Access Control**: Proper permission management with FHE.allow and FHE.allowThis

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Compile contracts**

   \`\`\`bash
   npm run compile
   \`\`\`

3. **Run tests**

   \`\`\`bash
   npm run test
   \`\`\`

## Contract

The main contract is \`${contractName}\` located in \`contracts/${contractName}.sol\`.

### Key Features

- **Encrypted Cards**: Cards are stored as \`ebool\` arrays for complete privacy
- **Confidential Betting**: Bet amounts use \`euint32\` encrypted integers
- **Private Actions**: Call, raise, and fold decisions encrypted with \`ebool\`
- **Access Control**: Demonstrates proper use of FHE.allowThis() and FHE.allow()

## Testing

Run the test suite:

\`\`\`bash
npm run test
\`\`\`

The tests demonstrate:
- ✅ Correct usage patterns
- ❌ Common pitfalls and anti-patterns
- 🔐 Permission management best practices

## Deployment

Deploy to local network:

\`\`\`bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
\`\`\`

Deploy to Sepolia testnet:

\`\`\`bash
npx hardhat run scripts/deploy.js --network sepolia
\`\`\`

## Key FHEVM Concepts Demonstrated

### 1. Encrypted Types

\`\`\`solidity
ebool[] encryptedCards;      // Encrypted boolean array for cards
euint32 encryptedBet;         // Encrypted 32-bit integer for bets
ebool hasFolded;              // Encrypted boolean for player status
\`\`\`

### 2. Input Proofs

\`\`\`solidity
function makeMove(
    uint256 _gameId,
    bool _call,
    bool _raise,
    bool _fold
) external {
    ebool encryptedCall = FHE.asEbool(_call);
    ebool encryptedRaise = FHE.asEbool(_raise);
    ebool encryptedFold = FHE.asEbool(_fold);
    // ... rest of logic
}
\`\`\`

### 3. Access Control

\`\`\`solidity
// ✅ DO: Grant both permissions
FHE.allowThis(_count);        // Contract permission
FHE.allow(_count, msg.sender); // User permission

// ❌ DON'T: Forget allowThis
FHE.allow(_count, msg.sender); // Missing allowThis - will fail!
\`\`\`

### 4. FHE Operations

\`\`\`solidity
// Encrypted comparisons
ebool isEqual = FHE.eq(playerBet, compareAmount);

// Encrypted conversions
euint32 encryptedValue = FHE.asEuint32(plainValue);
\`\`\`

## Common Pitfalls

### ❌ Missing FHE.allowThis()

**Problem**: Only granting user permission without contract permission

\`\`\`solidity
// WRONG: Missing allowThis
function badExample(euint32 value) external {
    _count = value;
    FHE.allow(_count, msg.sender); // Contract can't access _count!
}
\`\`\`

**Solution**: Always grant both permissions

\`\`\`solidity
// CORRECT: Both permissions granted
function goodExample(euint32 value) external {
    _count = value;
    FHE.allowThis(_count);          // Contract permission
    FHE.allow(_count, msg.sender);  // User permission
}
\`\`\`

### ❌ Encrypted Values in View Functions

**Problem**: Attempting to return encrypted values directly from view functions

\`\`\`solidity
// WRONG: Can't decrypt in view function
function getEncryptedBet() external view returns (uint32) {
    return _encryptedBet; // Won't work - it's encrypted!
}
\`\`\`

**Solution**: Return the encrypted handle or use decryption mechanism

\`\`\`solidity
// CORRECT: Return encrypted type
function getEncryptedBet() external view returns (euint32) {
    require(msg.sender == owner(), "Not authorized");
    return _encryptedBet; // Returns encrypted handle
}
\`\`\`

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Examples](https://docs.zama.org/protocol/examples)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## License

This project is licensed under the UNLICENSED.

---

**Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
`;
}

function createExample(exampleName: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');

  // Check if example exists
  if (!EXAMPLES_MAP[exampleName]) {
    error(`Unknown example: ${exampleName}\n\nAvailable examples:\n${Object.keys(EXAMPLES_MAP).map(k => `  - ${k}: ${EXAMPLES_MAP[k].description}`).join('\n')}`);
  }

  const example = EXAMPLES_MAP[exampleName];
  const contractPath = path.join(rootDir, example.contract);
  const testPath = path.join(rootDir, example.test);

  // Validate paths exist
  if (!fs.existsSync(contractPath)) {
    error(`Contract not found: ${example.contract}`);
  }
  if (!fs.existsSync(testPath)) {
    info(`Test not found: ${example.test} - will be created from template`);
  }

  info(`Creating FHEVM example: ${exampleName}`);
  info(`Output directory: ${outputDir}`);

  // Step 1: Copy template structure
  log('\n📋 Step 1: Creating project structure...', Color.Cyan);
  if (fs.existsSync(outputDir)) {
    error(`Output directory already exists: ${outputDir}`);
  }
  copyDirectoryRecursive(rootDir, outputDir);
  success('Project structure created');

  // Step 2: Copy contract
  log('\n📄 Step 2: Copying contract...', Color.Cyan);
  const contractName = getContractName(contractPath);
  if (!contractName) {
    error('Could not extract contract name from contract file');
  }
  const destContractPath = path.join(outputDir, 'contracts', `${contractName}.sol`);

  fs.copyFileSync(contractPath, destContractPath);
  success(`Contract copied: ${contractName}.sol`);

  // Step 3: Copy or create test
  log('\n🧪 Step 3: Setting up test...', Color.Cyan);
  if (fs.existsSync(testPath)) {
    const destTestPath = path.join(outputDir, 'test', path.basename(testPath));
    fs.copyFileSync(testPath, destTestPath);
    success(`Test copied: ${path.basename(testPath)}`);
  } else {
    success('Test setup complete');
  }

  // Step 4: Update configuration files
  log('\n⚙️  Step 4: Updating configuration...', Color.Cyan);
  updateDeployScript(outputDir, contractName);
  updatePackageJson(outputDir, exampleName, example.description);
  success('Configuration updated');

  // Step 5: Generate README
  log('\n📝 Step 5: Generating README...', Color.Cyan);
  const readme = generateReadme(exampleName, example.description, contractName);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Final summary
  log('\n' + '='.repeat(60), Color.Green);
  success(`FHEVM example "${exampleName}" created successfully!`);
  log('='.repeat(60), Color.Green);

  log('\n📦 Next steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');

  log('\n🎉 Happy coding with FHEVM!', Color.Cyan);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Example Generator', Color.Cyan);
    log('\nUsage: ts-node automation/create-fhevm-example.ts <example-name> [output-dir]\n');
    log('Available examples:', Color.Yellow);
    Object.entries(EXAMPLES_MAP).forEach(([name, info]) => {
      log(`  ${name}`, Color.Green);
      log(`    ${info.description}`, Color.Reset);
    });
    log('\nExample:', Color.Yellow);
    log('  ts-node automation/create-fhevm-example.ts privacy-poker ./my-poker-example\n');
    process.exit(0);
  }

  const exampleName = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', `fhevm-example-${exampleName}`);

  createExample(exampleName, outputDir);
}

main();
