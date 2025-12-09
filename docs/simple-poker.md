# Simple Poker Game

A simplified version of the privacy poker game that demonstrates basic FHE concepts in a gaming context.

## Overview

This example showcases:
- **Encrypted State Management**: Using FHE to keep basic game data private
- **Simple Privacy-Preserving Operations**: Basic encrypted computations
- **Access Control Patterns**: Fundamental permission management
- **Learning-Focused**: Easier to understand than the full example

{% hint style="info" %}
To run this example correctly, make sure the files are placed in the following directories:

- `.sol` file → `<your-project-root-dir>/contracts/`
- `.ts` file → `<your-project-root-dir>/test/`

This ensures Hardhat can compile and test your contracts as expected.
{% endhint %}

## Key FHEVM Concepts

### Encrypted Types

The basic encrypted types used in games:

- `ebool`: Encrypted boolean values (perfect for yes/no decisions)
- `euint32`: Encrypted 32-bit integers (for amounts, scores)

### Simple Access Control Pattern

```solidity
// Grant both permissions
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, userAddress);
```

## Implementation

{% tabs %}

{% tab title="PokerGameSimple.sol" %}

For the simplified contract implementation, refer to `contracts/PokerGameSimple.sol`. This contract provides a foundational example with basic game mechanics.

Key features:
- Simple game creation
- Player joining
- Basic moves (call, raise, fold)
- Simple card revealing
- Access control examples

{% endtab %}

{% tab title="PokerGameSimple.test.ts" %}

See the test file for examples demonstrating:
- ✅ Basic correct patterns
- ❌ Common beginner mistakes
- 🔐 Simple security concepts

Test categories:
1. Basic deployment
2. Simple game creation
3. Player joins
4. Basic moves
5. Simple access control

{% endtab %}

{% endtabs %}

## What's Different from Full Version

| Feature | Simple | Full |
|---------|--------|------|
| Game Creation | Basic setup | Multiple game types |
| Player Moves | Call/Fold | Call/Raise/Fold with amounts |
| Encryption | Basic ebool/euint32 | Complex arrays and state |
| Game Logic | Simplified | Full poker rules |
| Tests | Focused examples | Comprehensive coverage |

## Learning Path

1. **Start Here**: Simple Poker - understand basic FHEVM patterns
2. **Progress To**: Privacy Poker - learn advanced patterns
3. **Extend**: Modify both examples to experiment with FHEVM

## Common Beginner Mistakes

### ❌ Not Initializing Encrypted Values

**Problem**: Trying to use uninitialized encrypted values

```solidity
// WRONG
ebool playerFolded;  // Never initialized!
if (playerFolded) {  // Unpredictable behavior
    // ...
}
```

**Solution**: Always initialize encrypted values

```solidity
// CORRECT
ebool playerFolded = FHE.asEbool(false);
if (playerFolded) {
    // Now behaves predictably
}
```

### ❌ Forgetting Security Is Key

**Problem**: Treating encrypted values like normal values

```solidity
// WRONG - This doesn't provide privacy!
function revealBet() external view returns (euint32) {
    return _encryptedBet;  // Encrypted, but accessible to anyone
}
```

**Solution**: Verify access permissions

```solidity
// CORRECT
function revealBet() external view returns (euint32) {
    require(msg.sender == _player, "Not authorized");
    return _encryptedBet;  // Only authorized users can access
}
```

## Next Steps

After understanding this example:

1. **Review the Full Version**: See how concepts scale
2. **Modify This Example**: Add new features to learn
3. **Create Your Own**: Build a new FHEVM application
4. **Explore Advanced Patterns**: Check the Developer Guide

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Patterns](https://docs.zama.ai/protocol/solidity-guides/)
- [Zama Community](https://www.zama.ai/community)
- [Developer Guide](../DEVELOPER_GUIDE.md)
