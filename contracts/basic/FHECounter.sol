// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHECounter
 * @dev A simple counter using FHE encryption
 * @notice This demonstrates encrypted state management
 */
contract FHECounter is ZamaEthereumConfig {
    euint32 private _count;

    event Incremented(uint256 amount);
    event Decremented(uint256 amount);

    constructor() {
        _count = FHE.asEuint32(0);
    }

    /**
     * @notice Get the encrypted counter value
     * @return The encrypted count
     */
    function getCount() external view returns (euint32) {
        return _count;
    }

    /**
     * @notice Increment the counter by a value
     * @param value The amount to increment (plaintext)
     */
    function increment(uint32 value) external {
        euint32 encValue = FHE.asEuint32(value);
        _count = FHE.add(_count, encValue);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit Incremented(value);
    }

    /**
     * @notice Decrement the counter by a value
     * @param value The amount to decrement (plaintext)
     */
    function decrement(uint32 value) external {
        euint32 encValue = FHE.asEuint32(value);
        _count = FHE.sub(_count, encValue);

        // Grant permissions
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit Decremented(value);
    }
}
