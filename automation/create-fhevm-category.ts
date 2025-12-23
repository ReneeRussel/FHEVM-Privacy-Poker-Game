#!/usr/bin/env ts-node

/**
 * create-fhevm-category - Generate category-based FHEVM projects
 *
 * Usage: ts-node automation/create-fhevm-category.ts <category> [output-dir]
 *
 * Example: ts-node automation/create-fhevm-category.ts basic ./my-basic-examples
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

interface ExampleInfo {
  contract: string;
  test: string;
  description: string;
}

// Category definitions
const CATEGORIES: Record<string, { examples: Record<string, ExampleInfo>, description: string }> = {
  'basic': {
    description: 'Basic FHE operations: counter, arithmetic, and comparisons',
    examples: {
      'fhe-counter': {
        contract: 'contracts/basic/FHECounter.sol',
        test: 'test/basic/FHECounter.test.ts',
        description: 'Simple encrypted counter',
      },
      'fhe-arithmetic': {
        contract: 'contracts/basic/FHEArithmetic.sol',
        test: 'test/basic/FHEArithmetic.test.ts',
        description: 'FHE arithmetic operations',
      },
      'fhe-equality': {
        contract: 'contracts/basic/FHEEquality.sol',
        test: 'test/basic/FHEEquality.test.ts',
        description: 'FHE comparison operations',
      },
    },
  },
  'encryption': {
    description: 'Encryption patterns: single and multiple values',
    examples: {
      'encrypt-single-value': {
        contract: 'contracts/encryption/EncryptSingleValue.sol',
        test: 'test/encryption/EncryptSingleValue.test.ts',
        description: 'Encrypt single value',
      },
      'encrypt-multiple-values': {
        contract: 'contracts/encryption/EncryptMultipleValues.sol',
        test: 'test/encryption/EncryptMultipleValues.test.ts',
        description: 'Encrypt multiple values',
      },
    },
  },
  'access-control': {
    description: 'Access control patterns and input proof handling',
    examples: {
      'access-control': {
        contract: 'contracts/access-control/AccessControlExample.sol',
        test: 'test/access-control/AccessControlExample.test.ts',
        description: 'FHE access control patterns',
      },
      'input-proof': {
        contract: 'contracts/input-proof/InputProofExample.sol',
        test: 'test/input-proof/InputProofExample.test.ts',
        description: 'Input proof validation',
      },
    },
  },
  'gaming': {
    description: 'Privacy-preserving gaming applications',
    examples: {
      'privacy-poker': {
        contract: 'contracts/PokerGame.sol',
        test: 'test/PokerGame.test.ts',
        description: 'Full-featured privacy poker',
      },
      'simple-poker': {
        contract: 'contracts/PokerGameSimple.sol',
        test: 'test/PokerGameSimple.test.ts',
        description: 'Simplified poker for learning',
      },
    },
  },
};

function showHelp(): void {
  log('📦 create-fhevm-category - Generate Category-Based FHEVM Projects\n', Color.Cyan);
  log('Usage:', Color.Yellow);
  log('  ts-node automation/create-fhevm-category.ts <category> [output-dir]\n');

  log('Available Categories:\n', Color.Yellow);
  Object.entries(CATEGORIES).forEach(([name, info]) => {
    log(`  ${name}`, Color.Green);
    log(`    ${info.description}`);
    log(`    Examples: ${Object.keys(info.examples).length}\n`);
  });

  log('Examples:', Color.Yellow);
  log('  ts-node automation/create-fhevm-category.ts basic ./my-basic-examples');
  log('  ts-node automation/create-fhevm-category.ts gaming ./my-games\n');

  process.exit(0);
}

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
      if (['node_modules', 'artifacts', 'cache', 'coverage'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function copyFile(source: string, dest: string): void {
  const sourcePath = path.join(process.cwd(), source);
  const destPath = path.join(dest);

  if (!fs.existsSync(sourcePath)) {
    error(`Source file not found: ${source}`);
  }

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(sourcePath, destPath);
}

function generateCategoryReadme(category: string, categoryInfo: any): string {
  const examplesList = Object.entries(categoryInfo.examples as Record<string, ExampleInfo>)
    .map(([name, info]) => `- **${name}**: ${info.description}`)
    .join('\n');

  return `# FHEVM ${category.charAt(0).toUpperCase() + category.slice(1)} Examples

${categoryInfo.description}

## Overview

This project contains multiple FHEVM examples in the **${category}** category:

${examplesList}

## Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile All Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run All Tests

\`\`\`bash
npm run test
\`\`\`

## Project Structure

\`\`\`
.
├── contracts/          # All example contracts
├── test/              # Comprehensive test suites
├── scripts/           # Deployment scripts
├── hardhat.config.cjs # Hardhat configuration
└── package.json       # Dependencies
\`\`\`

## Examples Included

${Object.entries(categoryInfo.examples as Record<string, ExampleInfo>)
  .map(([name, info], idx) => `
### ${idx + 1}. ${name}

**Description**: ${info.description}

**Contract**: \`${info.contract.split('/').pop()}\`
**Test**: \`${info.test.split('/').pop()}\`

**Run Tests**:
\`\`\`bash
npx hardhat test ${info.test.split('/').slice(-2).join('/')}
\`\`\`
`)
  .join('\n')}

## Key FHEVM Concepts

### Encrypted Types

- \`ebool\` - Encrypted boolean
- \`euint32\` - Encrypted 32-bit integer
- \`euint64\` - Encrypted 64-bit integer

### FHE Operations

- \`FHE.add(a, b)\` - Addition
- \`FHE.sub(a, b)\` - Subtraction
- \`FHE.mul(a, b)\` - Multiplication
- \`FHE.eq(a, b)\` - Equality
- \`FHE.gt(a, b)\` - Greater than
- \`FHE.lt(a, b)\` - Less than

### Permission Management

**Critical Pattern**:
\`\`\`solidity
// Always grant both permissions
FHE.allowThis(encryptedValue);  // Contract permission
FHE.allow(encryptedValue, user); // User permission
\`\`\`

## Deployment

### Local Network

\`\`\`bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
\`\`\`

### Sepolia Testnet

\`\`\`bash
npx hardhat run scripts/deploy.js --network sepolia
\`\`\`

## Testing

All tests follow clear patterns:
- ✅ **CORRECT**: Proper usage patterns
- ❌ **WRONG**: Common mistakes to avoid
- 🔐 **Security**: Security best practices

## Resources

- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Zama Community**: https://www.zama.ai/community
- **Discord**: https://discord.com/invite/zama

## License

BSD-3-Clause-Clear

---

Built with FHEVM by Zama
`;
}

function generateDeployScript(examples: Record<string, ExampleInfo>): string {
  const contractNames = Object.values(examples).map(ex => {
    const content = fs.readFileSync(path.join(process.cwd(), ex.contract), 'utf-8');
    const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
    return match ? match[1] : null;
  }).filter(Boolean);

  return `const hre = require("hardhat");

async function main() {
  console.log("Deploying all contracts...");
  const deployed = {};

${contractNames.map(name => `
  console.log("\\nDeploying ${name}...");
  const ${name}Factory = await hre.ethers.getContractFactory("${name}");
  const ${name.toLowerCase()} = await ${name}Factory.deploy();
  await ${name.toLowerCase()}.waitForDeployment();
  deployed.${name} = await ${name.toLowerCase()}.getAddress();
  console.log("${name} deployed to:", deployed.${name});
`).join('')}

  console.log("\\n=== Deployment Summary ===");
  console.log(JSON.stringify(deployed, null, 2));

  return deployed;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
  }

  const category = args[0];
  const outputDir = args[1] || path.join('.', 'output', `fhevm-${category}-examples`);

  if (!CATEGORIES[category]) {
    error(`Unknown category: ${category}\n\nUse --help to see available categories`);
  }

  const categoryInfo = CATEGORIES[category];

  log(`\n📦 Creating FHEVM ${category} examples project...\n`, Color.Cyan);

  // Step 1: Copy base template
  info('Step 1: Copying base template...');
  const baseTemplatePath = path.join(process.cwd(), 'base-template');

  if (!fs.existsSync(baseTemplatePath)) {
    error('Base template not found. Please ensure base-template/ directory exists.');
  }

  copyDirectoryRecursive(baseTemplatePath, outputDir);
  success('Base template copied');

  // Step 2: Copy all contracts and tests for this category
  info(`\nStep 2: Copying ${Object.keys(categoryInfo.examples).length} examples...`);

  // Remove template files
  const templateContract = path.join(outputDir, 'contracts', 'Example.sol');
  const templateTest = path.join(outputDir, 'test', 'Example.test.ts');
  if (fs.existsSync(templateContract)) fs.unlinkSync(templateContract);
  if (fs.existsSync(templateTest)) fs.unlinkSync(templateTest);

  Object.entries(categoryInfo.examples).forEach(([name, info]) => {
    const contractDest = path.join(outputDir, 'contracts', path.basename(info.contract));
    const testDest = path.join(outputDir, 'test', path.basename(info.test));

    copyFile(info.contract, contractDest);
    copyFile(info.test, testDest);

    success(`  Copied ${name}`);
  });

  // Step 3: Update package.json
  info('\nStep 3: Updating package.json...');
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = `fhevm-${category}-examples`;
  packageJson.description = `FHEVM ${category} examples - ${categoryInfo.description}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  success('package.json updated');

  // Step 4: Generate README
  info('\nStep 4: Generating README...');
  const readme = generateCategoryReadme(category, categoryInfo);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Step 5: Generate deployment script
  info('\nStep 5: Generating deployment script...');
  const deployScript = generateDeployScript(categoryInfo.examples);
  fs.writeFileSync(path.join(outputDir, 'scripts', 'deploy.js'), deployScript);
  success('Deployment script generated');

  // Final message
  log('\n' + '='.repeat(60), Color.Green);
  success(`Category project created successfully!`);
  log('='.repeat(60) + '\n', Color.Green);

  log('📁 Output directory:', Color.Cyan);
  log(`   ${outputDir}\n`);

  log('📊 Project contains:', Color.Cyan);
  log(`   - ${Object.keys(categoryInfo.examples).length} example contracts`);
  log(`   - ${Object.keys(categoryInfo.examples).length} test suites`);
  log(`   - Complete Hardhat setup`);
  log(`   - Unified deployment script\n`);

  log('🚀 Next steps:', Color.Yellow);
  log(`   cd ${outputDir}`);
  log(`   npm install`);
  log(`   npm run compile`);
  log(`   npm run test\n`);

  log('📚 Category:', Color.Cyan);
  log(`   ${category} - ${categoryInfo.description}\n`);
}

main();
