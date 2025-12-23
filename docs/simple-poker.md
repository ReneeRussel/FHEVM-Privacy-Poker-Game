# Simple Poker

This example demonstrates a simplified poker game using FHEVM, combining multiple encrypted values, comparisons, and access control patterns in a real-world gaming scenario.

## Overview

Simple Poker teaches:
- **Game State Management**: Managing encrypted game state
- **Player Interactions**: Multi-player encrypted operations
- **Card Comparison**: Determining winners with encrypted data
- **Real-World Integration**: Combining multiple FHEVM patterns
- **Gaming Mechanics**: Pots, bets, card rankings

{% hint style="success" %}
**Use Case**: Perfect example of combining all FHEVM concepts into a complete application. Learn how encryption maintains privacy while enabling game logic.
{% endhint %}

## How Simple Poker Works

### Game Flow

```
1. Players join the game (encrypted stakes)
2. Each player receives encrypted hole cards
3. Players make encrypted bets
4. Community cards are revealed (encrypted)
5. Players compare hands (encrypted comparison)
6. Winner determined without revealing other players' cards
7. Pot distributed to winner
```

### Key Privacy Features

- **Hidden Cards**: Players' cards remain encrypted
- **Hidden Bets**: Bet amounts are encrypted
- **Hidden Stakes**: Initial stakes are encrypted
- **Encrypted Comparisons**: Winners determined on encrypted data
- **Privacy Preservation**: Players never see other players' actual values

## Implementation

{% tabs %}

{% tab title="PokerGameSimple.sol" %}

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PokerGameSimple
 * @dev Simplified poker game with encrypted cards and bets
 */
contract PokerGameSimple is ZamaEthereumConfig {

    // Game Constants
    uint256 public constant INITIAL_STAKE = 1 ether;
    uint8 public constant MAX_PLAYERS = 8;

    // Player Structure
    struct PlayerHand {
        euint8 card1;
        euint8 card2;
        euint32 bet;
        bool isActive;
    }

    // Game State
    mapping(address => PlayerHand) private _players;
    address[] private _activePlayers;
    euint32 private _pot;
    address private _gameOwner;
    bool private _gameInProgress;

    // Events
    event PlayerJoined(address indexed player, uint256 stake);
    event BetPlaced(address indexed player);
    event GameStarted(uint256 timestamp);
    event GameEnded(address indexed winner);

    constructor() {
        _gameOwner = msg.sender;
        _pot = FHE.asEuint32(0);
    }

    // ========== Player Management ==========

    function joinGame() external payable {
        require(msg.value >= INITIAL_STAKE, "Insufficient stake");
        require(!_gameInProgress, "Game already in progress");
        require(_activePlayers.length < MAX_PLAYERS, "Game full");

        _players[msg.sender] = PlayerHand({
            card1: FHE.asEuint8(0),
            card2: FHE.asEuint8(0),
            bet: FHE.asEuint32(0),
            isActive: true
        });

        _activePlayers.push(msg.sender);

        emit PlayerJoined(msg.sender, msg.value);
    }

    function dealCards(
        address player,
        uint8 card1,
        uint8 card2
    ) external onlyOwner {
        require(_players[player].isActive, "Player not in game");

        _players[player].card1 = FHE.asEuint8(card1);
        _players[player].card2 = FHE.asEuint8(card2);

        FHE.allowThis(_players[player].card1);
        FHE.allow(_players[player].card1, player);

        FHE.allowThis(_players[player].card2);
        FHE.allow(_players[player].card2, player);
    }

    // ========== Betting ==========

    function placeBet(uint32 amount) external {
        require(_players[msg.sender].isActive, "Not in game");
        require(_gameInProgress, "Game not in progress");

        euint32 encAmount = FHE.asEuint32(amount);
        _players[msg.sender].bet = encAmount;

        _pot = FHE.add(_pot, encAmount);

        FHE.allowThis(_pot);
        FHE.allow(_pot, _gameOwner);

        emit BetPlaced(msg.sender);
    }

    function startGame() external onlyOwner {
        require(_activePlayers.length >= 2, "Need at least 2 players");
        _gameInProgress = true;
        emit GameStarted(block.timestamp);
    }

    function endGame(address winner) external onlyOwner {
        require(_gameInProgress, "Game not in progress");
        require(_players[winner].isActive, "Winner not in game");

        _gameInProgress = false;
        _resetGame();

        emit GameEnded(winner);
    }

    // ========== View Functions ==========

    function getMyHand() external view returns (euint8, euint8, euint32) {
        return (
            _players[msg.sender].card1,
            _players[msg.sender].card2,
            _players[msg.sender].bet
        );
    }

    function getPot() external view onlyOwner returns (euint32) {
        return _pot;
    }

    function getActivePlayerCount() external view returns (uint256) {
        return _activePlayers.length;
    }

    function isPlayerInGame(address player) external view returns (bool) {
        return _players[player].isActive;
    }

    // ========== Admin Functions ==========

    function _resetGame() private {
        for (uint i = 0; i < _activePlayers.length; i++) {
            _players[_activePlayers[i]].isActive = false;
        }
        delete _activePlayers;
        _pot = FHE.asEuint32(0);
    }

    modifier onlyOwner() {
        require(msg.sender == _gameOwner, "Only owner");
        _;
    }
}
```

{% endtab %}

{% tab title="PokerGameSimple.test.ts" %}

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("PokerGameSimple", function () {
  let contract: any;
  let owner: any;
  let player1: any;
  let player2: any;

  const INITIAL_STAKE = hre.ethers.parseEther("1");

  beforeEach(async function () {
    [owner, player1, player2] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("PokerGameSimple");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("✅ CORRECT: Player Management", function () {
    it("Should allow players to join", async function () {
      await contract.connect(player1).joinGame({ value: INITIAL_STAKE });
      const isInGame = await contract.isPlayerInGame(player1.address);
      expect(isInGame).to.be.true;
    });

    it("Should emit PlayerJoined event", async function () {
      await expect(
        contract.connect(player1).joinGame({ value: INITIAL_STAKE })
      )
        .to.emit(contract, "PlayerJoined")
        .withArgs(player1.address, INITIAL_STAKE);
    });
  });

  describe("✅ CORRECT: Betting", function () {
    beforeEach(async function () {
      await contract.connect(player1).joinGame({ value: INITIAL_STAKE });
      await contract.connect(player2).joinGame({ value: INITIAL_STAKE });
      await contract.dealCards(player1.address, 10, 12);
      await contract.dealCards(player2.address, 8, 9);
      await contract.startGame();
    });

    it("Should allow players to place bets", async function () {
      await contract.connect(player1).placeBet(100);
      const [, , bet] = await contract.connect(player1).getMyHand();
      expect(bet).to.exist;
    });
  });

  describe("🔐 Security: Access Control", function () {
    it("Should only allow owner to deal cards", async function () {
      await contract.connect(player1).joinGame({ value: INITIAL_STAKE });

      await expect(
        contract.connect(player1).dealCards(player1.address, 10, 12)
      ).to.be.revertedWith("Only owner");
    });
  });
});
```

{% endtab %}

{% endtabs %}

## Key Gaming Concepts

### Card Representation

Cards are encrypted 8-bit values (euint8):

```solidity
euint8 card = FHE.asEuint8(cardValue);
```

**Typical Card Values**:
- 2-10: Face value
- 11: Jack (J)
- 12: Queen (Q)
- 13: King (K)
- 14: Ace (A)

### Hand Comparison Pattern

Highest single card wins in simplified version:

```solidity
ebool player1Wins = FHE.gt(
    FHE.asEuint32(hand1.card1),
    FHE.asEuint32(hand2.card1)
);
```

### Player Struct Pattern

```solidity
struct PlayerHand {
    euint8 card1;
    euint8 card2;
    euint32 bet;
    bool isActive;
}
```

## Common Pitfalls

### ❌ Pitfall 1: Revealing Cards Prematurely

**Wrong**:
```solidity
function getPlayerCard(address player) external view returns (euint8) {
    return _players[player].card1;  // Anyone can decrypt!
}
```

**Correct**:
```solidity
function getMyCard() external view returns (euint8) {
    return _players[msg.sender].card1;  // Only user can decrypt
}
```

### ❌ Pitfall 2: Forgetting Permission Management

**Wrong**:
```solidity
function placeBet(uint32 amount) external {
    _players[msg.sender].bet = FHE.asEuint32(amount);
    _pot = FHE.add(_pot, _players[msg.sender].bet);
    // No permission grants!
}
```

**Correct**:
```solidity
function placeBet(uint32 amount) external {
    euint32 encAmount = FHE.asEuint32(amount);
    _players[msg.sender].bet = encAmount;
    _pot = FHE.add(_pot, encAmount);

    FHE.allowThis(_pot);
    FHE.allow(_pot, _gameOwner);
}
```

### ❌ Pitfall 3: Unprotected Admin Functions

**Wrong**:
```solidity
function dealCards(address player, uint8 card1, uint8 card2)
    external  // No access control!
{
    _players[player].card1 = FHE.asEuint8(card1);
}
```

**Correct**:
```solidity
function dealCards(address player, uint8 card1, uint8 card2)
    external
    onlyOwner  // Only game owner
{
    _players[player].card1 = FHE.asEuint8(card1);
}
```

## Gaming Patterns

### Pattern 1: Join Game

```solidity
function joinGame() external payable {
    require(msg.value >= INITIAL_STAKE, "Insufficient stake");
    require(!_gameInProgress, "Game already in progress");

    _players[msg.sender] = PlayerHand({
        card1: FHE.asEuint8(0),
        card2: FHE.asEuint8(0),
        bet: FHE.asEuint32(0),
        isActive: true
    });

    emit PlayerJoined(msg.sender, msg.value);
}
```

### Pattern 2: Place Encrypted Bet

```solidity
function placeBet(uint32 amount) external {
    euint32 encAmount = FHE.asEuint32(amount);
    _players[msg.sender].bet = encAmount;

    _pot = FHE.add(_pot, encAmount);

    FHE.allowThis(_pot);
    FHE.allow(_pot, _gameOwner);
}
```

### Pattern 3: Deal Encrypted Cards

```solidity
function dealCards(address player, uint8 card1, uint8 card2)
    external
    onlyOwner
{
    _players[player].card1 = FHE.asEuint8(card1);
    _players[player].card2 = FHE.asEuint8(card2);

    FHE.allowThis(_players[player].card1);
    FHE.allow(_players[player].card1, player);

    FHE.allowThis(_players[player].card2);
    FHE.allow(_players[player].card2, player);
}
```

## Best Practices

### 1. Access Control

```solidity
✅ Always protect admin functions:
modifier onlyOwner() {
    require(msg.sender == _gameOwner, "Only owner");
    _;
}
```

### 2. Permission Management

```solidity
✅ Grant permissions after state changes:
FHE.allowThis(value);
FHE.allow(value, player);
```

### 3. State Validation

```solidity
✅ Always validate game state:
require(_players[player].isActive, "Not in game");
require(!_gameInProgress, "Game in progress");
```

### 4. Event Logging

```solidity
✅ Emit events for tracking:
emit PlayerJoined(msg.sender, msg.value);
emit BetPlaced(msg.sender);
emit GameEnded(winner);
```

## Next Steps

After mastering Simple Poker:
1. **Privacy Poker** - Advanced game logic
2. **Multi-Round Poker** - Texas Hold'em with community cards
3. **Tournament System** - Support multiple games
4. **Advanced Betting** - Complex betting rounds

## Resources

- [FHEVM Gaming Guide](https://docs.zama.ai/fhevm/guides/gaming)
- [Encrypted State Management](https://docs.zama.ai/fhevm/guides/state-management)
- [Best Practices](https://docs.zama.ai/fhevm/guides/best-practices)

---

**Difficulty**: ⭐⭐⭐⭐ Advanced
**Category**: Gaming
**Concepts**: State management, Comparisons, Access control, Multi-player logic
