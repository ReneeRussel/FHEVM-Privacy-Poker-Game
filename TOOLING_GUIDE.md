# Automation Tools Guide

Complete guide for using FHEVM Example Hub automation tools.

---

## Overview

This project includes two powerful CLI tools:

1. **create-fhevm-example.ts** - Generate standalone example repositories
2. **create-fhevm-category.ts** - Generate category-based project collections
3. **generate-docs.ts** - Auto-generate GitBook documentation

---

## Tool 1: create-fhevm-example.ts

Generate standalone, self-contained FHEVM example repositories.

### Basic Usage

```bash
ts-node automation/create-fhevm-example.ts <example-name> [output-dir]
```

### Via npm Script

```bash
npm run create:fhe-counter                    # Pre-configured
npm run create-example                        # Show help
npm run help:create                          # Detailed help
```

### What It Does

1. **Clones Base Template** - Copies `base-template/` to output directory
2. **Inserts Contract** - Adds the specific Solidity contract
3. **Copies Tests** - Includes matching test suite
4. **Updates Configuration** - Updates package.json and hardhat.config
5. **Generates README** - Creates custom README with setup instructions
6. **Creates Deploy Script** - Generates deployment script

### Output Structure

```
output/fhe-counter/
├── contracts/
│   └── FHECounter.sol
├── test/
│   └── FHECounter.test.ts
├── scripts/
│   └── deploy.js
├── hardhat.config.cjs
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

### Available Examples

| Name | Description | Category |
|------|-------------|----------|
| `fhe-counter` | Simple encrypted counter | Basic |
| `fhe-arithmetic` | FHE arithmetic operations | Basic |
| `fhe-equality` | FHE comparison operations | Basic |
| `encrypt-single-value` | Single value encryption | Encryption |
| `encrypt-multiple-values` | Multiple value encryption | Encryption |
| `access-control` | Access control patterns | Access Control |
| `input-proof` | Input proof validation | Input Proofs |
| `privacy-poker` | Full poker game | Gaming |
| `simple-poker` | Simple poker for learning | Gaming |

### Examples

#### Generate Single Example

```bash
# Basic counter
npm run create:fhe-counter

# To custom directory
ts-node automation/create-fhevm-example.ts fhe-counter ~/my-projects/counter
```

#### Generate Multiple Examples

```bash
npm run create:fhe-counter
npm run create:fhe-arithmetic
npm run create:fhe-equality
```

#### Check Generated Project

```bash
cd output/fhe-counter
npm install
npm run compile
npm run test
npm run deploy:localhost
```

---

## Tool 2: create-fhevm-category.ts

Generate projects with multiple related examples from a category.

### Basic Usage

```bash
ts-node automation/create-fhevm-category.ts <category> [output-dir]
```

### Via npm Script

```bash
npm run create-category:basic              # Pre-configured
npm run create-category                    # Show help
npm run help:category                     # Detailed help
```

### What It Does

1. **Copies Base Template** - Full Hardhat setup
2. **Copies All Contracts** - All contracts in category
3. **Copies All Tests** - All tests in category
4. **Generates README** - With all examples listed
5. **Creates Deploy Script** - Deploys all contracts
6. **Provides Organized Structure** - Clear category structure

### Output Structure

```
output/basic-examples/
├── contracts/
│   ├── FHECounter.sol
│   ├── FHEArithmetic.sol
│   └── FHEEquality.sol
├── test/
│   ├── FHECounter.test.ts
│   ├── FHEArithmetic.test.ts
│   └── FHEEquality.test.ts
├── scripts/
│   └── deploy.js
├── hardhat.config.cjs
├── package.json
├── README.md
└── ...
```

### Available Categories

| Category | Count | Examples |
|----------|-------|----------|
| `basic` | 3 | FHE Counter, Arithmetic, Equality |
| `encryption` | 2 | Single Value, Multiple Values |
| `access-control` | 2 | Access Control, Input Proof |
| `gaming` | 2 | Privacy Poker, Simple Poker |

### Examples

#### Generate Category

```bash
# All basic examples
npm run create-category:basic

# To custom directory
ts-node automation/create-fhevm-category.ts basic ~/fhevm-learning
```

#### Test Category Project

```bash
cd output/basic-examples
npm install
npm run compile
npm run test
```

#### Generate All Categories

```bash
npm run create-category:basic
npm run create-category:encryption
npm run create-category:access-control
npm run create-category:gaming
```

---

## Tool 3: generate-docs.ts

Auto-generate GitBook-formatted documentation from contracts and tests.

### Basic Usage

```bash
ts-node automation/generate-docs.ts <example-name>
ts-node automation/generate-docs.ts --all
```

### Via npm Script

```bash
npm run generate-all-docs                  # All documentation
npm run docs:fhe-counter                  # Specific example
npm run generate-docs                     # Show help
npm run help:docs                        # Detailed help
```

### What It Does

1. **Reads Contracts** - Extracts Solidity code
2. **Reads Tests** - Extracts test code
3. **Generates Markdown** - Creates GitBook-compatible markdown
4. **Creates Tabbed Interface** - Shows Contract | Test tabs
5. **Updates SUMMARY.md** - Builds documentation index
6. **Organizes by Category** - Groups examples

### Output Files

```
docs/
├── README.md                     # Documentation home
├── SUMMARY.md                    # GitBook index
├── fhe-counter.md
├── fhe-arithmetic.md
├── fhe-equality.md
├── encrypt-single-value.md
├── encrypt-multiple-values.md
├── access-control.md
├── input-proof.md
├── privacy-poker.md
└── simple-poker.md
```

### Generated Document Format

Each doc includes:
- **Overview** - What the example does
- **Key Concepts** - Important FHEVM concepts
- **Implementation** - Tabbed Contract/Test view
- **Common Pitfalls** - What to avoid
- **Resources** - Links to documentation

### Examples

#### Generate All Docs

```bash
npm run generate-all-docs
```

#### Generate Single Doc

```bash
npm run docs:fhe-counter
npm run docs:fhe-arithmetic
```

#### View Generated Docs

```bash
# View in browser (if GitBook installed)
npm run serve

# Or read markdown directly
cat docs/fhe-counter.md
```

---

## Integration with npm Scripts

### Complete Script Reference

```json
{
  "compile": "Compile all contracts",
  "test": "Run all tests",
  "deploy": "Deploy contracts",

  "create:fhe-counter": "Generate FHE counter",
  "create:fhe-arithmetic": "Generate FHE arithmetic",
  "create:fhe-equality": "Generate FHE equality",
  "create:encrypt-single": "Generate single encryption",
  "create:encrypt-multiple": "Generate multiple encryption",
  "create:access-control": "Generate access control",
  "create:input-proof": "Generate input proof",
  "create:privacy-poker": "Generate privacy poker",
  "create:simple-poker": "Generate simple poker",

  "create-category:basic": "Generate basic category",
  "create-category:encryption": "Generate encryption category",
  "create-category:access-control": "Generate access control category",
  "create-category:gaming": "Generate gaming category",

  "generate-all-docs": "Generate all documentation",
  "docs:fhe-counter": "Generate FHE counter docs",
  "docs:fhe-arithmetic": "Generate FHE arithmetic docs",

  "help:create": "Show create-example help",
  "help:category": "Show create-category help",
  "help:docs": "Show generate-docs help"
}
```

---

## Workflows

### Workflow 1: Learn All Basic Concepts

```bash
# Step 1: Generate all basic examples
npm run create-category:basic

# Step 2: Go to project
cd output/basic-examples

# Step 3: Install and test
npm install
npm run compile
npm run test

# Step 4: Study code
cat contracts/FHECounter.sol
cat test/FHECounter.test.ts

# Step 5: Modify and experiment
# ... edit files ...
npm test
```

### Workflow 2: Create Your Own Project

```bash
# Step 1: Choose a base example
npm run create:fhe-counter

# Step 2: Go to output
cd output/fhe-counter

# Step 3: Modify contract
# Edit contracts/FHECounter.sol
# Change logic to your needs

# Step 4: Update tests
# Edit test/FHECounter.test.ts
# Add new test cases

# Step 5: Test
npm install
npm run compile
npm run test

# Step 6: Deploy
npm run deploy:sepolia
```

### Workflow 3: Generate Documentation

```bash
# Step 1: Create examples
npm run create:fhe-counter
npm run create:fhe-arithmetic

# Step 2: Generate docs
npm run generate-all-docs

# Step 3: Review documentation
cat docs/fhe-counter.md
cat docs/fhe-arithmetic.md

# Step 4: (Optional) Serve with GitBook
npm run serve
```

---

## Configuration

### Customizing Automation Tools

#### Add New Example to create-fhevm-example.ts

Edit `automation/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'my-example': {
    contract: 'contracts/MyExample.sol',
    test: 'test/MyExample.test.ts',
    description: 'My custom example',
    category: 'Custom',
  },
  // ... existing examples ...
};
```

#### Add New Category to create-fhevm-category.ts

Edit `automation/create-fhevm-category.ts`:

```typescript
const CATEGORIES = {
  'my-category': {
    description: 'My category description',
    examples: {
      'my-example': {
        contract: 'contracts/MyExample.sol',
        test: 'test/MyExample.test.ts',
        description: 'My example',
      },
      // ... more examples ...
    },
  },
  // ... existing categories ...
};
```

#### Add Example to generate-docs.ts

Edit `automation/generate-docs.ts`:

```typescript
const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
  'my-example': {
    title: 'My Example',
    description: 'Description of my example',
    contract: 'contracts/MyExample.sol',
    test: 'test/MyExample.test.ts',
    output: 'docs/my-example.md',
    category: 'Custom',
  },
  // ... existing examples ...
};
```

---

## Troubleshooting

### Issue: "Example not found"

**Cause**: Example name doesn't exist in EXAMPLES_MAP

**Solution**:
- Check spelling
- Run `npm run help:create` to see available examples

### Issue: "Template not found"

**Cause**: base-template/ directory missing

**Solution**:
- Ensure you're in project root
- Check `base-template/` exists

### Issue: "Permission denied"

**Cause**: File permissions

**Solution**:
```bash
chmod +x automation/*.ts
```

### Issue: TypeScript compilation error

**Cause**: ts-node not installed

**Solution**:
```bash
npm install
```

---

## Best Practices

### 1. Use npm Scripts

Instead of:
```bash
ts-node automation/create-fhevm-example.ts fhe-counter ./output
```

Use:
```bash
npm run create:fhe-counter
```

### 2. Generate to output/ Directory

```bash
# Good - organized
npm run create:fhe-counter

# Also good - custom location
npm run create-example && cd output/fhe-counter
```

### 3. Don't Modify base-template/

Keep base-template clean for future generation.

### 4. Generate Category for Learning

```bash
# Learn better with all related examples
npm run create-category:basic
```

### 5. Use Generated Projects as Templates

```bash
# Generate once
npm run create:fhe-counter

# Copy as new template
cp -r output/fhe-counter output/my-counter

# Modify the copy
cd output/my-counter
# ... edit files ...
```

---

## Performance Tips

### Tip 1: Batch Generation

```bash
# Better to do all at once
npm run create:fhe-counter && npm run create:fhe-arithmetic

# Rather than generating separately many times
```

### Tip 2: Cache npm Packages

Once installed in base-template, subsequent generations are faster.

### Tip 3: Generate to Local SSD

For faster generation, use local solid-state drive:
```bash
npm run create:fhe-counter  # Default uses ./output/
```

---

## Examples Summary

### Quick Reference

```bash
# Generate examples
npm run create:fhe-counter              # Single
npm run create-category:basic          # Category (3 examples)

# Generate docs
npm run generate-all-docs               # All
npm run docs:fhe-counter               # Single

# Get help
npm run help:create                    # Tool help
npm run help:category                  # Category help
npm run help:docs                      # Docs help
```

---

## Advanced Usage

### Generate All Examples Programmatically

```bash
for example in fhe-counter fhe-arithmetic fhe-equality encrypt-single-value encrypt-multiple-values access-control input-proof privacy-poker simple-poker; do
  npm run create:$example || true
done
```

### Generate and Test All

```bash
npm run create-category:basic
cd output/basic-examples
npm install
npm run compile
npm run test
```

### Batch Documentation Generation

```bash
npm run generate-all-docs
# Creates 10+ markdown files in docs/
```

---

## Support

- **Docs**: Read tool help with `npm run help:*`
- **Examples**: Check EXAMPLES_GUIDE.md
- **Development**: See DEVELOPER_GUIDE.md
- **Community**: Join Discord at https://discord.com/invite/zama

---

**Last Updated**: December 2025
**License**: BSD-3-Clause-Clear
