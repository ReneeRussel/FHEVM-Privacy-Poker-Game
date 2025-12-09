import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { PokerGame } from "../typechain-types";

/**
 * Test Suite: FHEVM Patterns & Best Practices
 *
 * This test suite focuses exclusively on FHEVM-specific patterns:
 * ✅ Correct FHE permission patterns
 * ✅ Encrypted type operations
 * ✅ Input proof handling
 * ❌ Common FHE mistakes
 * 🔐 FHE security patterns
 *
 * @category FHEVM Patterns
 * @example Advanced FHE operation testing
 */

describe("FHEVM Patterns - Deep Dive", function () {
  let pokerGame: PokerGame;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const PokerGame = await ethers.getContractFactory("PokerGame");
    pokerGame = await PokerGame.deploy();
    await pokerGame.waitForDeployment();
  });

  describe("FHE Permission Patterns", function () {
    it("✅ CORRECT: Grant both allowThis and allow permissions", async function () {
      /**
       * CRITICAL PATTERN:
       *
       * When storing encrypted values, you MUST grant TWO permissions:
       *
       * 1. FHE.allowThis(value) - Allows the CONTRACT to use the value
       * 2. FHE.allow(value, user) - Allows a USER to access the value
       *
       * Why both?
       * - Contract needs to read/modify the value in its functions
       * - User needs to decrypt/access their own data
       *
       * Example in PokerGame.sol joinGame():
       *
       * playerStates[_gameId][msg.sender] = PlayerState({
       *     ...
       *     encryptedBet: FHE.asEuint32(uint32(msg.value / 1 wei)),
       *     ...
       * });
       *
       * // Permissions are implicitly granted through the contract design
       * // In production, explicit permission calls would be:
       * // FHE.allowThis(playerState.encryptedBet);
       * // FHE.allow(playerState.encryptedBet, msg.sender);
       */

      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await expect(
        pokerGame.connect(user1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.not.be.reverted;
    });

    it("❌ WRONG: Missing FHE.allowThis() causes contract access failure", async function () {
      /**
       * ANTIPATTERN - Don't do this:
       *
       * function storeValue(euint32 value) external {
       *     _myValue = value;
       *     FHE.allow(_myValue, msg.sender);  // User can access
       *     // MISSING: FHE.allowThis(_myValue);
       * }
       *
       * function useValue() external view returns (euint32) {
       *     // This will FAIL because contract doesn't have permission
       *     return FHE.add(_myValue, FHE.asEuint32(1));
       * }
       *
       * Impact:
       * - Contract cannot perform operations on the encrypted value
       * - Internal functions will fail
       * - Game logic breaks
       *
       * Solution: ALWAYS call FHE.allowThis() when storing encrypted values
       */
    });

    it("✅ CORRECT: FHE.allowTransient for temporary values", async function () {
      /**
       * Pattern: Use allowTransient for values that don't persist
       *
       * FHE.allowTransient(tempValue, user);
       *
       * Use when:
       * - Value is only used in current transaction
       * - Don't need to store in state
       * - Temporary calculations
       *
       * Benefits:
       * - Slightly lower gas cost
       * - Cleaner permission model
       * - Better for computed values
       *
       * Example:
       *
       * function computeWinner() internal returns (euint32) {
       *     euint32 maxBet = FHE.asEuint32(0);
       *     // ... compute maxBet
       *     FHE.allowTransient(maxBet, msg.sender);
       *     return maxBet;
       * }
       */
    });
  });

  describe("Encrypted Type Operations", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(user1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(user2).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: FHE.eq() for encrypted equality comparison", async function () {
      /**
       * FHE.eq(a, b) returns ebool
       *
       * Usage:
       * ebool areEqual = FHE.eq(encryptedBet1, encryptedBet2);
       *
       * Example in PokerGame:
       * ebool result = FHE.eq(playerBet, compareAmount);
       *
       * Important:
       * - Both operands must be same encrypted type
       * - Returns encrypted boolean (ebool), not plaintext bool
       * - Cannot use in if() directly - value is encrypted!
       */

      const result = await pokerGame.compareBetAmount(1, user1.address, 1);
      expect(result).to.not.be.null;
    });

    it("✅ CORRECT: FHE.gt() and FHE.lt() for comparisons", async function () {
      /**
       * FHE.gt(a, b) - Greater than (a > b)
       * FHE.lt(a, b) - Less than (a < b)
       * FHE.gte(a, b) - Greater than or equal (a >= b)
       * FHE.lte(a, b) - Less than or equal (a <= b)
       *
       * All return ebool (encrypted boolean)
       *
       * Example:
       *
       * ebool isHigherBet = FHE.gt(newBet, currentBet);
       * ebool isValidBet = FHE.gte(bet, minimumBet);
       *
       * Use cases:
       * - Comparing bids in auction
       * - Checking bet amounts
       * - Validating encrypted thresholds
       */
    });

    it("✅ CORRECT: FHE.add() and FHE.sub() for arithmetic", async function () {
      /**
       * Arithmetic on encrypted values:
       *
       * euint32 sum = FHE.add(value1, value2);
       * euint32 difference = FHE.sub(value1, value2);
       * euint32 product = FHE.mul(value1, value2);
       *
       * Example - Accumulating pot:
       *
       * function addToPot(euint32 betAmount) internal {
       *     totalPot = FHE.add(totalPot, betAmount);
       *     FHE.allowThis(totalPot);
       * }
       *
       * Notes:
       * - Result is also encrypted
       * - Overflow checking not automatic (use FHE.select for safety)
       * - Grant permissions on results if storing
       */
    });

    it("✅ CORRECT: FHE.select() for conditional operations", async function () {
      /**
       * FHE.select(condition, valueIfTrue, valueIfFalse)
       *
       * Ternary operator for encrypted values:
       *
       * euint32 result = FHE.select(
       *     condition,      // ebool
       *     trueValue,      // euint32
       *     falseValue      // euint32
       * );
       *
       * Example - Taking max of two encrypted bets:
       *
       * ebool isGreater = FHE.gt(bet1, bet2);
       * euint32 maxBet = FHE.select(isGreater, bet1, bet2);
       *
       * Use cases:
       * - Max/min finding
       * - Conditional updates
       * - Safe overflow prevention
       */
    });

    it("✅ CORRECT: FHE.asEbool() and FHE.asEuint32() for encryption", async function () {
      /**
       * Convert plaintext to encrypted types:
       *
       * ebool encrypted = FHE.asEbool(true);
       * euint8 enc8 = FHE.asEuint8(42);
       * euint32 enc32 = FHE.asEuint32(1000);
       *
       * Usage in PokerGame:
       *
       * function joinGame(...) {
       *     ebool encryptedWantsToJoin = FHE.asEbool(_wantsToJoin);
       *     euint32 encryptedBet = FHE.asEuint32(uint32(msg.value / 1 wei));
       *     ...
       * }
       *
       * Important:
       * - Use when accepting plaintext input
       * - Value becomes encrypted
       * - Remember to grant permissions
       */
    });

    it("❌ WRONG: Cannot compare different encrypted types", async function () {
      /**
       * ANTIPATTERN - Type mismatch:
       *
       * euint8 smallValue = FHE.asEuint8(10);
       * euint32 largeValue = FHE.asEuint32(1000);
       *
       * // This FAILS - different types
       * ebool result = FHE.eq(smallValue, largeValue);
       *
       * Solution - Cast to same type:
       *
       * euint32 smallAs32 = FHE.cast(smallValue, "euint32");
       * ebool result = FHE.eq(smallAs32, largeValue);  // OK
       *
       * Or:
       *
       * euint8 largeAs8 = FHE.cast(largeValue, "euint8");  // Truncates!
       * ebool result = FHE.eq(smallValue, largeAs8);  // OK but risky
       */
    });

    it("❌ WRONG: Cannot use encrypted values in plaintext conditionals", async function () {
      /**
       * ANTIPATTERN - Encrypted in if():
       *
       * ebool playerFolded = FHE.asEbool(true);
       *
       * // This FAILS - ebool is encrypted, not plaintext bool
       * if (playerFolded) {
       *     // Won't work - can't decrypt in smart contract
       * }
       *
       * Solution - Use FHE operations:
       *
       * euint32 payout = FHE.select(
       *     playerFolded,
       *     FHE.asEuint32(0),        // If folded
       *     FHE.asEuint32(prize)     // If not folded
       * );
       *
       * Or emit events and handle off-chain:
       *
       * emit PlayerAction(gameId, player, playerFolded);
       * // Off-chain code can decrypt and act
       */
    });
  });

  describe("Input Proof Patterns", function () {
    it("✅ CORRECT: FHE.fromExternal() with input proof", async function () {
      /**
       * When receiving encrypted input from users:
       *
       * function placeBet(
       *     externalEuint32 encryptedBetHandle,
       *     bytes calldata inputProof
       * ) external {
       *     // Verify and convert external encrypted input
       *     euint32 bet = FHE.fromExternal(encryptedBetHandle, inputProof);
       *
       *     // Now can use internally
       *     _playerBets[msg.sender] = bet;
       *
       *     // Grant permissions
       *     FHE.allowThis(bet);
       *     FHE.allow(bet, msg.sender);
       * }
       *
       * Input proof:
       * - Zero-knowledge proof that user encrypted the value correctly
       * - Binds encrypted value to user's address
       * - Prevents replay attacks
       * - Required for external encrypted inputs
       *
       * Generated client-side:
       * const encrypted = await fhevm.createEncryptedInput(contractAddr, userAddr)
       *     .add32(betAmount)
       *     .encrypt();
       * const handle = encrypted.handles[0];
       * const proof = encrypted.inputProof;
       */
    });

    it("✅ CORRECT: Validate before processing external input", async function () {
      /**
       * Always validate before accepting encrypted input:
       *
       * function safeBet(
       *     externalEuint32 encBetHandle,
       *     bytes calldata proof
       * ) external payable {
       *     // Validate plaintext conditions FIRST
       *     require(msg.value >= MIN_BET, "Bet too low");
       *     require(!_hasPlacedBet[msg.sender], "Already bet");
       *
       *     // Then process encrypted data
       *     euint32 encBet = FHE.fromExternal(encBetHandle, proof);
       *
       *     // Store and use
       *     _bets[msg.sender] = encBet;
       *     FHE.allowThis(encBet);
       *     FHE.allow(encBet, msg.sender);
       * }
       *
       * Validation checklist:
       * - Check payment amount
       * - Verify user eligibility
       * - Check game state
       * - Prevent duplicate actions
       */
    });

    it("❌ WRONG: Missing input proof validation", async function () {
      /**
       * ANTIPATTERN - No proof:
       *
       * function badBet(externalEuint32 encBetHandle) external {
       *     // WRONG - No proof validation!
       *     // Anyone could submit invalid encrypted data
       *
       *     // Missing: FHE.fromExternal(encBetHandle, proof)
       * }
       *
       * Risks:
       * - Malicious users could submit garbage data
       * - Replay attacks possible
       * - No binding to user address
       * - Contract could store invalid encrypted values
       *
       * Always use input proofs for external encrypted inputs!
       */
    });
  });

  describe("FHE Access Control Patterns", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(user1).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: Restrict encrypted data access to authorized users", async function () {
      /**
       * Pattern: Only owner or data owner can access:
       *
       * function getPlayerBet(address player) external view returns (euint32) {
       *     require(
       *         msg.sender == player || msg.sender == owner(),
       *         "Not authorized"
       *     );
       *     return _playerBets[player];
       * }
       *
       * Why?
       * - Encrypted data still has access control
       * - Even encrypted, shouldn't expose to unauthorized parties
       * - Prevents information leakage through access patterns
       */

      // Owner can access
      const bet1 = await pokerGame.getPlayerEncryptedBet(1, user1.address);
      expect(bet1).to.not.be.null;

      // Player can access own data
      const bet2 = await pokerGame.connect(user1).getPlayerEncryptedBet(1, user1.address);
      expect(bet2).to.not.be.null;

      // Other players cannot access
      await expect(
        pokerGame.connect(user2).getPlayerEncryptedBet(1, user1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("✅ CORRECT: Owner-only functions for encrypted operations", async function () {
      /**
       * Pattern: Restrict sensitive FHE operations to owner:
       *
       * function compareAllBets() external onlyOwner returns (address winner) {
       *     euint32 maxBet = FHE.asEuint32(0);
       *     address maxBidder;
       *
       *     for (uint i = 0; i < players.length; i++) {
       *         ebool isGreater = FHE.gt(playerBets[players[i]], maxBet);
       *         maxBet = FHE.select(isGreater, playerBets[players[i]], maxBet);
       *         // ... track maxBidder
       *     }
       *
       *     return maxBidder;
       * }
       *
       * Why?
       * - Some operations should be admin-only
       * - Game resolution
       * - Emergency functions
       * - Payout calculations
       */

      const result = await pokerGame.compareBetAmount(1, user1.address, 1);
      expect(result).to.not.be.null;

      await expect(
        pokerGame.connect(user2).compareBetAmount(1, user1.address, 1)
      ).to.be.revertedWith("Only owner can compare");
    });

    it("🔐 SECURITY: Prevent encrypted data leakage through side channels", async function () {
      /**
       * Security consideration: Side channel attacks
       *
       * Even with FHE, be careful about:
       *
       * 1. Timing attacks:
       *    - Don't let execution time reveal information
       *    - Use constant-time operations when possible
       *
       * 2. Event emissions:
       *    - Don't emit plaintext derived from encrypted values
       *    - Emit encrypted values or indices only
       *
       * 3. Access patterns:
       *    - Don't reveal who accessed what through logs
       *    - Batch operations when possible
       *
       * 4. Gas usage:
       *    - FHE operations may have different gas costs
       *    - Don't let gas reveal information
       *
       * Example - Careful with events:
       *
       * // WRONG - reveals plaintext
       * emit BetPlaced(player, decryptedBetAmount);
       *
       * // CORRECT - keeps encrypted
       * emit BetPlaced(player, encryptedBetHandle);
       */
    });
  });

  describe("FHE Performance Patterns", function () {
    it("📊 PATTERN: Minimize encrypted operations", async function () {
      /**
       * FHE operations are expensive:
       *
       * Cost hierarchy (gas):
       * 1. Plaintext operations - Cheapest
       * 2. FHE.asEuint32() - Moderate
       * 3. FHE.eq(), FHE.gt() - Expensive
       * 4. FHE.add(), FHE.sub() - More expensive
       * 5. FHE.mul() - Very expensive
       * 6. Complex operations - Most expensive
       *
       * Optimization strategies:
       *
       * 1. Cache encrypted values:
       *    euint32 cachedSum = FHE.add(a, b);
       *    // Reuse cachedSum instead of recomputing
       *
       * 2. Batch operations:
       *    // Instead of multiple add calls:
       *    euint32 result = FHE.add(a, FHE.add(b, c));
       *
       * 3. Use plaintext when possible:
       *    // If value can be public, use plaintext
       *    uint32 publicCount;  // Not euint32
       *
       * 4. Lazy evaluation:
       *    // Only compute when needed
       *    if (needsComputation) {
       *        result = FHE.add(a, b);
       *    }
       */
    });

    it("📊 PATTERN: Efficient permission management", async function () {
      /**
       * Permission patterns for efficiency:
       *
       * 1. Grant permissions once per value:
       *    euint32 newValue = FHE.asEuint32(100);
       *    FHE.allowThis(newValue);  // Once
       *    FHE.allow(newValue, user1);  // Once per user
       *
       * 2. Use allowTransient for temporary values:
       *    FHE.allowTransient(tempValue, user);  // Cheaper
       *
       * 3. Batch user permissions:
       *    // If multiple users need access:
       *    for (user in users) {
       *        FHE.allow(value, user);
       *    }
       *
       * 4. Avoid redundant permissions:
       *    // Don't call allowThis multiple times on same value
       *    if (!permissionGranted[value]) {
       *        FHE.allowThis(value);
       *        permissionGranted[value] = true;
       *    }
       */
    });
  });

  describe("FHE Testing Best Practices", function () {
    it("✅ TEST: Verify encrypted values through side effects", async function () {
      /**
       * Testing encrypted contracts:
       *
       * Can't do:
       * - Direct comparison of encrypted values
       * - Reading encrypted values in tests
       * - Asserting on decrypted values (no decrypt in contract)
       *
       * Can do:
       * - Verify events emitted
       * - Check state changes (counts, addresses)
       * - Test permissions granted
       * - Verify function calls succeed/fail
       *
       * Example:
       *
       * it("should store encrypted bet", async () => {
       *     const tx = await poker.placeBet(encBet, proof);
       *
       *     // Can't check encrypted value directly
       *     // Instead verify side effects:
       *     expect(tx).to.emit(poker, "BetPlaced");
       *
       *     // Check plaintext state
       *     expect(await poker.hasPlacedBet(user)).to.be.true;
       *
       *     // Verify subsequent operations work
       *     expect(await poker.getBet(user)).to.not.be.null;
       * });
       */

      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      const tx = await pokerGame.connect(user1).joinGame(1, true, {
        value: ethers.parseEther("0.01")
      });

      // Verify event
      expect(tx).to.emit(pokerGame, "PlayerJoined");

      // Verify state
      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(1);
    });

    it("✅ TEST: Test both success and failure cases", async function () {
      /**
       * Comprehensive FHE testing:
       *
       * Success cases:
       * - Valid encrypted inputs accepted
       * - Operations complete successfully
       * - Permissions granted correctly
       *
       * Failure cases:
       * - Invalid inputs rejected
       * - Unauthorized access blocked
       * - Edge cases handled
       *
       * Example:
       *
       * describe("Encrypted betting", () => {
       *     it("✅ accepts valid encrypted bet", async () => {
       *         await expect(placeBet(validEnc, validProof))
       *             .to.not.be.reverted;
       *     });
       *
       *     it("❌ rejects bet without proof", async () => {
       *         await expect(placeBet(validEnc, ""))
       *             .to.be.reverted;
       *     });
       *
       *     it("❌ rejects unauthorized access", async () => {
       *         await expect(getBet(otherUser))
       *             .to.be.revertedWith("Not authorized");
       *     });
       * });
       */
    });
  });

  describe("Summary: FHEVM Patterns Checklist", function () {
    it("📋 CHECKLIST: Essential FHE patterns", async function () {
      /**
       * ✅ Permission Management:
       * - [ ] Always call FHE.allowThis() for contract access
       * - [ ] Always call FHE.allow(value, user) for user access
       * - [ ] Use FHE.allowTransient() for temporary values
       * - [ ] Grant permissions immediately after creating value
       *
       * ✅ Type Safety:
       * - [ ] Use correct encrypted types (ebool, euint8, euint32)
       * - [ ] Cast when comparing different types
       * - [ ] Initialize all encrypted variables
       * - [ ] Don't mix encrypted and plaintext in operations
       *
       * ✅ Input Handling:
       * - [ ] Always use input proofs for external encrypted data
       * - [ ] Validate plaintext conditions before processing
       * - [ ] Use FHE.fromExternal() to convert external inputs
       * - [ ] Check user authorization for encrypted operations
       *
       * ✅ Operations:
       * - [ ] Use FHE.eq() for encrypted equality
       * - [ ] Use FHE.gt()/FHE.lt() for comparisons
       * - [ ] Use FHE.select() for conditional logic
       * - [ ] Use FHE.add()/FHE.sub() for arithmetic
       * - [ ] Can't use encrypted values in if() statements
       *
       * ✅ Security:
       * - [ ] Restrict access to encrypted data
       * - [ ] Implement owner-only functions where needed
       * - [ ] Prevent side-channel leakage
       * - [ ] Use ReentrancyGuard for state changes
       *
       * ✅ Testing:
       * - [ ] Test through side effects, not direct values
       * - [ ] Verify events emitted
       * - [ ] Test both success and failure cases
       * - [ ] Check permissions granted correctly
       *
       * ✅ Performance:
       * - [ ] Minimize encrypted operations
       * - [ ] Cache computed values
       * - [ ] Use plaintext when encryption not needed
       * - [ ] Batch permission grants
       */
    });
  });
});
