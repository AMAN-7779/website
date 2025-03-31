

import React, { useState, useEffect } from 'react';
import './App.css';

const EMPTY = '';
const PLAYER_X = 'X';
const PLAYER_O = 'O';

const initialBoard = Array(9).fill(EMPTY);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [isPlayingWithAI, setIsPlayingWithAI] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [startWithAI, setStartWithAI] = useState(false); // New state for starting player

  useEffect(() => {
    if (isPlayingWithAI && !isXNext && !winner && !isDraw) {
      const aiMove = calculateBestMove(board);
      if (aiMove !== -1) {
        makeMove(aiMove, PLAYER_O);
      }
    }
  }, [isXNext, isPlayingWithAI, board, winner, isDraw]); // AI makes a move when it's its turn

  const makeMove = (index, player) => {
    if (board[index] === EMPTY) {
      const newBoard = board.slice();
      newBoard[index] = player; // Place player's move
      setBoard(newBoard);
      setIsXNext(!isXNext);
      checkGameStatus(newBoard); // Check for winner or draw
    }
  };

  const checkGameStatus = (board) => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
    } else if (board.every(cell => cell !== EMPTY)) {
      setIsDraw(true); // Set draw state if the board is full
    }
  };

  const handleCellClick = (index) => {
    if (!winner && !isDraw) {
      makeMove(index, isXNext ? PLAYER_X : PLAYER_O);
    }
  };

  const playAgain = () => {
    setBoard(initialBoard);
    setIsXNext(!startWithAI); // Toggle player turn based on who started
    setWinner(null);
    setIsDraw(false);
  };

  const toggleGameMode = (mode) => {
    setIsPlayingWithAI(mode === 'AI');
    playAgain(); // Reset the game when switching modes
  };

  const setStartingPlayer = (startAI) => {
    setStartWithAI(startAI);
    setIsXNext(!startAI); // Toggle turn based on initial choice
    playAgain(); // Reset the game
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="game-mode-buttons">
        <button onClick={() => toggleGameMode('Player')}>Play with Player</button>
        <button onClick={() => toggleGameMode('AI')}>Play with AI</button>
      </div>
      <div className="starting-player-buttons">
        <button onClick={() => setStartingPlayer(false)}>Start with Player</button>
        <button onClick={() => setStartingPlayer(true)}>Start with AI</button>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <div 
            key={index} 
            className="cell" 
            onClick={() => handleCellClick(index)} // Click to make a move
            style={{ cursor: 'pointer', backgroundColor: cell === EMPTY ? '#f0f0f0' : '#dcdcdc' }} // Change color if occupied
          >
            {cell}
          </div>
        ))}
      </div>
      <h2>
        {winner ? `Winner: ${winner}` : isDraw ? 'Draw!' : `Next Player: ${isXNext ? PLAYER_X : PLAYER_O}`}
      </h2>
      {(winner || isDraw) && (
        <button onClick={playAgain}>Play Again</button>
      )}
    </div>
  );
}

// Function to determine the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return winner
    }
  }
  return null; // No winner
}

// AI function to calculate the best move
function calculateBestMove(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === EMPTY) {
      const newBoard = board.slice();
      newBoard[i] = PLAYER_O;
      if (calculateWinner(newBoard) === PLAYER_O) {
        return i; // AI wins
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === EMPTY) {
      const newBoard = board.slice();
      newBoard[i] = PLAYER_X;
      if (calculateWinner(newBoard) === PLAYER_X) {
        return i; // Block player from winning
      }
    }
  }

  // Random move if no one can win next turn
  const availableMoves = board.map((cell, index) => (cell === EMPTY ? index : null))
                               .filter(val => val !== null);
  return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
}

export default App; 