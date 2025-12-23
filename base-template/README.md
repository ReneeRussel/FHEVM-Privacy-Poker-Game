# FHEVM Example Template

This is a base template for FHEVM (Fully Homomorphic Encryption Virtual Machine) examples.

## Quick Start

### Installation

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy

```bash
# Local network
npx hardhat node
npm run deploy:localhost

# Sepolia testnet
npm run deploy:sepolia
```

## Project Structure

```
.
├── contracts/      # Smart contracts
├── test/          # Test files
├── scripts/       # Deployment scripts
├── hardhat.config.cjs
├── package.json
└── tsconfig.json
```

## License

BSD-3-Clause-Clear

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Community](https://www.zama.ai/community)
