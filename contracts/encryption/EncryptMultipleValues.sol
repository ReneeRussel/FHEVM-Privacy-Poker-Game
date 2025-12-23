// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptMultipleValues
 * @dev Demonstrates encrypting multiple values
 * @notice Shows handling of multiple encrypted values
 */
contract EncryptMultipleValues is ZamaEthereumConfig {

    struct EncryptedPair {
        euint32 value1;
        euint32 value2;
    }

    mapping(address => EncryptedPair) private _userSecrets;

    event SecretsStored(address indexed user);

    /**
     * @notice Store two encrypted values
     * @param secret1 First secret value
     * @param secret2 Second secret value
     */
    function storeSecrets(uint32 secret1, uint32 secret2) external {
        euint32 enc1 = FHE.asEuint32(secret1);
        euint32 enc2 = FHE.asEuint32(secret2);

        _userSecrets[msg.sender] = EncryptedPair(enc1, enc2);

        // Grant permissions for both values
        FHE.allowThis(enc1);
        FHE.allow(enc1, msg.sender);
        FHE.allowThis(enc2);
        FHE.allow(enc2, msg.sender);

        emit SecretsStored(msg.sender);
    }

    /**
     * @notice Get sum of encrypted secrets
     * @return The encrypted sum
     */
    function getSumOfSecrets() external view returns (euint32) {
        EncryptedPair memory pair = _userSecrets[msg.sender];
        return FHE.add(pair.value1, pair.value2);
    }

    /**
     * @notice Get stored secrets
     * @return The stored encrypted pair
     */
    function getSecrets() external view returns (EncryptedPair memory) {
        return _userSecrets[msg.sender];
    }
}
