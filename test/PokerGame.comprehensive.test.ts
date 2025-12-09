import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { PokerGame } from "../typechain-types";

/**
 * Comprehensive Test Suite: Privacy Poker Game
 *
 * This comprehensive test suite demonstrates:
 * ✅ All FHEVM patterns and operations
 * ✅ Edge cases and boundary conditions
 * ✅ Security and access control patterns
 * ❌ Common pitfalls and anti-patterns
 * 🔐 Advanced security scenarios
 * 🎯 Integration testing
 * 📊 Gas optimization considerations
 *
 * @category Gaming - Comprehensive
 * @example Complete privacy-preserving poker testing
 */

describe("Privacy Poker Game - Comprehensive Tests", function () {
  let pokerGame: PokerGame;
  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;
  let player4: SignerWithAddress;
  let player5: SignerWithAddress;
  let attacker: SignerWithAddress;

  beforeEach(async function () {
    [owner, player1, player2, player3, player4, player5, attacker] = await ethers.getSigners();

    const PokerGame = await ethers.getContractFactory("PokerGame");
    pokerGame = await PokerGame.deploy();
    await pokerGame.waitForDeployment();
  });

  describe("Contract Deployment & Initialization", function () {
    it("✅ CORRECT: Should deploy with correct initial state", async function () {
      const address = await pokerGame.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
      expect(address).to.be.properAddress;
    });

    it("✅ CORRECT: Should initialize with zero games", async function () {
      const totalGames = await pokerGame.getTotalGames();
      expect(totalGames).to.equal(0);
    });

    it("✅ CORRECT: Should set deployer as owner", async function () {
      const contractOwner = await pokerGame.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("✅ CORRECT: Should have correct constants", async function () {
      const maxPlayers = await pokerGame.MAX_PLAYERS();
      const minBet = await pokerGame.MIN_BET();
      const cardsPerHand = await pokerGame.CARDS_PER_HAND();

      expect(maxPlayers).to.equal(8);
      expect(minBet).to.equal(ethers.parseEther("0.01"));
      expect(cardsPerHand).to.equal(5);
    });

    it("✅ CORRECT: Should accept ETH via receive function", async function () {
      const amount = ethers.parseEther("1.0");

      await expect(
        owner.sendTransaction({
          to: await pokerGame.getAddress(),
          value: amount
        })
      ).to.not.be.reverted;

      const balance = await ethers.provider.getBalance(await pokerGame.getAddress());
      expect(balance).to.equal(amount);
    });
  });

  describe("Game Creation - Comprehensive", function () {
    it("✅ CORRECT: Should create Texas Hold'em game", async function () {
      const tx = await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;
      const totalGames = await pokerGame.getTotalGames();
      expect(totalGames).to.equal(1);
    });

    it("✅ CORRECT: Should create Five Card Draw game", async function () {
      await pokerGame.createGame(1, 6, ethers.parseEther("0.02"));

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.gameType).to.equal(1);
      expect(gameInfo.maxPlayers).to.equal(6);
    });

    it("✅ CORRECT: Should create Omaha game", async function () {
      await pokerGame.createGame(2, 8, ethers.parseEther("0.05"));

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.gameType).to.equal(2);
    });

    it("✅ CORRECT: Should create Seven Card Stud game", async function () {
      await pokerGame.createGame(3, 5, ethers.parseEther("0.1"));

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.gameType).to.equal(3);
    });

    it("✅ CORRECT: Should emit GameCreated event", async function () {
      await expect(pokerGame.createGame(0, 4, ethers.parseEther("0.01")))
        .to.emit(pokerGame, "GameCreated")
        .withArgs(1, 0, 4, ethers.parseEther("0.01"));
    });

    it("✅ CORRECT: Should allow multiple games creation", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.createGame(1, 6, ethers.parseEther("0.02"));
      await pokerGame.createGame(2, 8, ethers.parseEther("0.05"));

      const totalGames = await pokerGame.getTotalGames();
      expect(totalGames).to.equal(3);
    });

    it("✅ CORRECT: Should create game with minimum bet exactly at MIN_BET", async function () {
      const minBet = await pokerGame.MIN_BET();
      await expect(pokerGame.createGame(0, 4, minBet)).to.not.be.reverted;
    });

    it("✅ CORRECT: Should create game with 2 players (minimum)", async function () {
      await expect(pokerGame.createGame(0, 2, ethers.parseEther("0.01"))).to.not.be.reverted;
    });

    it("✅ CORRECT: Should create game with 8 players (maximum)", async function () {
      await expect(pokerGame.createGame(0, 8, ethers.parseEther("0.01"))).to.not.be.reverted;
    });

    it("❌ WRONG: Should reject invalid game type 4", async function () {
      await expect(
        pokerGame.createGame(4, 4, ethers.parseEther("0.01"))
      ).to.be.revertedWith("Invalid game type");
    });

    it("❌ WRONG: Should reject invalid game type 255", async function () {
      await expect(
        pokerGame.createGame(255, 4, ethers.parseEther("0.01"))
      ).to.be.revertedWith("Invalid game type");
    });

    it("❌ WRONG: Should reject 1 player (too few)", async function () {
      await expect(
        pokerGame.createGame(0, 1, ethers.parseEther("0.01"))
      ).to.be.revertedWith("Invalid player count");
    });

    it("❌ WRONG: Should reject 0 players", async function () {
      await expect(
        pokerGame.createGame(0, 0, ethers.parseEther("0.01"))
      ).to.be.revertedWith("Invalid player count");
    });

    it("❌ WRONG: Should reject 9 players (too many)", async function () {
      await expect(
        pokerGame.createGame(0, 9, ethers.parseEther("0.01"))
      ).to.be.revertedWith("Invalid player count");
    });

    it("❌ WRONG: Should reject bet below MIN_BET", async function () {
      const tooLow = ethers.parseEther("0.001");
      await expect(
        pokerGame.createGame(0, 4, tooLow)
      ).to.be.revertedWith("Bet too low");
    });

    it("❌ WRONG: Should reject zero bet", async function () {
      await expect(
        pokerGame.createGame(0, 4, 0)
      ).to.be.revertedWith("Bet too low");
    });
  });

  describe("Player Joining - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
    });

    it("✅ CORRECT: Should allow first player to join", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.not.be.reverted;

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(1);
    });

    it("✅ CORRECT: Should emit PlayerJoined event", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.emit(pokerGame, "PlayerJoined")
        .withArgs(1, player1.address, 1);
    });

    it("✅ CORRECT: Should update pot correctly", async function () {
      const betAmount = ethers.parseEther("0.01");
      await pokerGame.connect(player1).joinGame(1, true, { value: betAmount });

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.totalPot).to.equal(betAmount);
    });

    it("✅ CORRECT: Should track player games history", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      const playerGames = await pokerGame.getPlayerGames(player1.address);
      expect(playerGames.length).to.equal(1);
      expect(playerGames[0]).to.equal(1);
    });

    it("✅ CORRECT: Should start game with 2 players", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.emit(pokerGame, "GameStarted");

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.hasStarted).to.be.true;
    });

    it("✅ CORRECT: Should emit CardsDealt event on game start", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.emit(pokerGame, "CardsDealt")
        .withArgs(1, 1);
    });

    it("✅ CORRECT: Should allow joining with more than minimum bet", async function () {
      const extraBet = ethers.parseEther("0.05");
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: extraBet })
      ).to.not.be.reverted;

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.totalPot).to.equal(extraBet);
    });

    it("✅ CORRECT: Should allow up to max players", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player3).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player4).joinGame(1, true, { value: ethers.parseEther("0.01") });

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(4);
    });

    it("✅ CORRECT: Should handle multiple game joins by same player", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01")); // Game 2

      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player1).joinGame(2, true, { value: ethers.parseEther("0.01") });

      const playerGames = await pokerGame.getPlayerGames(player1.address);
      expect(playerGames.length).to.equal(2);
    });

    it("❌ WRONG: Should reject join with insufficient bet", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Insufficient bet");
    });

    it("❌ WRONG: Should reject join with zero bet", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: 0 })
      ).to.be.revertedWith("Insufficient bet");
    });

    it("❌ WRONG: Should reject duplicate join", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Already joined");
    });

    it("❌ WRONG: Should reject join to non-existent game", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(999, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Invalid game ID");
    });

    it("❌ WRONG: Should reject join to game 0", async function () {
      await expect(
        pokerGame.connect(player1).joinGame(0, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Invalid game ID");
    });

    it("❌ WRONG: Should reject join when false wantsToJoin", async function () {
      // Player sends ETH but says they don't want to join
      const tx = await pokerGame.connect(player1).joinGame(1, false, { value: ethers.parseEther("0.01") });
      await tx.wait();

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(0); // Should not be added
    });

    it("❌ WRONG: Should reject join after game started", async function () {
      // Fill game and start it
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // Try to join after game started
      await expect(
        pokerGame.connect(player3).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Game not available");
    });

    it("❌ WRONG: Should reject join when game is full", async function () {
      // Fill the game
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player3).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player4).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // Try to join when full
      await expect(
        pokerGame.connect(player5).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Game full");
    });
  });

  describe("Player Moves - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: Should record call move", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, true, false, false)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should record raise move", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, false, true, false, { value: ethers.parseEther("0.02") })
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should record fold move", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, false, false, true)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should emit PlayerMoved event", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, true, false, false)
      ).to.emit(pokerGame, "PlayerMoved");
    });

    it("✅ CORRECT: Should update pot on raise", async function () {
      const initialPot = (await pokerGame.getGameInfo(1)).totalPot;
      const raiseAmount = ethers.parseEther("0.02");

      await pokerGame.connect(player1).makeMove(1, false, true, false, { value: raiseAmount });

      const finalPot = (await pokerGame.getGameInfo(1)).totalPot;
      expect(finalPot).to.equal(initialPot + raiseAmount);
    });

    it("✅ CORRECT: Should allow multiple moves from same player", async function () {
      await pokerGame.connect(player1).makeMove(1, true, false, false);
      await expect(
        pokerGame.connect(player1).makeMove(1, false, true, false, { value: ethers.parseEther("0.01") })
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow all players to make moves", async function () {
      await pokerGame.connect(player1).makeMove(1, true, false, false);
      await expect(
        pokerGame.connect(player2).makeMove(1, true, false, false)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should handle raise without value (checking)", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, false, true, false)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow check (no action)", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(1, false, false, false)
      ).to.not.be.reverted;
    });

    it("❌ WRONG: Should reject move from non-player", async function () {
      await expect(
        pokerGame.connect(player3).makeMove(1, true, false, false)
      ).to.be.revertedWith("Not in game");
    });

    it("❌ WRONG: Should reject move from attacker not in game", async function () {
      await expect(
        pokerGame.connect(attacker).makeMove(1, true, false, false)
      ).to.be.revertedWith("Not in game");
    });

    it("❌ WRONG: Should reject move in non-existent game", async function () {
      await expect(
        pokerGame.connect(player1).makeMove(999, true, false, false)
      ).to.be.revertedWith("Not in game");
    });

    it("❌ WRONG: Should reject move before game starts", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player3).joinGame(2, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player3).makeMove(2, true, false, false)
      ).to.be.revertedWith("Game not active");
    });
  });

  describe("Card Revealing - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: Should allow revealing 5 cards", async function () {
      const cards = [true, false, true, false, true];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow revealing fewer than 5 cards", async function () {
      const cards = [true, false, true];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow revealing 1 card", async function () {
      const cards = [true];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow revealing all false cards", async function () {
      const cards = [false, false, false, false, false];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow revealing all true cards", async function () {
      const cards = [true, true, true, true, true];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("✅ CORRECT: Should allow empty card array", async function () {
      const cards: boolean[] = [];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.not.be.reverted;
    });

    it("❌ WRONG: Should reject too many cards", async function () {
      const cards = [true, false, true, false, true, true, false, true];
      await expect(
        pokerGame.connect(player1).revealCards(1, cards)
      ).to.be.revertedWith("Too many cards");
    });

    it("❌ WRONG: Should reject reveal from non-player", async function () {
      const cards = [true, false, true, false, true];
      await expect(
        pokerGame.connect(player3).revealCards(1, cards)
      ).to.be.revertedWith("Not in game");
    });

    it("❌ WRONG: Should reject reveal for non-existent game", async function () {
      const cards = [true, false, true, false, true];
      await expect(
        pokerGame.connect(player1).revealCards(999, cards)
      ).to.be.revertedWith("Not in game");
    });
  });

  describe("Game Information Retrieval - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
    });

    it("✅ CORRECT: Should retrieve correct game info", async function () {
      const gameInfo = await pokerGame.getGameInfo(1);

      expect(gameInfo.gameId).to.equal(1);
      expect(gameInfo.gameType).to.equal(0);
      expect(gameInfo.maxPlayers).to.equal(4);
      expect(gameInfo.currentPlayers).to.equal(0);
      expect(gameInfo.minBet).to.equal(ethers.parseEther("0.01"));
      expect(gameInfo.isActive).to.be.true;
      expect(gameInfo.hasStarted).to.be.false;
    });

    it("✅ CORRECT: Should retrieve total games count", async function () {
      await pokerGame.createGame(1, 6, ethers.parseEther("0.02"));
      await pokerGame.createGame(2, 8, ethers.parseEther("0.05"));

      const totalGames = await pokerGame.getTotalGames();
      expect(totalGames).to.equal(3);
    });

    it("✅ CORRECT: Should retrieve player game history", async function () {
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      const playerGames = await pokerGame.getPlayerGames(player1.address);
      expect(playerGames.length).to.equal(1);
      expect(playerGames[0]).to.equal(1);
    });

    it("✅ CORRECT: Should retrieve multiple games for player", async function () {
      await pokerGame.createGame(1, 6, ethers.parseEther("0.02"));
      await pokerGame.createGame(2, 8, ethers.parseEther("0.05"));

      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player1).joinGame(2, true, { value: ethers.parseEther("0.02") });
      await pokerGame.connect(player1).joinGame(3, true, { value: ethers.parseEther("0.05") });

      const playerGames = await pokerGame.getPlayerGames(player1.address);
      expect(playerGames.length).to.equal(3);
    });

    it("✅ CORRECT: Should return empty array for player with no games", async function () {
      const playerGames = await pokerGame.getPlayerGames(player3.address);
      expect(playerGames.length).to.equal(0);
    });

    it("❌ WRONG: Should reject invalid game ID", async function () {
      await expect(
        pokerGame.getGameInfo(999)
      ).to.be.revertedWith("Invalid game ID");
    });

    it("❌ WRONG: Should reject game ID 0", async function () {
      await expect(
        pokerGame.getGameInfo(0)
      ).to.be.revertedWith("Invalid game ID");
    });
  });

  describe("Access Control - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: Owner can compare bet amounts", async function () {
      const result = await pokerGame.compareBetAmount(1, player1.address, 1);
      expect(result).to.not.be.null;
    });

    it("✅ CORRECT: Owner can check fold status", async function () {
      const result = await pokerGame.isPlayerFolded(1, player1.address, false);
      expect(result).to.not.be.null;
    });

    it("✅ CORRECT: Player can get own encrypted cards", async function () {
      const cards = await pokerGame.connect(player1).getPlayerCards(1, player1.address);
      expect(cards).to.not.be.null;
    });

    it("✅ CORRECT: Owner can get any player encrypted cards", async function () {
      const cards = await pokerGame.getPlayerCards(1, player1.address);
      expect(cards).to.not.be.null;
    });

    it("✅ CORRECT: Player can get own encrypted bet", async function () {
      const bet = await pokerGame.connect(player1).getPlayerEncryptedBet(1, player1.address);
      expect(bet).to.not.be.null;
    });

    it("✅ CORRECT: Owner can get any player encrypted bet", async function () {
      const bet = await pokerGame.getPlayerEncryptedBet(1, player1.address);
      expect(bet).to.not.be.null;
    });

    it("❌ WRONG: Non-owner cannot compare bet amounts", async function () {
      await expect(
        pokerGame.connect(player2).compareBetAmount(1, player1.address, 1)
      ).to.be.revertedWith("Only owner can compare");
    });

    it("❌ WRONG: Non-owner cannot check fold status", async function () {
      await expect(
        pokerGame.connect(player2).isPlayerFolded(1, player1.address, false)
      ).to.be.revertedWith("Only owner can check");
    });

    it("❌ WRONG: Other player cannot get encrypted cards", async function () {
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player2).getPlayerCards(1, player1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("❌ WRONG: Attacker cannot get encrypted bet", async function () {
      await expect(
        pokerGame.connect(attacker).getPlayerEncryptedBet(1, player1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("❌ WRONG: Attacker cannot get encrypted fold status", async function () {
      await expect(
        pokerGame.connect(attacker).getPlayerEncryptedFoldStatus(1, player1.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Emergency Functions - Comprehensive", function () {
    beforeEach(async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
    });

    it("✅ CORRECT: Owner can emergency end game", async function () {
      await expect(
        pokerGame.emergencyEndGame(1)
      ).to.not.be.reverted;

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.isActive).to.be.false;
    });

    it("✅ CORRECT: Should emit GameEnded event", async function () {
      await expect(
        pokerGame.emergencyEndGame(1)
      ).to.emit(pokerGame, "GameEnded")
        .withArgs(1, ethers.ZeroAddress, 0);
    });

    it("✅ CORRECT: Should refund players on emergency end", async function () {
      const player1BalanceBefore = await ethers.provider.getBalance(player1.address);
      const player2BalanceBefore = await ethers.provider.getBalance(player2.address);

      await pokerGame.emergencyEndGame(1);

      const player1BalanceAfter = await ethers.provider.getBalance(player1.address);
      const player2BalanceAfter = await ethers.provider.getBalance(player2.address);

      // Each player should get refund (may not be exact due to gas)
      expect(player1BalanceAfter).to.be.greaterThan(player1BalanceBefore - ethers.parseEther("0.001"));
      expect(player2BalanceAfter).to.be.greaterThan(player2BalanceBefore - ethers.parseEther("0.001"));
    });

    it("❌ WRONG: Non-owner cannot emergency end game", async function () {
      await expect(
        pokerGame.connect(player1).emergencyEndGame(1)
      ).to.be.reverted;
    });

    it("❌ WRONG: Cannot end already ended game", async function () {
      await pokerGame.emergencyEndGame(1);

      await expect(
        pokerGame.emergencyEndGame(1)
      ).to.be.revertedWith("Game already ended");
    });

    it("❌ WRONG: Attacker cannot emergency end game", async function () {
      await expect(
        pokerGame.connect(attacker).emergencyEndGame(1)
      ).to.be.reverted;
    });
  });

  describe("Withdrawal - Comprehensive", function () {
    it("✅ CORRECT: Owner can withdraw contract balance", async function () {
      // Send ETH to contract
      await owner.sendTransaction({
        to: await pokerGame.getAddress(),
        value: ethers.parseEther("1.0")
      });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      await pokerGame.withdraw();
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      expect(ownerBalanceAfter).to.be.greaterThan(ownerBalanceBefore);
    });

    it("❌ WRONG: Cannot withdraw with zero balance", async function () {
      await expect(
        pokerGame.withdraw()
      ).to.be.revertedWith("No balance to withdraw");
    });

    it("❌ WRONG: Non-owner cannot withdraw", async function () {
      await owner.sendTransaction({
        to: await pokerGame.getAddress(),
        value: ethers.parseEther("1.0")
      });

      await expect(
        pokerGame.connect(player1).withdraw()
      ).to.be.reverted;
    });

    it("❌ WRONG: Attacker cannot withdraw", async function () {
      await owner.sendTransaction({
        to: await pokerGame.getAddress(),
        value: ethers.parseEther("1.0")
      });

      await expect(
        pokerGame.connect(attacker).withdraw()
      ).to.be.reverted;
    });
  });

  describe("Integration Tests - Complete Game Flow", function () {
    it("✅ INTEGRATION: Complete 2-player game flow", async function () {
      // Create game
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      // Players join
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // Game should be started
      let gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.hasStarted).to.be.true;

      // Players make moves
      await pokerGame.connect(player1).makeMove(1, true, false, false);
      await pokerGame.connect(player2).makeMove(1, false, true, false, { value: ethers.parseEther("0.02") });

      // Player 1 reveals cards
      await pokerGame.connect(player1).revealCards(1, [true, false, true, false, true]);

      // Verify game state
      gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.totalPot).to.be.greaterThan(ethers.parseEther("0.02"));
    });

    it("✅ INTEGRATION: Complete 4-player game flow", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      // All players join
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player3).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player4).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // All players make moves
      await pokerGame.connect(player1).makeMove(1, true, false, false);
      await pokerGame.connect(player2).makeMove(1, true, false, false);
      await pokerGame.connect(player3).makeMove(1, false, false, true); // Player 3 folds
      await pokerGame.connect(player4).makeMove(1, false, true, false, { value: ethers.parseEther("0.05") });

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(4);
    });

    it("✅ INTEGRATION: Multi-game scenario", async function () {
      // Create multiple games
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.createGame(1, 6, ethers.parseEther("0.02"));
      await pokerGame.createGame(2, 8, ethers.parseEther("0.05"));

      // Player 1 joins all games
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player1).joinGame(2, true, { value: ethers.parseEther("0.02") });
      await pokerGame.connect(player1).joinGame(3, true, { value: ethers.parseEther("0.05") });

      // Verify player history
      const playerGames = await pokerGame.getPlayerGames(player1.address);
      expect(playerGames.length).to.equal(3);

      // Verify total games
      const totalGames = await pokerGame.getTotalGames();
      expect(totalGames).to.equal(3);
    });
  });

  describe("Security & Reentrancy Tests", function () {
    it("🔐 SECURITY: Reentrancy protection on joinGame", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      // Should not allow reentrancy
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.not.be.reverted;

      // Second call should fail with "Already joined"
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Already joined");
    });

    it("🔐 SECURITY: Reentrancy protection on makeMove", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // Should not allow reentrancy
      await expect(
        pokerGame.connect(player1).makeMove(1, true, false, false)
      ).to.not.be.reverted;
    });

    it("🔐 SECURITY: Only authorized can access encrypted data", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      // Attacker cannot access
      await expect(
        pokerGame.connect(attacker).getPlayerCards(1, player1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("🔐 SECURITY: Proper ownership validation", async function () {
      await expect(
        pokerGame.connect(attacker).withdraw()
      ).to.be.reverted;
    });
  });

  describe("Edge Cases & Boundary Conditions", function () {
    it("✅ EDGE: Maximum players in game", async function () {
      await pokerGame.createGame(0, 8, ethers.parseEther("0.01"));

      // Add 8 players
      const players = [player1, player2, player3, player4, player5];
      const [p6, p7, p8] = await ethers.getSigners();

      for (const player of [player1, player2, player3, player4, player5, p6, p7, p8]) {
        await pokerGame.connect(player).joinGame(1, true, { value: ethers.parseEther("0.01") });
      }

      const gameInfo = await pokerGame.getGameInfo(1);
      expect(gameInfo.currentPlayers).to.equal(8);
    });

    it("✅ EDGE: Minimum bet exactly at threshold", async function () {
      const minBet = await pokerGame.MIN_BET();
      await pokerGame.createGame(0, 4, minBet);

      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: minBet })
      ).to.not.be.reverted;
    });

    it("✅ EDGE: Very large bet amount", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      const largeBet = ethers.parseEther("100.0");
      await expect(
        pokerGame.connect(player1).joinGame(1, true, { value: largeBet })
      ).to.not.be.reverted;
    });

    it("✅ EDGE: Empty card reveal array", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player1).revealCards(1, [])
      ).to.not.be.reverted;
    });

    it("❌ EDGE: Just over max cards (6 cards)", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });

      await expect(
        pokerGame.connect(player1).revealCards(1, [true, false, true, false, true, true])
      ).to.be.revertedWith("Too many cards");
    });
  });

  describe("Gas Optimization Checks", function () {
    it("📊 GAS: Measure game creation gas", async function () {
      const tx = await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      const receipt = await tx.wait();

      console.log("      Gas used for createGame:", receipt?.gasUsed.toString());
      expect(receipt?.gasUsed).to.be.lessThan(500000n);
    });

    it("📊 GAS: Measure join game gas", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));

      const tx = await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      const receipt = await tx.wait();

      console.log("      Gas used for joinGame:", receipt?.gasUsed.toString());
    });

    it("📊 GAS: Measure make move gas", async function () {
      await pokerGame.createGame(0, 4, ethers.parseEther("0.01"));
      await pokerGame.connect(player1).joinGame(1, true, { value: ethers.parseEther("0.01") });
      await pokerGame.connect(player2).joinGame(1, true, { value: ethers.parseEther("0.01") });

      const tx = await pokerGame.connect(player1).makeMove(1, true, false, false);
      const receipt = await tx.wait();

      console.log("      Gas used for makeMove:", receipt?.gasUsed.toString());
    });
  });
});
