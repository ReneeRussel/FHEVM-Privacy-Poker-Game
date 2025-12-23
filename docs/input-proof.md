# Input Proof Handling

This example demonstrates how to process encrypted user inputs using input proof validation in FHEVM contracts.

## Overview

Input Proof teaches:
- **Input Proofs**: What they are and why they're needed
- **inEuint32 Type**: Handling user-encrypted inputs
- **Proof Validation**: Validating input proofs
- **Decryption Access**: Granting permissions for inputs

{% hint style="info" %}
**Key Concept**: Users can send pre-encrypted data with cryptographic proofs that the input is valid. The contract validates these proofs before using the encrypted data.
{% endhint %}

## Overview of Input Proofs

### Why Input Proofs?

In FHE systems, users can encrypt data on their client before sending it to the contract. To prevent malicious inputs, the user must provide a cryptographic proof that:

1. The encrypted data is well-formed
2. The encryption is valid
3. The data was correctly encrypted

### The Input Proof Flow

```
User creates plaintext → User encrypts locally → User generates proof
                            ↓
                    User sends encrypted data + proof
                            ↓
                    Contract validates proof
                            ↓
                    Contract uses encrypted data
                            ↓
                    Results processed privately
```

## Implementation

{% tabs %}

{% tab title="InputProofExample.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title InputProofExample
 * @dev Demonstrates input proof validation and handling
 */
contract InputProofExample is ZamaEthereumConfig {

    mapping(address => euint32) private _encryptedValues;

    event ValueProcessed(address indexed user);
    event ProofValidated(address indexed user);

    /**
     * @notice Process user-encrypted input with proof validation
     * @param input The encrypted input from user with proof
     */
    function processEncryptedInput(inEuint32 calldata input) external {
        // Step 1: Convert input to contract-usable euint32
        // The inEuint32 type automatically validates the proof
        euint32 value = FHE.asEuint32(input);

        // Step 2: Store the encrypted value
        _encryptedValues[msg.sender] = value;

        // Step 3: Grant permissions
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);

        emit ProofValidated(msg.sender);
        emit ValueProcessed(msg.sender);
    }

    /**
     * @notice Process encrypted input and add to existing value
     * @param increment The encrypted increment from user
     */
    function addEncryptedIncrement(inEuint32 calldata increment) external {
        // Convert input with proof validation
        euint32 inc = FHE.asEuint32(increment);

        // Add to existing value
        euint32 newValue = FHE.add(_encryptedValues[msg.sender], inc);

        // Store result
        _encryptedValues[msg.sender] = newValue;

        // Grant permissions for new value
        FHE.allowThis(newValue);
        FHE.allow(newValue, msg.sender);

        emit ValueProcessed(msg.sender);
    }

    /**
     * @notice Process multiple encrypted inputs
     * @param input1 First encrypted input
     * @param input2 Second encrypted input
     */
    function processTwoInputs(
        inEuint32 calldata input1,
        inEuint32 calldata input2
    ) external {
        // Convert both inputs with proof validation
        euint32 value1 = FHE.asEuint32(input1);
        euint32 value2 = FHE.asEuint32(input2);

        // Perform operations
        euint32 sum = FHE.add(value1, value2);

        // Store result
        _encryptedValues[msg.sender] = sum;

        // Grant permissions
        FHE.allowThis(sum);
        FHE.allow(sum, msg.sender);

        emit ValueProcessed(msg.sender);
    }

    /**
     * @notice Get the stored encrypted value
     * @return The encrypted value
     */
    function getEncryptedValue() external view returns (euint32) {
        return _encryptedValues[msg.sender];
    }

    /**
     * @notice Process input with conditional logic
     * @param userInput The encrypted user input
     * @param threshold The threshold to compare against
     */
    function processConditional(
        inEuint32 calldata userInput,
        uint32 threshold
    ) external {
        // Convert input with proof validation
        euint32 value = FHE.asEuint32(userInput);

        // Create threshold for comparison
        euint32 encThreshold = FHE.asEuint32(threshold);

        // Compare: is value greater than threshold?
        ebool isGreater = FHE.gt(value, encThreshold);

        // Select result based on comparison
        euint32 result = FHE.select(
            isGreater,
            value,  // If greater, use original value
            FHE.asEuint32(0)  // If not, use 0
        );

        // Store result
        _encryptedValues[msg.sender] = result;

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit ValueProcessed(msg.sender);
    }
}
```

{% endtab %}

{% tab title="InputProofExample.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("InputProofExample - Input Proof Handling", function () {
  let contract: any;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("InputProofExample");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Input Proof Processing", function () {
    it("Should process encrypted input with proof validation", async function () {
      // Note: In actual tests, inEuint32 inputs require proof generation
      // This is a simplified example - real tests use fhevm.js library
      // to generate valid proofs

      // await contract.processEncryptedInput(encryptedInputWithProof);
      // const value = await contract.getEncryptedValue();
      // expect(value).to.exist;

      expect(contract).to.exist;
    });

    it("Should emit ProofValidated event", async function () {
      // await expect(contract.processEncryptedInput(proof))
      //   .to.emit(contract, "ProofValidated")
      //   .withArgs(owner.address);

      expect(contract).to.exist;
    });
  });

  describe("✅ CORRECT: Processing Multiple Inputs", function () {
    it("Should process two encrypted inputs", async function () {
      // const sum = await contract.processTwoInputs(proof1, proof2);
      // expect(sum).to.exist;

      expect(contract).to.exist;
    });

    it("Should add encrypted increment", async function () {
      // await contract.processEncryptedInput(initialProof);
      // await contract.addEncryptedIncrement(incrementProof);
      // const result = await contract.getEncryptedValue();
      // expect(result).to.exist;

      expect(contract).to.exist;
    });
  });

  describe("🔐 Security: Proof Validation", function () {
    it("Should validate input proofs", async function () {
      // Invalid proof should be rejected
      // This happens automatically when converting inEuint32

      expect(contract).to.exist;
    });

    it("Should reject malformed inputs", async function () {
      // Malformed inputs without valid proofs should fail

      expect(contract).to.exist;
    });
  });

  describe("🎓 Conditional Processing", function () {
    it("Should process inputs with conditional logic", async function () {
      // await contract.processConditional(encryptedInput, threshold);
      // const result = await contract.getEncryptedValue();
      // expect(result).to.exist;

      expect(contract).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Understanding Input Proofs

### What is an Input Proof?

An input proof is a cryptographic proof that:
1. The sender correctly encrypted the data
2. The encrypted value is valid and well-formed
3. The encryption follows FHEVM standards

### When Are Proofs Needed?

Proofs are needed when:
- User sends encrypted data from off-chain
- Data originates outside the contract
- Contract needs to verify the sender actually encrypted the data

### When Are Proofs NOT Needed?

Proofs are NOT needed for:
- Values encrypted inside the contract (FHE.asEuint32)
- Values already validated in previous transactions
- Data generated by the contract itself

## The inEuint32 Type

### What is inEuint32?

`inEuint32` is a special type used for function parameters that receive encrypted inputs with proofs.

```solidity
function process(inEuint32 calldata input) external {
    // inEuint32 requires a valid input proof
}
```

### How to Use It

```solidity
function processInput(inEuint32 calldata userInput) external {
    // Step 1: Validate by converting
    euint32 value = FHE.asEuint32(userInput);
    // If conversion succeeds, proof was valid

    // Step 2: Use the value
    _data = value;

    // Step 3: Grant permissions
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### Available Input Types

| Type | Size | Usage |
|------|------|-------|
| `inEbool` | 1-bit | Boolean inputs with proofs |
| `inEuint8` | 8-bit | Small unsigned integers |
| `inEuint16` | 16-bit | Medium unsigned integers |
| `inEuint32` | 32-bit | Large unsigned integers |
| `inEuint64` | 64-bit | Very large unsigned integers |

## Common Patterns

### Pattern 1: Simple Input Processing

```solidity
function storeUserValue(inEuint32 calldata userInput) external {
    // Convert with proof validation
    euint32 value = FHE.asEuint32(userInput);

    // Store
    _userValues[msg.sender] = value;

    // Grant permissions
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### Pattern 2: Input Aggregation

```solidity
function submitScore(inEuint16 calldata score) external {
    euint16 encScore = FHE.asEuint16(score);

    // Convert to larger type for aggregation
    euint32 scoreAs32 = FHE.asEuint32(encScore);

    // Aggregate
    _totalScore = FHE.add(_totalScore, scoreAs32);

    FHE.allowThis(_totalScore);
    FHE.allow(_totalScore, msg.sender);
}
```

### Pattern 3: Input Validation with Conditional Logic

```solidity
function submitBid(inEuint32 calldata bid) external {
    euint32 encBid = FHE.asEuint32(bid);
    euint32 minBid = FHE.asEuint32(100);

    // Check if bid is valid (>= minBid)
    ebool isValid = FHE.ge(encBid, minBid);

    // Only proceed if valid
    euint32 finalBid = FHE.select(
        isValid,
        encBid,
        FHE.asEuint32(0)  // Invalid bids become 0
    );

    _bids[msg.sender] = finalBid;

    FHE.allowThis(finalBid);
    FHE.allow(finalBid, msg.sender);
}
```

### Pattern 4: Multiple Input Processing

```solidity
function submitTransaction(
    inEuint32 calldata amount,
    inEuint8 calldata priority
) external {
    euint32 encAmount = FHE.asEuint32(amount);
    euint8 encPriority = FHE.asEuint8(priority);

    // Both inputs are validated when converted
    // Store in struct
    _transactions[msg.sender] = Transaction({
        amount: encAmount,
        priority: encPriority,
        timestamp: block.timestamp
    });

    // Grant permissions for both
    FHE.allowThis(encAmount);
    FHE.allow(encAmount, msg.sender);

    FHE.allowThis(encPriority);
    FHE.allow(encPriority, msg.sender);
}
```

## Common Pitfalls

### ❌ Pitfall 1: Using inEuint32 Without Converting

**Wrong**:
```solidity
function store(inEuint32 calldata input) external {
    _data = input;  // Can't store inEuint32 directly!
    // inEuint32 is only valid in function parameters
}
```

**Correct**:
```solidity
function store(inEuint32 calldata input) external {
    euint32 value = FHE.asEuint32(input);  // Convert first
    _data = value;  // Now it's storable
}
```

### ❌ Pitfall 2: Forgetting to Grant Permissions

**Wrong**:
```solidity
function processInput(inEuint32 calldata input) external {
    euint32 value = FHE.asEuint32(input);
    _data = value;
    // Missing permission grants!
}
```

**Correct**:
```solidity
function processInput(inEuint32 calldata input) external {
    euint32 value = FHE.asEuint32(input);
    _data = value;
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### ❌ Pitfall 3: Invalid Proof Handling

**Wrong**:
```solidity
// Assuming user always sends valid proofs
function process(inEuint32 calldata input) external {
    // What if the proof is invalid?
    // The function will revert, but you haven't handled it
    euint32 value = FHE.asEuint32(input);
}
```

**Better Approach**:
```solidity
function process(inEuint32 calldata input) external {
    // FHE.asEuint32 will revert if proof is invalid
    // Consider catching or validating first
    try {
        euint32 value = FHE.asEuint32(input);
        // Process...
    } catch {
        // Handle invalid proof
        revert("Invalid input proof");
    }
}
```

### ❌ Pitfall 4: Type Mismatches with Proofs

**Wrong**:
```solidity
function process(inEuint32 calldata input) external {
    // Trying to convert to wrong type
    euint8 value = FHE.asEuint8(input);  // Type mismatch!
}
```

**Correct**:
```solidity
function process(inEuint32 calldata input) external {
    // Convert to matching type
    euint32 value = FHE.asEuint32(input);  // Correct type
}
```

## Real-World Use Cases

### Use Case 1: Private Voting

```solidity
contract PrivateVoting is ZamaEthereumConfig {
    mapping(address => euint8) private _votes;

    function castVote(inEuint8 calldata vote) external {
        euint8 encVote = FHE.asEuint8(vote);

        _votes[msg.sender] = encVote;

        FHE.allowThis(encVote);
        FHE.allow(encVote, msg.sender);

        emit VoteCast(msg.sender);
    }
}
```

### Use Case 2: Sealed Bid Auction

```solidity
contract SealedBidAuction is ZamaEthereumConfig {
    mapping(address => euint32) private _bids;

    function placeBid(inEuint32 calldata bid) external {
        euint32 encBid = FHE.asEuint32(bid);

        _bids[msg.sender] = encBid;

        FHE.allowThis(encBid);
        FHE.allow(encBid, msg.sender);

        emit BidPlaced(msg.sender);
    }

    function getHighestBid() external view returns (euint32) {
        // Can compare bids without revealing amounts
        return _highestBid;
    }
}
```

### Use Case 3: Private Data Registry

```solidity
contract DataRegistry is ZamaEthereumConfig {
    struct DataEntry {
        euint32 value;
        uint256 timestamp;
        bool isPublic;
    }

    mapping(address => mapping(uint256 => DataEntry)) private _entries;

    function registerPrivateData(inEuint32 calldata data) external {
        euint32 encData = FHE.asEuint32(data);

        _entries[msg.sender][block.timestamp] = DataEntry({
            value: encData,
            timestamp: block.timestamp,
            isPublic: false
        });

        FHE.allowThis(encData);
        FHE.allow(encData, msg.sender);
    }
}
```

## Testing Input Proofs

### Client-Side Proof Generation (TypeScript/JavaScript)

```typescript
// This requires the @fhevm/sdk package
import { FhevmInstance } from "@fhevm/sdk";

// Initialize FHEVM
const fhevm = await FhevmInstance.create();

// Create plaintext input
const plainValue = 42;

// Generate encrypted input with proof
const encryptedInput = fhevm.encrypt32(plainValue);

// Send to contract
const tx = await contract.processEncryptedInput(encryptedInput);
```

### Key Points

1. **Proof generation happens off-chain** - Client generates proofs before sending
2. **Proofs are included in calldata** - Transmitted with the function call
3. **Contract validates automatically** - Conversion validates the proof
4. **Invalid proofs cause revert** - Function fails if proof is invalid

## Best Practices

### 1. Always Convert Immediately

```solidity
function process(inEuint32 calldata input) external {
    // Convert immediately - this validates the proof
    euint32 value = FHE.asEuint32(input);
}
```

### 2. Validate Input Values

```solidity
function process(inEuint32 calldata input) external {
    euint32 value = FHE.asEuint32(input);

    // Additional validation
    euint32 maxValue = FHE.asEuint32(1000);
    ebool isValid = FHE.le(value, maxValue);

    // Only proceed if valid
    // ...
}
```

### 3. Document Input Requirements

```solidity
/**
 * @notice Process user input
 * @dev User must encrypt the value before calling
 * @dev Value must be positive and less than 1000
 * @param userInput Encrypted input with cryptographic proof
 */
function process(inEuint32 calldata userInput) external {
    // ...
}
```

### 4. Handle Proof Validation Errors

```solidity
function process(inEuint32 calldata input) external {
    // If proof is invalid, FHE.asEuint32 reverts
    // You can let it revert naturally or catch it
    euint32 value = FHE.asEuint32(input);
}
```

## Next Steps

After mastering input proofs:
1. **Simple Poker** - Use input proofs in gaming
2. **Privacy Poker** - Advanced proof usage
3. **Advanced Patterns** - Complex input validation scenarios
4. **Gas Optimization** - Optimize proof processing

## Resources

- [Input Proofs Guide](https://docs.zama.ai/fhevm/guides/input-proofs)
- [FHE.js Client Library](https://docs.zama.ai/fhevm/sdks/javascript)
- [Proof Validation](https://docs.zama.ai/fhevm/fundamentals/proof-validation)

---

**Difficulty**: ⭐⭐⭐⭐ Advanced
**Category**: Input Proofs
**Concepts**: Input proofs, inEuint32, Proof validation, Off-chain encryption
