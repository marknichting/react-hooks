// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react' 
// import { useLocalStorageState } from '../final/02.extra-4';
function Board({squares, restart, onClick, status}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
      {squares[i]}
    </button>
  )
  }
  
  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{ status }</div>
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
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}



function Game() {
  const [squares, setSquares] = React.useState(
    () => JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null)
    );
    const [history, setHistory] = React.useState([squares]);
    const disabled = calculateDisabled(squares);
    const nextValue = calculateNextValue(squares);
    const winner = calculateWinner(squares);
    const status = calculateStatus(winner, squares, nextValue);
    
  console.log(squares)
    // This is the function your square click handler will call. `square` should
    // be an index. So if they click the center square, this will be `4`.
  function selectSquare(i) {
    //don't let a user click a square that isn't null or once the game is over
    if (squares[i] !== null || winner !== null) {
      return;
    }

    // create new squares array
    const squaresCopy = [...squares];
    squaresCopy[i] = nextValue;

    //use new squares array to update history and squares state
    const currentMove = squaresCopy.filter(Boolean).length;
    setSquares(squaresCopy)
    let historyCopy = [...history];
    if (historyCopy.length - 1 > currentMove) {
      historyCopy = historyCopy.slice(0, currentMove)
    }
    historyCopy.push(squaresCopy);
    setHistory(historyCopy);
  }

  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(squares));
  }, [squares])
    
  function restart() {
    setSquares(Array(9).fill(null));
    setHistory([Array(9).fill(null)]);
  }
  
  function displayMessage(index){
    let message;
    if (index === 0) {
      message = 'Go to start of game';
    } else {
      message = `Go to move #${index}`;
    }
    if (index === disabled) {
      message += ' (current)';
    }
    return message;
  }

  function onHistoryClick(e) {
    const index = Number(e.target.id)
    setSquares(history[index])
  }
  
  function generateHistory(disabled, onHistoryClick) {
    return history.map((el, i) => {
      return (
        <li key={el.toString()}>
          <button
            disabled={i === disabled}
            id={i}
            onClick={onHistoryClick}>
            {displayMessage(i)}
          </button>
        </li>)
    })
  }

  return (
    <div className="game">
    <div className="game-board">
        <Board
          squares={squares}
          restart={restart}
          onClick={selectSquare}
          status={status}
          />
    </div>
      <ol>
        {generateHistory(disabled, onHistoryClick)}
      </ol>
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
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
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

function calculateDisabled(squares){
  return squares.filter(Boolean).length;
}

function App() {
  return <Game />
}

export default App
