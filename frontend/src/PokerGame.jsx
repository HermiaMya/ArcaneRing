import React, { useState, useEffect } from 'react';
import Dice from './components/Dice';
import Controls from './components/Controls';
import Poker from './components/Poker';
import { mapPokerIdToCardId } from './poker';
import './style.css';
/**
 * 扑克游戏主组件
 */
const PokerGame = () => {
  const [deck, setDeck] = useState(createDeck()); // 牌堆
  const [playerHand, setPlayerHand] = useState([]); // 玩家手牌
  const [dealerHand, setDealerHand] = useState([]); // 庄家手牌
  const [diceRolls, setDiceRolls] = useState([]); // 骰子点数
  const [playerMoney, setPlayerMoney] = useState(0); // 玩家金钱
  const [refreshCount, setRefreshCount] = useState(0); // 刷新骰子次数
  const [currentRound, setCurrentRound] = useState(1); // 当前回合
  const [gameStarted, setGameStarted] = useState(false); // 游戏是否开始
  const [actionPoints, setActionPoints] = useState(1); // 行动点
  const [selectedCards, setSelectedCards] = useState([]); // 选中的牌
  const [diceConfirmed, setDiceConfirmed] = useState(false); // 骰子点数是否已确认
  const [selectedDice, setSelectedDice] = useState([]); // 选中的骰子

  useEffect(() => {
    if (gameStarted) {
      dealInitialCards(); // 游戏开始时发初始牌
    }
  }, [gameStarted]);

  /**
   * 创建一副牌
   * @returns {Array} 一副牌
   */
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

  /**
   * 洗牌
   * @param {Array} deck 牌堆
   * @returns {Array} 洗好的牌堆
   */
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * 发初始牌
   */
  function dealInitialCards() {
    const shuffledDeck = shuffleDeck([...deck]);
    setDeck(shuffledDeck);
    setPlayerHand(sortHand(shuffledDeck.slice(0, 3)));
    setDealerHand(shuffledDeck.slice(3, 6));
    setDeck(shuffledDeck.slice(6));
  }

  /**
   * 掷骰子
   */
  function rollDice() {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    setDiceRolls(rolls);
    setRefreshCount(refreshCount + 1);
  }

  /**
   * 刷新选中的骰子
   */
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

  /**
   * 确认骰子结果
   */
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

  /**
   * 选择牌
   * @param {Object} card 选中的牌
   */
  function selectCard(card) {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  }

  /**
   * 打出选中的牌
   */
  function playSelectedCards() {
    if (selectedCards.length <= actionPoints) {
      const newPlayerHand = playerHand.filter(card => !selectedCards.includes(card));
      setPlayerHand(newPlayerHand);
      setActionPoints(actionPoints - selectedCards.length);
      setSelectedCards([]);
    }
  }

  /**
   * 抽牌
   * @param {number} count 抽牌数量
   */
  function drawCards(count) {
    if (deck.length < count) {
      alert('Not enough cards in the deck!');
      return;
    }
    const newPlayerHand = sortHand([...playerHand, ...deck.slice(0, count)]);
    setPlayerHand(newPlayerHand);
    setDeck(deck.slice(count));
  }

  /**
   * 排序手牌
   * @param {Array} hand 手牌
   * @returns {Array} 排序后的手牌
   */
  function sortHand(hand) {
    const valuesOrder = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
    return hand.sort((a, b) => valuesOrder[a.value] - valuesOrder[b.value]);
  }

  /**
   * 重置游戏
   */
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

  /**
   * 结束回合
   */
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

  /**
   * 选择骰子
   * @param {number} index 骰子索引
   */
  function selectDice(index) {
    if (selectedDice.includes(index)) {
      setSelectedDice(selectedDice.filter(i => i !== index));
    } else {
      setSelectedDice([...selectedDice, index]);
    }
  }

  return (
    <div className="container">
      {!gameStarted ? (
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      ) : (
        <>
          <h1>Poker Game</h1>
          <Controls
            rollDice={rollDice}
            refreshSelectedDice={refreshSelectedDice}
            resetGame={resetGame}
            confirmDiceResults={confirmDiceResults}
            playSelectedCards={playSelectedCards}
            endTurn={endTurn}
            refreshCount={refreshCount}
            diceConfirmed={diceConfirmed}
            selectedCards={selectedCards}
            actionPoints={actionPoints}
            selectedDice={selectedDice}
          />
          {diceRolls.length > 0 && (
            <Dice
              diceRolls={diceRolls}
              selectDice={selectDice}
              selectedDice={selectedDice}
              playerMoney={playerMoney}
              refreshCount={refreshCount}
              actionPoints={actionPoints}
            />
          )}
          <h2>Player Hand</h2>
          <div className="hand">
            {playerHand.map((card, index) => (
              <Poker
                key={index}
                id={mapPokerIdToCardId(index + 1)}
                className={selectedCards.includes(card) ? 'selected' : ''}
                onClick={() => selectCard(card)}
              />
            ))}
          </div>
          <h2>Dealer Hand</h2>
          <div className="hand">
            {dealerHand.map((card, index) => (
              <Poker
                key={index}
                id={mapPokerIdToCardId(index + 4)}
              />
            ))}
          </div>
          <p>Current Round: {currentRound}</p>
        </>
      )}
    </div>
  );
};

export default PokerGame;