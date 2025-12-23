// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AccessControlExample
 * @dev Demonstrates FHE access control patterns
 * @notice Shows FHE.allowThis(), FHE.allow(), and FHE.allowTransient()
 */
contract AccessControlExample is ZamaEthereumConfig {

    euint32 private _secretValue;
    mapping(address => euint32) private _userBalances;

    event SecretUpdated();
    event BalanceUpdated(address indexed user);

    constructor() {
        _secretValue = FHE.asEuint32(100);
        FHE.allowThis(_secretValue);
    }

    /**
     * @notice Update the secret with proper permissions
     * @param newValue The new secret value
     */
    function updateSecret(uint32 newValue) external {
        _secretValue = FHE.asEuint32(newValue);

        // Grant both permissions
        FHE.allowThis(_secretValue);
        FHE.allow(_secretValue, msg.sender);

        emit SecretUpdated();
    }

    /**
     * @notice Get the secret (requires permission)
     * @return The encrypted value
     */
    function getSecret() external view returns (euint32) {
        return _secretValue;
    }

    /**
     * @notice Set user balance with transient permission
     * @param amount The balance amount
     */
    function setBalance(uint32 amount) external {
        euint32 balance = FHE.asEuint32(amount);

        _userBalances[msg.sender] = balance;

        // Use allowTransient for temporary operations
        FHE.allowThis(balance);
        FHE.allowTransient(balance, msg.sender);

        emit BalanceUpdated(msg.sender);
    }

    /**
     * @notice Get user balance
     * @return The encrypted balance
     */
    function getBalance() external view returns (euint32) {
        return _userBalances[msg.sender];
    }
}
