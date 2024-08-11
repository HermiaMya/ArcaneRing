import React from 'react';

const Dice = ({
  diceRolls,
  selectDice,
  selectedDice,
  playerMoney,
  refreshCount,
  actionPoints,
}) => {
  return (
    <div>
      <p>Dice Rolls: {diceRolls.map((roll, index) => (
        <span
          key={index}
          className={`dice-roll ${selectedDice.includes(index) ? 'selected' : ''}`}
          onClick={() => selectDice(index)}
        >
          {roll}
        </span>
      ))}</p>
      <p>Player Money: {playerMoney}</p>
      <p>Refresh Count: {refreshCount}</p>
      <p>Action Points: {actionPoints}</p>
    </div>
  );
};

export default Dice;