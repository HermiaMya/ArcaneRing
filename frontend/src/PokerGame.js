import React, { useState, useEffect } from 'react';

const PokerGame = () => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [diceRolls, setDiceRolls] = useState([]);
  const [playerMoney, setPlayerMoney] = useState(0); // 初始金钱为10
  const [refreshCount, setRefreshCount] = useState(0); // 刷新骰子次数
  const [currentRound, setCurrentRound] = useState(1); // 当前回合
  const [gameStarted, setGameStarted] = useState(false); // 游戏是否开始
  const [actionPoints, setActionPoints] = useState(1); // 行动点
  const [selectedCards, setSelectedCards] = useState([]); // 选中的牌
  const [diceConfirmed, setDiceConfirmed] = useState(false); // 骰子点数是否已确认
  const [selectedDice, setSelectedDice] = useState([]); // 选中的骰子

  useEffect(() => {
    if (gameStarted) {
      dealInitialCards();
    }
  }, [gameStarted]);

  function createDeck() {
    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
    return deck;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function dealInitialCards() {
    const shuffledDeck = shuffleDeck([...deck]);
    setDeck(shuffledDeck);
    setPlayerHand(sortHand(shuffledDeck.slice(0, 3)));
    setDealerHand(shuffledDeck.slice(3, 6));
    setDeck(shuffledDeck.slice(6));
  }

  function rollDice() {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    setDiceRolls(rolls);
    setRefreshCount(refreshCount + 1);
  }

  function refreshSelectedDice() {
    if (refreshCount < 3) {
      const newDiceRolls = [...diceRolls];
      selectedDice.forEach((index) => {
        newDiceRolls[index] = Math.floor(Math.random() * 6) + 1;
      });
      setDiceRolls(newDiceRolls);
      setRefreshCount(refreshCount + 1);
      setSelectedDice([]);
    }
  }

  function confirmDiceResults() {
    let moneyChange = 0;
    let actionPointsChange = 1; // 每回合默认有一点行动点
    let additionalDrawCount = 0;

    diceRolls.forEach(roll => {
      if (roll === 1 || roll === 6) {
        moneyChange += 1;
      } else if (roll === 4 || roll === 5) {
        actionPointsChange += 1;
      } else if (roll === 2 || roll === 3) {
        additionalDrawCount += 1;
      }
    });

    setPlayerMoney(playerMoney + moneyChange);
    setActionPoints(actionPointsChange);
    setDiceConfirmed(true);

    if (additionalDrawCount > 0) {
      drawCards(additionalDrawCount);
    }
  }

  function selectCard(card) {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  }

  function playSelectedCards() {
    if (selectedCards.length <= actionPoints) {
      const newPlayerHand = playerHand.filter(card => !selectedCards.includes(card));
      setPlayerHand(newPlayerHand);
      setActionPoints(actionPoints - selectedCards.length);
      setSelectedCards([]);
    }
  }

  function drawCards(count) {
    if (deck.length < count) {
      alert('Not enough cards in the deck!');
      return;
    }
    const newPlayerHand = sortHand([...playerHand, ...deck.slice(0, count)]);
    setPlayerHand(newPlayerHand);
    setDeck(deck.slice(count));
  }

  function sortHand(hand) {
    const valuesOrder = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
    return hand.sort((a, b) => valuesOrder[a.value] - valuesOrder[b.value]);
  }

  function resetGame() {
    setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setDiceRolls([]);
    setPlayerMoney(10);
    setRefreshCount(0);
    setCurrentRound(1);
    setGameStarted(false);
    setActionPoints(1);
    setSelectedCards([]);
    setDiceConfirmed(false);
    setSelectedDice([]);
  }

  function endTurn() {
    if (actionPoints > 0) {
      drawCards(actionPoints);
      setActionPoints(0);
    }
    setDiceConfirmed(false);
    setDiceRolls([]);
    setRefreshCount(0);
    setCurrentRound(currentRound + 1);
    setSelectedCards([]);
    setSelectedDice([]);
  }

  function selectDice(index) {
    if (selectedDice.includes(index)) {
      setSelectedDice(selectedDice.filter(i => i !== index));
    } else {
      setSelectedDice([...selectedDice, index]);
    }
  }

  return (
    <div>
      {!gameStarted ? (
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      ) : (
        <>
          <h1>Poker Game</h1>
          <button onClick={rollDice} disabled={refreshCount >= 3 || diceConfirmed}>Roll Dice</button>
          <button onClick={refreshSelectedDice} disabled={selectedDice.length === 0 || refreshCount >= 3 || diceConfirmed}>Refresh Selected Dice</button>
          <button onClick={resetGame}>Exit Game</button>
          {diceRolls.length > 0 && (
            <div>
              <p>Dice Rolls: {diceRolls.map((roll, index) => (
                <span key={index} onClick={() => selectDice(index)} style={{ backgroundColor: selectedDice.includes(index) ? 'yellow' : 'white' }}>
                  {roll}
                </span>
              ))}</p>
              <p>Player Money: {playerMoney}</p>
              <p>Refresh Count: {refreshCount}</p>
              <p>Action Points: {actionPoints}</p>
              <button onClick={confirmDiceResults} disabled={refreshCount === 0 || diceConfirmed}>Confirm Dice Rolls</button>
              <button onClick={playSelectedCards} disabled={selectedCards.length === 0 || !diceConfirmed}>Play Selected Cards</button>
              <button onClick={endTurn} disabled={!diceConfirmed}>End Turn</button>
            </div>
          )}
          <h2>Player Hand</h2>
          <ul>
            {playerHand.map((card, index) => (
              <li key={index} onClick={() => selectCard(card)} style={{ backgroundColor: selectedCards.includes(card) ? 'yellow' : 'white' }}>
                {card.value} {card.suit}
              </li>
            ))}
          </ul>
          <h2>Dealer Hand</h2>
          <ul>
            {dealerHand.map((card, index) => (
              <li key={index}>
                {card.value} {card.suit}
              </li>
            ))}
          </ul>
          <p>Current Round: {currentRound}</p>
        </>
      )}
    </div>
  );
};

export default PokerGame;