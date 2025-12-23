// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptSingleValue
 * @dev Demonstrates encrypting a single value
 * @notice Shows basic encryption and permission patterns
 */
contract EncryptSingleValue is ZamaEthereumConfig {
    euint32 private _encryptedSecret;

    event SecretStored(address indexed user);

    /**
     * @notice Store an encrypted secret value
     * @param secretValue The value to encrypt and store
     */
    function storeSecret(uint32 secretValue) external {
        // Convert plaintext to encrypted type
        _encryptedSecret = FHE.asEuint32(secretValue);

        // CRITICAL: Grant both permissions
        FHE.allowThis(_encryptedSecret);  // Contract permission
        FHE.allow(_encryptedSecret, msg.sender);  // User permission

        emit SecretStored(msg.sender);
    }

    /**
     * @notice Retrieve the encrypted secret
     * @return The encrypted value handle
     */
    function getSecret() external view returns (euint32) {
        return _encryptedSecret;
    }
}
