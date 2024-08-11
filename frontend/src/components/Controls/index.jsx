import React from 'react';

const Controls = ({
    rollDice,
    refreshSelectedDice,
    resetGame,
    confirmDiceResults,
    playSelectedCards,
    endTurn,
    refreshCount,
    diceConfirmed,
    selectedCards,
    actionPoints,
    selectedDice, // 接收 selectedDice
  }) => {
  return (
    <div>
      <button onClick={rollDice} disabled={refreshCount >= 3 || diceConfirmed}>Roll Dice</button>
      <button onClick={refreshSelectedDice} disabled={selectedDice.length === 0 || refreshCount >= 3 || diceConfirmed}>Refresh Selected Dice</button>
      <button onClick={resetGame}>Exit Game</button>
      <button onClick={confirmDiceResults} disabled={refreshCount === 0 || diceConfirmed}>Confirm Dice Rolls</button>
      <button onClick={playSelectedCards} disabled={selectedCards.length === 0 || !diceConfirmed}>Play Selected Cards</button>
      <button onClick={endTurn} disabled={!diceConfirmed}>End Turn</button>
    </div>
  );
};

export default Controls;