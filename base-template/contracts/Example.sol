// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, ebool, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Example
 * @dev Template contract for FHEVM examples
 */
contract Example is ZamaEthereumConfig {
    euint32 private _value;

    /**
     * @notice Initialize the contract with a value
     * @dev Replace with your actual implementation
     */
    constructor() {
        _value = FHE.asEuint32(0);
    }

    /**
     * @notice Get the encrypted value
     * @return The encrypted value
     */
    function getValue() external view returns (euint32) {
        return _value;
    }
}
