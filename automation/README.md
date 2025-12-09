# Automation Tools - FHEVM Example Generation

This directory contains TypeScript-based automation tools for generating standalone FHEVM example repositories and documentation.

## Overview

The automation suite provides:
- **create-fhevm-example.ts** - Repository scaffolding and generation
- **generate-docs.ts** - GitBook-compatible documentation generation

Both tools are designed to streamline the creation and maintenance of FHEVM example projects.

## Tools

### 1. create-fhevm-example.ts

Generates complete, standalone FHEVM example repositories from templates.

#### Usage

```bash
ts-node automation/create-fhevm-example.ts <example-name> [output-dir]
```

#### Examples

```bash
# Generate privacy-poker example
ts-node automation/create-fhevm-example.ts privacy-poker ./my-poker

# Generate simple-poker example
ts-node automation/create-fhevm-example.ts simple-poker ./learning-poker

# Use default output directory
ts-node automation/create-fhevm-example.ts privacy-poker
# Creates: ./output/fhevm-example-privacy-poker
```

#### Features

- **Template Cloning**: Copies base Hardhat template structure
- **Contract Insertion**: Inserts specific Solidity contract
- **Test Copying**: Includes corresponding test files
- **Configuration Updates**: Modifies hardhat.config, package.json
- **README Generation**: Creates comprehensive README with setup instructions
- **Deployment Script**: Updates deploy scripts with contract name
- **Color Output**: Colored terminal feedback with progress indicators

#### Configuration

Edit `EXAMPLES_MAP` to add new examples:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'your-example': {
    contract: 'contracts/YourExample.sol',
    test: 'test/YourExample.test.ts',
    description: 'Your example description',
    category: 'Category Name',
  },
};
```

#### Generated Structure

```
output/fhevm-example-privacy-poker/
├── contracts/
│   └── PokerGame.sol
├── test/
│   └── PokerGame.test.ts
├── scripts/
│   └── deploy.js
├── hardhat.config.cjs
├── package.json
├── README.md
└── tsconfig.json
```

#### Requirements

- Node.js v20+
- npm v10+
- Read access to base template files
- Write access to output directory

---

### 2. generate-docs.ts

Generates GitBook-formatted documentation from contracts and tests.

#### Usage

```bash
# Generate single example documentation
ts-node automation/generate-docs.ts <example-name>

# Generate documentation for all examples
ts-node automation/generate-docs.ts --all
```

#### Examples

```bash
# Generate privacy-poker documentation
ts-node automation/generate-docs.ts privacy-poker

# Generate all documentation
ts-node automation/generate-docs.ts --all

# Show help
ts-node automation/generate-docs.ts --help
```

#### Features

- **Code Extraction**: Reads contract and test files
- **Markdown Generation**: Creates GitBook-formatted markdown
- **Tabbed Interface**: Shows Contract | Test code side-by-side
- **SUMMARY Generation**: Auto-generates documentation index
- **Category Organization**: Organizes by example category
- **Syntax Highlighting**: Includes code block formatting

#### Configuration

Edit `EXAMPLES_CONFIG` to add new examples:

```typescript
const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
  'your-example': {
    title: 'Your Example Title',
    description: 'Detailed description',
    contract: 'contracts/YourExample.sol',
    test: 'test/YourExample.test.ts',
    output: 'docs/your-example.md',
    category: 'Category Name',
  },
};
```

#### Generated Output

```
docs/
├── privacy-poker.md          # Full example documentation
├── simple-poker.md           # Learning example
├── SUMMARY.md                # Documentation index
└── README.md                 # Documentation home
```

#### Documentation Format

Generated documents include:

1. **Description** - Overview of the example
2. **Key Concepts** - Important FHEVM concepts
3. **Implementation** - Tabbed contract and test code
4. **Common Pitfalls** - What to avoid
5. **Resources** - Links to documentation

---

## Integration with npm Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "create-example": "ts-node automation/create-fhevm-example.ts",
    "create-example:privacy-poker": "ts-node automation/create-fhevm-example.ts privacy-poker ./output/privacy-poker",
    "create-example:simple-poker": "ts-node automation/create-fhevm-example.ts simple-poker ./output/simple-poker",
    "generate-docs": "ts-node automation/generate-docs.ts",
    "generate-docs:privacy-poker": "ts-node automation/generate-docs.ts privacy-poker",
    "generate-docs:simple-poker": "ts-node automation/generate-docs.ts simple-poker",
    "generate-all-docs": "ts-node automation/generate-docs.ts --all",
    "help:create": "ts-node automation/create-fhevm-example.ts --help",
    "help:docs": "ts-node automation/generate-docs.ts --help"
  }
}
```

### Using via npm

```bash
# Create example
npm run create-example:privacy-poker

# Generate documentation
npm run generate-docs:privacy-poker

# Generate all docs
npm run generate-all-docs

# Show help
npm run help:create
npm run help:docs
```

---

## Workflow Examples

### Creating a New Example

1. **Create contract and test**
   ```bash
   # Create files
   touch contracts/MyExample.sol
   touch test/MyExample.test.ts
   ```

2. **Update automation configuration**
   - Add to `create-fhevm-example.ts` EXAMPLES_MAP
   - Add to `generate-docs.ts` EXAMPLES_CONFIG

3. **Generate standalone example**
   ```bash
   npm run create-example my-example ./output/my-example
   ```

4. **Generate documentation**
   ```bash
   npm run generate-docs:my-example
   ```

5. **Test the generated example**
   ```bash
   cd output/my-example
   npm install
   npm run compile
   npm run test
   ```

### Batch Operations

#### Generate All Examples

```bash
npm run create-example:privacy-poker
npm run create-example:simple-poker
```

#### Generate All Documentation

```bash
npm run generate-all-docs
```

#### Update Dependencies

```bash
# In base template
npm update

# Regenerate examples
npm run create-example:privacy-poker ./output/new-poker
npm run generate-all-docs
```

---

## Adding New Tools

### Template: New Automation Tool

```typescript
#!/usr/bin/env ts-node

/**
 * tool-name - Description of what this tool does
 *
 * Usage: ts-node automation/tool-name.ts <argument> [options]
 *
 * Example: ts-node automation/tool-name.ts something
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

// Main implementation
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    log('Tool Name', Color.Cyan);
    log('\nUsage: ts-node automation/tool-name.ts <argument>\n');
    process.exit(0);
  }

  info('Processing...');
  success('Operation complete!');
}

main();
```

---

## Troubleshooting

### Tool Not Found

```
Error: Cannot find module 'path'
```

**Solution**: Ensure TypeScript is configured correctly. Check `tsconfig.json`.

### Permission Denied

```
Error: EACCES: permission denied
```

**Solution**: Check file permissions. Ensure you have write access to output directory.

### Template Not Found

```
Error: Template not found: fhevm-hardhat-template
```

**Solution**: Verify base template exists in parent directory.

### Invalid Example Name

```
Error: Unknown example: invalid-name
```

**Solution**: Check spelling. Use `npm run help:create` to see available examples.

### Documentation Generation Failed

```
Error: File not found: contracts/Example.sol
```

**Solution**: Verify contract and test paths in EXAMPLES_CONFIG.

---

## Best Practices

### Tool Development

1. **Error Handling**
   - Validate all inputs early
   - Provide clear error messages
   - Exit gracefully with status codes

2. **User Feedback**
   - Use colored output for clarity
   - Show progress indicators
   - Include helpful next steps

3. **Documentation**
   - Add help text with `--help`
   - Document configuration options
   - Provide usage examples

4. **Code Quality**
   - Use TypeScript for type safety
   - Add comprehensive comments
   - Follow existing code style

### Adding to Automation

1. **Update package.json** with new script
2. **Export tool through npm script**
3. **Add to this README** with documentation
4. **Test the tool** thoroughly
5. **Update CONTRIBUTING.md** if needed

---

## Performance Considerations

### Template Cloning
- Skips unnecessary directories (node_modules, artifacts, cache)
- Uses efficient file operations
- Provides progress feedback

### Documentation Generation
- Processes files sequentially
- Caches file reads
- Updates SUMMARY.md once at end

### Optimization Tips

1. **Batch Operations**
   ```bash
   npm run generate-all-docs  # Instead of individual calls
   ```

2. **Reuse Generated Repos**
   ```bash
   # Rather than regenerating, copy and modify
   cp -r output/poker1 output/poker2
   ```

3. **Update Base Template Once**
   ```bash
   # Update once, then regenerate all examples
   npm install (new dependencies)
   npm run create-example:*
   ```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Generate Examples

on:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run generate-all-docs
      - uses: actions/upload-artifact@v2
        with:
          name: documentation
          path: docs/
```

---

## Contributing New Tools

To add a new automation tool:

1. Create file in `automation/` directory
2. Follow existing tool structure
3. Add TypeScript configuration
4. Create npm script in package.json
5. Document in this README
6. Add to CONTRIBUTING.md
7. Test thoroughly

---

## Resources

- **TypeScript Guide**: https://www.typescriptlang.org/docs/
- **Node.js API**: https://nodejs.org/api/
- **Git Tips**: https://git-scm.com/doc

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review existing tool code
3. Check GitHub Issues
4. Ask in Discord #development

---

**Last Updated**: December 2025
**Version**: 1.0
**Status**: ✅ Production Ready
