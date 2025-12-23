# Access Control

This example demonstrates advanced permission management patterns using allowThis(), allow(), and allowTransient() in FHEVM contracts.

## Overview

Access Control teaches:
- **Permission Types**: allowThis, allow, allowTransient explained
- **Advanced Patterns**: Multiple user permissions, delegation
- **Temporary Access**: Transient permissions for specific operations
- **Access Revocation**: Managing who can access encrypted data

{% hint style="warning" %}
**Critical**: Understanding permission management is essential for building secure encrypted applications. Each permission type serves a specific purpose.
{% endhint %}

## Implementation

{% tabs %}

{% tab title="AccessControlExample.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AccessControlExample
 * @dev Demonstrates advanced permission management
 */
contract AccessControlExample is ZamaEthereumConfig {

    euint32 private _secret;
    address private _owner;

    mapping(address => bool) private _authorized;

    event SecretStored(address indexed user);
    event AccessGranted(address indexed user);
    event AccessRevoked(address indexed user);

    constructor() {
        _owner = msg.sender;
    }

    // ========== Permission Management ==========

    function grantAccess(address user) external onlyOwner {
        require(user != address(0), "Invalid address");
        _authorized[user] = true;
        emit AccessGranted(user);
    }

    function revokeAccess(address user) external onlyOwner {
        _authorized[user] = false;
        emit AccessRevoked(user);
    }

    function isAuthorized(address user) external view returns (bool) {
        return _authorized[user];
    }

    // ========== Secret Storage with Permissions ==========

    function storeSecret(uint32 value) external onlyOwner {
        euint32 encrypted = FHE.asEuint32(value);
        _secret = encrypted;

        // Step 1: Grant contract permission
        FHE.allowThis(encrypted);

        // Step 2: Grant owner permission
        FHE.allow(encrypted, msg.sender);

        // Step 3: Grant authorized users
        // (In practice, would iterate through authorized addresses)

        emit SecretStored(msg.sender);
    }

    function getSecret() external view returns (euint32) {
        require(
            msg.sender == _owner || _authorized[msg.sender],
            "Not authorized"
        );
        return _secret;
    }

    function shareSecretWith(address user) external onlyOwner {
        require(_authorized[user], "User not in authorized list");
        FHE.allow(_secret, user);
        emit AccessGranted(user);
    }

    // ========== Transient Access Pattern ==========

    function executeWithTransientAccess(address delegate, euint32 data)
        external
    {
        // Grant temporary access for this transaction only
        FHE.allowTransient(data, delegate);

        // Delegate can now use the data
        // (After transaction, permission is revoked)
    }

    // ========== Access Control Modifiers ==========

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner");
        _;
    }

    modifier onlyAuthorized() {
        require(_authorized[msg.sender], "Not authorized");
        _;
    }
}
```

{% endtab %}

{% tab title="AccessControlExample.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("AccessControlExample", function () {
  let contract: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("AccessControlExample");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Permission Management", function () {
    it("Should grant access to authorized users", async function () {
      await contract.grantAccess(user1.address);
      const authorized = await contract.isAuthorized(user1.address);
      expect(authorized).to.be.true;
    });

    it("Should revoke access from users", async function () {
      await contract.grantAccess(user1.address);
      await contract.revokeAccess(user1.address);
      const authorized = await contract.isAuthorized(user1.address);
      expect(authorized).to.be.false;
    });

    it("Should emit AccessGranted event", async function () {
      await expect(contract.grantAccess(user1.address))
        .to.emit(contract, "AccessGranted")
        .withArgs(user1.address);
    });

    it("Should emit AccessRevoked event", async function () {
      await contract.grantAccess(user1.address);
      await expect(contract.revokeAccess(user1.address))
        .to.emit(contract, "AccessRevoked")
        .withArgs(user1.address);
    });
  });

  describe("✅ CORRECT: Secret Storage with Permissions", function () {
    it("Should store secret with proper permissions", async function () {
      await contract.storeSecret(42);
      const secret = await contract.getSecret();
      expect(secret).to.exist;
    });

    it("Should allow owner to access secret", async function () {
      await contract.storeSecret(100);
      const secret = await contract.getSecret();
      expect(secret).to.exist;
    });
  });

  describe("❌ WRONG: Unauthorized Access", function () {
    it("Should revert if unauthorized user tries to access", async function () {
      await contract.storeSecret(42);
      await expect(
        contract.connect(user1).getSecret()
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("🔐 Security: Access Control", function () {
    it("Should only allow owner to grant access", async function () {
      await expect(
        contract.connect(user1).grantAccess(user2.address)
      ).to.be.revertedWith("Only owner");
    });

    it("Should only allow owner to store secret", async function () {
      await expect(
        contract.connect(user1).storeSecret(100)
      ).to.be.revertedWith("Only owner");
    });
  });

  describe("🎓 Permission Sharing", function () {
    beforeEach(async function () {
      await contract.storeSecret(12345);
      await contract.grantAccess(user1.address);
    });

    it("Should share secret with authorized user", async function () {
      await contract.shareSecretWith(user1.address);
      const secret = await contract.connect(user1).getSecret();
      expect(secret).to.exist;
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Permission Types Explained

### 1. FHE.allowThis() - Contract Permission

```solidity
FHE.allowThis(encrypted);
```

**What it does**: Allows the contract to read and manipulate the encrypted value.

**When to use**: Always use when storing encrypted values in contract state.

**Example**:
```solidity
function storeSecret(uint32 value) external {
    euint32 encrypted = FHE.asEuint32(value);
    _secret = encrypted;
    FHE.allowThis(encrypted);  // Contract needs this!
}
```

**Consequences if omitted**:
- Contract cannot use the encrypted value in functions
- Operations on the value will fail
- Other functions cannot access it

### 2. FHE.allow() - User Permission

```solidity
FHE.allow(encrypted, userAddress);
```

**What it does**: Allows a specific address to decrypt and access the value off-chain.

**When to use**: When users need to access their encrypted data externally.

**Example**:
```solidity
function storeSecret(uint32 value) external {
    euint32 encrypted = FHE.asEuint32(value);
    _secret = encrypted;
    FHE.allowThis(encrypted);
    FHE.allow(encrypted, msg.sender);  // User can decrypt
}
```

**Consequences if omitted**:
- User cannot decrypt the value
- Decryption attempts will fail off-chain
- User cannot prove ownership or access their data

### 3. FHE.allowTransient() - Temporary Permission

```solidity
FHE.allowTransient(encrypted, delegateAddress);
```

**What it does**: Grants temporary access for a single transaction only.

**When to use**: For delegation, voting, or temporary access scenarios.

**Example**:
```solidity
function delegateVote(address delegate, euint32 encryptedVote) external {
    FHE.allowTransient(encryptedVote, delegate);
    // Delegate can use vote data this transaction only
}
```

**Key Difference**: Permission is automatically revoked after the transaction.

## The Complete Pattern

```solidity
function secureStore(uint32 value) external {
    // Step 1: Encrypt the value
    euint32 encrypted = FHE.asEuint32(value);

    // Step 2: Grant contract permission (ALWAYS)
    FHE.allowThis(encrypted);

    // Step 3: Grant user permission (when needed)
    FHE.allow(encrypted, msg.sender);

    // Now both contract and user can access the value
    _state = encrypted;
}
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting allowThis()

**Wrong**:
```solidity
function store(uint32 value) external {
    euint32 encrypted = FHE.asEuint32(value);
    _state = encrypted;
    FHE.allow(encrypted, msg.sender);  // Only user permission!
}

function process() external {
    // ERROR: Contract can't use _state!
    euint32 result = FHE.add(_state, FHE.asEuint32(10));
}
```

**Correct**:
```solidity
function store(uint32 value) external {
    euint32 encrypted = FHE.asEuint32(value);
    _state = encrypted;
    FHE.allowThis(encrypted);  // Contract permission
    FHE.allow(encrypted, msg.sender);  // User permission
}
```

### ❌ Pitfall 2: Selective Permission Grants

**Wrong**:
```solidity
function grantAccess(address user) external {
    // ONLY grants permission for this one user
    FHE.allow(_secret, user);
    // Original owner lost access!
}
```

**Correct**:
```solidity
function grantAccess(address user) external {
    // User gets access
    FHE.allow(_secret, user);
    // Owner still has permission from storage operation
}
```

### ❌ Pitfall 3: Misusing Transient Permissions

**Wrong**:
```solidity
function delegateVote(address delegate, euint32 vote) external {
    FHE.allowTransient(vote, delegate);
    // Assuming permission persists - it doesn't!
    // After this function, access is revoked
}

// In another transaction:
function countVote(address delegate) external {
    // ERROR: Delegate lost access!
}
```

**Correct**:
```solidity
function delegateVote(address delegate, euint32 vote) external {
    FHE.allowTransient(vote, delegate);
    // Delegate must use the data THIS transaction
    // Call to counting contract happens now
}
```

### ❌ Pitfall 4: Permission Leaks

**Wrong**:
```solidity
mapping(address => euint32) private _secrets;

function grantToMultiple(address[] calldata users) external {
    for (uint i = 0; i < users.length; i++) {
        FHE.allow(_secrets[msg.sender], users[i]);
        // Each user gets access - but did you want that?
    }
}
```

**Correct**:
```solidity
mapping(address => euint32) private _secrets;

function grantToSpecific(address user, bool shouldGrant) external {
    if (shouldGrant) {
        FHE.allow(_secrets[msg.sender], user);
    }
    // Explicit control over who gets access
}
```

## Permission Management Patterns

### Pattern 1: Shared Data

```solidity
contract SharedSecret is ZamaEthereumConfig {
    euint32 private _groupSecret;

    function setGroupSecret(uint32 value) external {
        euint32 encrypted = FHE.asEuint32(value);
        _groupSecret = encrypted;

        FHE.allowThis(encrypted);
        // Don't allow individual users - keep it secret
    }

    function shareWithGroup(address[] calldata members) external {
        for (uint i = 0; i < members.length; i++) {
            FHE.allow(_groupSecret, members[i]);
        }
    }
}
```

### Pattern 2: Role-Based Access

```solidity
contract RoleBasedAccess is ZamaEthereumConfig {
    enum Role { NONE, USER, ADMIN, DELEGATE }

    mapping(address => Role) private _roles;
    mapping(Role => euint32[]) private _roleData;

    function grantRoleAccess(address user, Role role) external onlyAdmin {
        _roles[user] = role;

        if (role == Role.ADMIN) {
            // Admins get full access
            for (uint i = 0; i < _roleData[Role.ADMIN].length; i++) {
                FHE.allow(_roleData[Role.ADMIN][i], user);
            }
        } else if (role == Role.USER) {
            // Users get limited access
            FHE.allow(_roleData[Role.USER][0], user);
        }
    }

    modifier onlyAdmin() {
        require(_roles[msg.sender] == Role.ADMIN, "Admin only");
        _;
    }
}
```

### Pattern 3: Time-Limited Access

```solidity
contract TimeLimitedAccess is ZamaEthereumConfig {
    struct AccessGrant {
        address recipient;
        uint256 expiresAt;
    }

    euint32 private _secret;
    mapping(address => AccessGrant) private _grants;

    function grantTemporaryAccess(address user, uint256 durationSeconds)
        external
    {
        FHE.allow(_secret, user);
        _grants[user] = AccessGrant(user, block.timestamp + durationSeconds);
    }

    function revokeIfExpired(address user) external {
        if (block.timestamp > _grants[user].expiresAt) {
            // Note: No built-in "disallow" - revocation requires new key
            delete _grants[user];
        }
    }
}
```

## Best Practices

### 1. Always Require Both Permissions

```solidity
✅ ALWAYS:
FHE.allowThis(value);
FHE.allow(value, msg.sender);
```

### 2. Document Permission Requirements

```solidity
/**
 * @notice Store secret with permissions
 * @dev Grants allowThis for contract and allow for user
 * @param value The plaintext value to encrypt
 */
function storeSecret(uint32 value) external {
    // ...
}
```

### 3. Use Events to Track Permission Changes

```solidity
event PermissionGranted(address indexed grantee, euint32 indexed value);
event PermissionRevoked(address indexed grantee, euint32 indexed value);

function grantAccess(address user, euint32 value) external {
    FHE.allow(value, user);
    emit PermissionGranted(user, value);
}
```

### 4. Implement Access Control Checks

```solidity
modifier requiresPermission(address user) {
    require(_authorized[user], "Not authorized");
    _;
}

function getSecret() external view requiresPermission(msg.sender) {
    return _secret;
}
```

## Security Considerations

### 1. Principle of Least Privilege

```solidity
// Only grant what's needed
function shareData(address user, bool needsAccess) external {
    if (needsAccess) {
        FHE.allow(_data, user);
    }
}
```

### 2. Access Isolation

```solidity
// Each user has separate encrypted data
mapping(address => euint32) private _userSecrets;

function getMySecret() external view returns (euint32) {
    return _userSecrets[msg.sender];
}
```

### 3. Admin Override Mechanisms

```solidity
mapping(address => bool) private _admins;

function emergencyRevoke(address user) external onlyAdmin {
    // In practice, you'd need to re-encrypt with new permissions
    // This is a simplified example
    delete _authorized[user];
}
```

## Next Steps

After mastering access control:
1. **Input Proof** - Handle encrypted user inputs
2. **Simple Poker** - Apply access control to gaming
3. **Privacy Poker** - Advanced permission patterns
4. **Advanced Patterns** - Complex delegation and voting

## Resources

- [FHEVM Access Control](https://docs.zama.ai/fhevm/fundamentals/acl)
- [Permission System Design](https://docs.zama.ai/fhevm/guides/permissions)
- [Security Best Practices](https://docs.zama.ai/fhevm/guides/best-practices)

---

**Difficulty**: ⭐⭐⭐⭐ Advanced
**Category**: Access Control
**Concepts**: Permissions, allowThis, allow, allowTransient, Access patterns
