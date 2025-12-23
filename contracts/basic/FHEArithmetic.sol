// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEArithmetic
 * @dev Demonstrates FHE arithmetic operations
 * @notice Shows FHE.add(), FHE.sub(), FHE.mul()
 */
contract FHEArithmetic is ZamaEthereumConfig {

    /**
     * @notice Add two encrypted values
     * @param value1 First encrypted value (plaintext for demo)
     * @param value2 Second encrypted value (plaintext for demo)
     * @return The encrypted sum
     */
    function addEncrypted(uint32 value1, uint32 value2) external pure returns (euint32) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.add(enc1, enc2);
    }

    /**
     * @notice Subtract two encrypted values
     * @param value1 First encrypted value (plaintext for demo)
     * @param value2 Second encrypted value (plaintext for demo)
     * @return The encrypted difference
     */
    function subtractEncrypted(uint32 value1, uint32 value2) external pure returns (euint32) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.sub(enc1, enc2);
    }

    /**
     * @notice Multiply two encrypted values
     * @param value1 First encrypted value (plaintext for demo)
     * @param value2 Second encrypted value (plaintext for demo)
     * @return The encrypted product
     */
    function multiplyEncrypted(uint32 value1, uint32 value2) external pure returns (euint32) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.mul(enc1, enc2);
    }
}
