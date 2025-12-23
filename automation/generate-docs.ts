#!/usr/bin/env ts-node

/**
 * generate-docs - Generates GitBook-formatted documentation from contracts and tests
 *
 * Usage: ts-node automation/generate-docs.ts <example-name> [options]
 *
 * Example: ts-node automation/generate-docs.ts privacy-poker --output docs/
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

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

// Documentation configuration interface
interface DocsConfig {
  title: string;
  description: string;
  contract: string;
  test: string;
  output: string;
  category: string;
}

// Generate documentation options
interface GenerateDocsOptions {
  noSummary?: boolean;
}

// Example configurations
const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
  // Basic Examples
  'fhe-counter': {
    title: 'FHE Counter',
    description: 'Simple FHE counter demonstrating encrypted state management',
    contract: 'contracts/basic/FHECounter.sol',
    test: 'test/basic/FHECounter.test.ts',
    output: 'docs/fhe-counter.md',
    category: 'Basic',
  },
  'fhe-arithmetic': {
    title: 'FHE Arithmetic',
    description: 'FHE arithmetic operations: add, subtract, multiply',
    contract: 'contracts/basic/FHEArithmetic.sol',
    test: 'test/basic/FHEArithmetic.test.ts',
    output: 'docs/fhe-arithmetic.md',
    category: 'Basic',
  },
  'fhe-equality': {
    title: 'FHE Comparisons',
    description: 'FHE comparison operations: equality, greater than, less than',
    contract: 'contracts/basic/FHEEquality.sol',
    test: 'test/basic/FHEEquality.test.ts',
    output: 'docs/fhe-equality.md',
    category: 'Basic',
  },
  // Encryption Examples
  'encrypt-single-value': {
    title: 'Encrypt Single Value',
    description: 'Encrypt and store a single value with proper permissions',
    contract: 'contracts/encryption/EncryptSingleValue.sol',
    test: 'test/encryption/EncryptSingleValue.test.ts',
    output: 'docs/encrypt-single-value.md',
    category: 'Encryption',
  },
  'encrypt-multiple-values': {
    title: 'Encrypt Multiple Values',
    description: 'Handle multiple encrypted values and perform operations',
    contract: 'contracts/encryption/EncryptMultipleValues.sol',
    test: 'test/encryption/EncryptMultipleValues.test.ts',
    output: 'docs/encrypt-multiple-values.md',
    category: 'Encryption',
  },
  // Access Control
  'access-control': {
    title: 'Access Control',
    description: 'FHE access control: allowThis, allow, allowTransient',
    contract: 'contracts/access-control/AccessControlExample.sol',
    test: 'test/access-control/AccessControlExample.test.ts',
    output: 'docs/access-control.md',
    category: 'Access Control',
  },
  'input-proof': {
    title: 'Input Proof',
    description: 'Input proof handling and validation patterns',
    contract: 'contracts/input-proof/InputProofExample.sol',
    test: 'test/input-proof/InputProofExample.test.ts',
    output: 'docs/input-proof.md',
    category: 'Input Proofs',
  },
  // Gaming Examples
  'privacy-poker': {
    title: 'Privacy Poker Game',
    description: 'This example demonstrates how to build a confidential poker game using FHEVM, where all player cards, bets, and actions remain encrypted throughout the game.',
    contract: 'contracts/PokerGame.sol',
    test: 'test/PokerGame.test.ts',
    output: 'docs/privacy-poker.md',
    category: 'Advanced - Gaming',
  },
  'simple-poker': {
    title: 'Simple Poker Game',
    description: 'A simplified version of the privacy poker game that demonstrates basic FHE concepts in a gaming context.',
    contract: 'contracts/PokerGameSimple.sol',
    test: 'test/PokerGameSimple.test.ts',
    output: 'docs/simple-poker.md',
    category: 'Advanced - Gaming',
  },
};

function readFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

function getContractName(content: string): string {
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : 'Contract';
}

function extractDescription(content: string): string {
  // Extract description from first multi-line comment or @notice
  const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*@title\s+(.+?)\s*\n/);
  const noticeMatch = content.match(/@notice\s+(.+)/);

  return commentMatch ? commentMatch[1] : (noticeMatch ? noticeMatch[1] : '');
}

function generateGitBookMarkdown(config: DocsConfig, contractContent: string, testContent: string): string {
  const contractName = getContractName(contractContent);
  const description = config.description || extractDescription(contractContent);

  let markdown = `# ${config.title}\n\n`;
  markdown += `${description}\n\n`;

  // Add overview section
  markdown += `## Overview\n\n`;
  markdown += `This example showcases:\n`;
  markdown += `- **Encrypted State Management**: Using FHE to keep game data private\n`;
  markdown += `- **Privacy-Preserving Operations**: Performing computations on encrypted data\n`;
  markdown += `- **Access Control Patterns**: Proper permission management with FHE\n`;
  markdown += `- **Real-World Application**: Practical use of FHEVM in gaming\n\n`;

  // Add hint block
  markdown += `{% hint style="info" %}\n`;
  markdown += `To run this example correctly, make sure the files are placed in the following directories:\n\n`;
  markdown += `- \`.sol\` file → \`<your-project-root-dir>/contracts/\`\n`;
  markdown += `- \`.ts\` file → \`<your-project-root-dir>/test/\`\n\n`;
  markdown += `This ensures Hardhat can compile and test your contracts as expected.\n`;
  markdown += `{% endhint %}\n\n`;

  // Add key concepts section
  markdown += `## Key FHEVM Concepts\n\n`;
  markdown += `### Encrypted Types\n\n`;
  markdown += `FHEVM provides several encrypted types:\n\n`;
  markdown += `- \`ebool\`: Encrypted boolean values\n`;
  markdown += `- \`euint8\`, \`euint16\`, \`euint32\`, \`euint64\`: Encrypted unsigned integers\n`;
  markdown += `- Arrays of encrypted types for complex data structures\n\n`;

  markdown += `### Access Control\n\n`;
  markdown += `Two essential operations for managing encrypted data:\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += `// Grant permission to the contract itself\n`;
  markdown += `FHE.allowThis(encryptedValue);\n\n`;
  markdown += `// Grant permission to a specific address\n`;
  markdown += `FHE.allow(encryptedValue, userAddress);\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `{% hint style="warning" %}\n`;
  markdown += `**Important**: Always grant both \`allowThis\` and \`allow\` permissions when storing encrypted values that need to be accessed by both the contract and users.\n`;
  markdown += `{% endhint %}\n\n`;

  // Add tabs for contract and test
  markdown += `## Implementation\n\n`;
  markdown += `{% tabs %}\n\n`;

  // Contract tab
  markdown += `{% tab title="${contractName}.sol" %}\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += contractContent;
  markdown += `\n\`\`\`\n\n`;
  markdown += `{% endtab %}\n\n`;

  // Test tab
  const testFileName = path.basename(config.test);
  markdown += `{% tab title="${testFileName}" %}\n\n`;
  markdown += `\`\`\`typescript\n`;
  markdown += testContent;
  markdown += `\n\`\`\`\n\n`;
  markdown += `{% endtab %}\n\n`;

  markdown += `{% endtabs %}\n\n`;

  // Add common pitfalls section
  markdown += `## Common Pitfalls\n\n`;
  markdown += `### ❌ Missing FHE.allowThis()\n\n`;
  markdown += `**Problem**: Only granting user permission without contract permission\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += `// WRONG\n`;
  markdown += `function badExample(euint32 value) external {\n`;
  markdown += `    _count = value;\n`;
  markdown += `    FHE.allow(_count, msg.sender); // Missing allowThis!\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `**Solution**: Always grant both permissions\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += `// CORRECT\n`;
  markdown += `function goodExample(euint32 value) external {\n`;
  markdown += `    _count = value;\n`;
  markdown += `    FHE.allowThis(_count);          // Contract permission\n`;
  markdown += `    FHE.allow(_count, msg.sender);  // User permission\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `### ❌ Returning Encrypted Values from View Functions\n\n`;
  markdown += `**Problem**: Attempting to decrypt values in view functions\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += `// WRONG\n`;
  markdown += `function getBet() external view returns (uint32) {\n`;
  markdown += `    return _encryptedBet; // Can't decrypt in view!\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `**Solution**: Return the encrypted handle\n\n`;
  markdown += `\`\`\`solidity\n`;
  markdown += `// CORRECT\n`;
  markdown += `function getBet() external view returns (euint32) {\n`;
  markdown += `    return _encryptedBet; // Returns encrypted handle\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;

  // Add resources section
  markdown += `## Resources\n\n`;
  markdown += `- [FHEVM Documentation](https://docs.zama.ai/fhevm)\n`;
  markdown += `- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)\n`;
  markdown += `- [Zama Community](https://www.zama.ai/community)\n\n`;

  return markdown;
}

function updateSummary(exampleName: string, config: DocsConfig): void {
  const summaryPath = path.join(process.cwd(), 'docs', 'SUMMARY.md');

  if (!fs.existsSync(summaryPath)) {
    log('Creating new SUMMARY.md', Color.Yellow);
    const summary = `# Table of Contents\n\n## Introduction\n\n- [Getting Started](README.md)\n\n`;
    fs.writeFileSync(summaryPath, summary);
  }

  const summary = fs.readFileSync(summaryPath, 'utf-8');
  const outputFileName = path.basename(config.output);
  const linkText = config.title;
  const link = `- [${linkText}](${outputFileName})`;

  // Check if already in summary
  if (summary.includes(outputFileName)) {
    info('Example already in SUMMARY.md');
    return;
  }

  // Add to appropriate category
  const categoryHeader = `## ${config.category}`;
  let updatedSummary: string;

  if (summary.includes(categoryHeader)) {
    // Add under existing category
    const lines = summary.split('\n');
    const categoryIndex = lines.findIndex(line => line.trim() === categoryHeader);

    // Find next category or end
    let insertIndex = categoryIndex + 1;
    while (insertIndex < lines.length && !lines[insertIndex].startsWith('##')) {
      if (lines[insertIndex].trim() === '') {
        break;
      }
      insertIndex++;
    }

    lines.splice(insertIndex, 0, link);
    updatedSummary = lines.join('\n');
  } else {
    // Add new category
    updatedSummary = summary.trim() + `\n\n${categoryHeader}\n\n${link}\n`;
  }

  fs.writeFileSync(summaryPath, updatedSummary);
  success('Updated SUMMARY.md');
}

function generateDocs(exampleName: string, options: GenerateDocsOptions = {}): void {
  const config = EXAMPLES_CONFIG[exampleName];

  if (!config) {
    error(`Unknown example: ${exampleName}\n\nAvailable examples:\n${Object.keys(EXAMPLES_CONFIG).map(k => `  - ${k}`).join('\n')}`);
  }

  info(`Generating documentation for: ${config.title}`);

  // Read contract and test files
  const contractContent = readFile(config.contract);

  let testContent = '';
  try {
    testContent = readFile(config.test);
  } catch (e) {
    info('Test file not found, using placeholder');
    testContent = '// Test file to be created';
  }

  // Generate GitBook markdown
  const markdown = generateGitBookMarkdown(config, contractContent, testContent);

  // Write output file
  const outputPath = path.join(process.cwd(), config.output);
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown);
  success(`Documentation generated: ${config.output}`);

  // Update SUMMARY.md
  if (!options.noSummary) {
    updateSummary(exampleName, config);
  }

  log('\n' + '='.repeat(60), Color.Green);
  success(`Documentation for "${config.title}" generated successfully!`);
  log('='.repeat(60), Color.Green);
}

function generateAllDocs(): void {
  info('Generating documentation for all examples...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const exampleName of Object.keys(EXAMPLES_CONFIG)) {
    try {
      generateDocs(exampleName, { noSummary: true });
      successCount++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log(`Failed to generate docs for ${exampleName}: ${errorMessage}`, Color.Red);
      errorCount++;
    }
  }

  // Update summary once at the end
  info('\nUpdating SUMMARY.md...');
  for (const exampleName of Object.keys(EXAMPLES_CONFIG)) {
    const config = EXAMPLES_CONFIG[exampleName];
    updateSummary(exampleName, config);
  }

  log('\n' + '='.repeat(60), Color.Green);
  success(`Generated ${successCount} documentation files`);
  if (errorCount > 0) {
    log(`Failed: ${errorCount}`, Color.Red);
  }
  log('='.repeat(60), Color.Green);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Documentation Generator', Color.Cyan);
    log('\nUsage: ts-node automation/generate-docs.ts <example-name> | --all\n');
    log('Available examples:', Color.Yellow);
    Object.entries(EXAMPLES_CONFIG).forEach(([name, config]) => {
      log(`  ${name}`, Color.Green);
      log(`    ${config.title} - ${config.category}`, Color.Reset);
    });
    log('\nOptions:', Color.Yellow);
    log('  --all    Generate documentation for all examples');
    log('\nExamples:', Color.Yellow);
    log('  ts-node automation/generate-docs.ts privacy-poker');
    log('  ts-node automation/generate-docs.ts --all\n');
    process.exit(0);
  }

  if (args[0] === '--all') {
    generateAllDocs();
  } else {
    generateDocs(args[0]);
  }
}

main();
