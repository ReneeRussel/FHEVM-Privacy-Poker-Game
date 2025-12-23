// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEEquality
 * @dev Demonstrates FHE comparison operations
 * @notice Shows FHE.eq(), FHE.ne(), FHE.gt(), FHE.lt()
 */
contract FHEEquality is ZamaEthereumConfig {

    /**
     * @notice Check if two encrypted values are equal
     * @param value1 First value
     * @param value2 Second value
     * @return The encrypted comparison result
     */
    function isEqual(uint32 value1, uint32 value2) external pure returns (ebool) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.eq(enc1, enc2);
    }

    /**
     * @notice Check if two encrypted values are not equal
     * @param value1 First value
     * @param value2 Second value
     * @return The encrypted comparison result
     */
    function isNotEqual(uint32 value1, uint32 value2) external pure returns (ebool) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.ne(enc1, enc2);
    }

    /**
     * @notice Check if first value is greater than second
     * @param value1 First value
     * @param value2 Second value
     * @return The encrypted comparison result
     */
    function isGreaterThan(uint32 value1, uint32 value2) external pure returns (ebool) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.gt(enc1, enc2);
    }

    /**
     * @notice Check if first value is less than second
     * @param value1 First value
     * @param value2 Second value
     * @return The encrypted comparison result
     */
    function isLessThan(uint32 value1, uint32 value2) external pure returns (ebool) {
        euint32 enc1 = FHE.asEuint32(value1);
        euint32 enc2 = FHE.asEuint32(value2);
        return FHE.lt(enc1, enc2);
    }
}
