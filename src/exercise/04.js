// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react' 
// import { useLocalStorageState } from '../final/02.extra-4';
function Board({squares, restart, onClick}) {
  // 🐨 squares is the state for this component. Add useState for squares
  
  // const [squares, setSquares] = React.useState(
  //   window.localStorage.getItem('squares') || Array(9).fill(null)
  // );
  // console.log(Array.isArray(squares))
  // console.log(squares[0])
  // window.localStorage.setItem('squares', JSON.stringify(squares));
  
  //can import and use the custom hook useLocalStorageState like below
  // const [squares, setSquares] = useLocalStorageState('squares', Array(9).fill(null));
  
  // console.log(typeof JSON.parse(window.localStorage.getItem('squares')))
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables
  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);
  
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (squares[square] !== null || winner !== null) {
      return;
    }
    
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...squares];
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    squaresCopy[square] = nextValue;
    window.localStorage.setItem('squares', JSON.stringify(squaresCopy));
    // 🐨 set the squares to your copy
    onClick(squaresCopy);
  }
  
  // React.useEffect(() => {
  //   window.localStorage.setItem('squares', JSON.stringify(squares));
  // }, [squares])

  
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
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


const historyKeys = Array(10).map((el, i) => (`move-${i}`));

function Game() {
  const [squares, setSquares] = React.useState(
    () => JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null)
    );
  const [history, setHistory] = React.useState([squares]);
  const disabled = calculateDisabled(squares);
  console.log(history)

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setSquares(Array(9).fill(null));
    setHistory([Array(9).fill(null)]);
    window.localStorage.removeItem('squares')
  }
  // console.log('sqrs: ',squares)
  
  function onHistoryClick(e) {
    const index = Number(e.target.id)
    setSquares(history[index])
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
  
  function generateHistory() {
    const historyButtons = history.map((el, i) => {
      return (
        <li>
          <button
            key={historyKeys[i]}
            disabled={i === disabled}
            id={i}
            onClick={onHistoryClick}>
            {displayMessage(i)}
          </button>
        </li>)
    })
    return historyButtons;
  }

  return (
    <div className="game">
    <div className="game-board">
        <Board
          squares={squares}
          restart={restart}
          onClick={(squares) => {
            setSquares(squares)
            const historyCopy = [...history];
            historyCopy.push(squares);
            setHistory(historyCopy);
          }} />
    </div>
      <ol>
        {generateHistory()}
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
