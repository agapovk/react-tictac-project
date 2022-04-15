import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button id={props.id} className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
			<Square
				key={i}
				value={this.props.squares[i]}
				onClick={() => {this.props.onClick(i)}}
				id={i}
			/>);
  }

	
  render() {
		const board = [
			{ row: [0, 1, 2], id: 1 },
			{ row: [3, 4, 5], id: 2 },
			{ row: [6, 7, 8], id: 3 },
		];
		
    return (
			<>
				{board.map(({ row, id }) => {
					return(
					<div className="board-row" key={id}>
						{row.map(s => this.renderSquare(s))}
        	</div>
					)
				})}
			</>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
			stepNumber: 0,
			// winLine: null,
    };
  }

	handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
    });
  }

	 jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
      const desc = move ? 'Перейти к ходу #' + move : 'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Выиграл ' + winner.symbol;
			// this.setState({
			// 	winLine: winner.line,
			// })
			// colorize lines
			winner.line.map(square => {
				const winBtn = document.querySelector(`[id="${square}"]`);
				winBtn.classList.add('winner');
			})
    } else if (history.length === 10) {
			status = 'Ничья';
			// const btns = document.querySelectorAll('button.square');
			// btns.forEach(btn => btn.classList.remove('winner'))
		} else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
			const btns = document.querySelectorAll('button.square');
			btns.forEach(btn => btn.classList.remove('winner'))
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => {
						this.handleClick(i)}
						} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return lines[i];
      return { symbol: squares[a], line: lines[i] }
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

