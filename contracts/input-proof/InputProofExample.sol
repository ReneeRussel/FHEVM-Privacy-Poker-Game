// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title InputProofExample
 * @dev Demonstrates input proof handling
 * @notice Shows how to use FHE.asEuint32(inEuint32) with proofs
 */
contract InputProofExample is ZamaEthereumConfig {

    mapping(address => euint32) private _userValues;

    event ValueReceived(address indexed user);

    /**
     * @notice Set value with input proof validation
     * @param encryptedInput The encrypted input with proof
     */
    function setValueWithProof(inEuint32 calldata encryptedInput) external {
        // Convert input to euint32 (proof validated automatically)
        euint32 value = FHE.asEuint32(encryptedInput);

        _userValues[msg.sender] = value;

        // Grant permissions
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);

        emit ValueReceived(msg.sender);
    }

    /**
     * @notice Get user's encrypted value
     * @return The encrypted value
     */
    function getUserValue() external view returns (euint32) {
        return _userValues[msg.sender];
    }

    /**
     * @notice Process two inputs with proofs
     * @param input1 First encrypted input
     * @param input2 Second encrypted input
     */
    function setMultipleValues(
        inEuint32 calldata input1,
        inEuint32 calldata input2
    ) external {
        euint32 value1 = FHE.asEuint32(input1);
        euint32 value2 = FHE.asEuint32(input2);

        // Compute sum
        euint32 sum = FHE.add(value1, value2);

        _userValues[msg.sender] = sum;

        FHE.allowThis(sum);
        FHE.allow(sum, msg.sender);

        emit ValueReceived(msg.sender);
    }
}
