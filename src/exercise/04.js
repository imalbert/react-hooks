// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'

import { useLocalStorage } from './02'

function Board({selectSquare, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [{history, currentStep}, setSquares] = useLocalStorage({
    key: 'tictactoe',
    initialValue: {
      history: [Array(9).fill(null)],
      currentStep: 0,
    }
  })

  console.log(history, currentStep)
  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square] !== null) {
      return
    }
    
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    
    setSquares({
      history: [...history.slice(0, currentStep + 1), squaresCopy],
      currentStep: currentStep + 1,
    })
  }

  function restart() {
    setSquares({
      history: [Array(9).fill(null)],
      currentStep: 0,
    })
    
  }

  function goToMove(index) {
    setSquares({
      history,
      currentStep: index,
    })
  }
  const moves = history.map((_, index) => (
    <li>
      <button onClick={() => goToMove(index)} disabled={currentStep === index}>
        {index === 0 ? `Go to game start` : `Go to move #${index}` }
      </button>
    </li>
  ))

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
