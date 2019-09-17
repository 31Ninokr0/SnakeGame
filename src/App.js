import React, { Component } from 'react';


class App extends Component {
  constructor() {
    super(); //Parent Object

    const grid = []; //array of columns
    for (let row = 0; row < 20; row++) {
      const columns = []; //array of rows
      for (let col = 0; col < 20; col++) 
        columns.push( {row, col} ); //pushing a "row" value and "col" value
      grid.push(columns); //pushing colomns in the grid
    }

    this.state = {
      grid,
      apple: {  row: Math.floor(Math.random() * 20), col: Math.floor(Math.random() * 20) },
      snake: {
        head: { row: 9, col: 9 }, //initial position in the middle if the grid
        velocity: { x: 0, y: 1 }, //starts by going downward
        tail: [] //tail of snake
      }
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', (e) => { this.setVelocity(e); });
    setTimeout(() => {
      this.gameLoop()
    }, this.state.snake.tail.length ? (400 / this.state.snake.tail.length) : 400);
  }

  getRandomApple = () => {
    const { snake } = this.state;
    const newApple = { row: Math.floor(Math.random() * 20), col: Math.floor(Math.random() * 20) };
    if (this.isTail(newApple) || (snake.head.row === newApple.row1 && snake.head.col === newApple.col)) {
      return this.getRandomApple();
    } else {
      return newApple;
    }
  }

  gameLoop = () => {
    if (this.state.gameOver) return;
    this.setState(({snake, apple}) => {
      const collidesWithApple = this.collidesWithApple();
      const nextState = {
        snake: {
          ...snake,
          head: {
            row: snake.head.row + snake.velocity.y,
            col: snake.head.col + snake.velocity.x
          },
          tail: [snake.head, ...snake.tail]
        },
        apple: collidesWithApple ? this.getRandomApple() : apple
      };

      if (!collidesWithApple) nextState.snake.tail.pop();

      return nextState;
    }, () => {
      const { snake } = this.state;
      if (this.isOffEdge() || this.isTail(snake.head)) {
        this.setState({
          gameOver: true,
        });
        return;
      }
  
      setTimeout(() => {
        this.gameLoop()
      }, this.state.snake.tail.length ? (400 / this.state.snake.tail.length) : 400);
    });
  }

  isOffEdge = () => {
    const { snake } = this.state;
    if (snake.head.col > 19 || snake.head.col < 0 || 
        snake.head.row > 19 || snake.head.row < 0) {
        return true;
      }
  }

  collidesWithApple = () => {
    const { apple, snake } = this.state;
    return apple.row === snake.head.row && apple.col === snake.head.col;
  }

  isApple = (cell) => {
    const { apple } = this.state;
    return apple.row === cell.row && apple.col === cell.col;
  }

  isHead = (cell) => {
    const { snake } = this.state;
    return snake.head.row === cell.row && snake.head.col === cell.col;
  }

  isTail = (cell) => {
    const { snake } = this.state;
    return snake.tail.find(inTail => inTail.row === cell.row && inTail.col === cell.col);
  }

  startGame = (event) => {
    return event.keyCode === 83;
  }

  

  setVelocity = (event) => {
    const { snake } = this.state;
    if (event.keyCode === 38) { // up
      if (snake.velocity.y === 1) return;
      this.setState(({snake}) => ({
        snake: { ...snake, velocity: { x: 0, y: -1 } }
      }))
    } else if (event.keyCode === 40) {// down 
      if (snake.velocity.y === -1) return;
      this.setState(({snake}) => ({
        snake: { ...snake, velocity: { x: 0, y: 1 } }
      }))
    } else if (event.keyCode === 39)  {//right
      if (snake.velocity.x === -1) return;
      this.setState(({snake}) => ({
        snake: { ...snake, velocity: { x: 1, y: 0 } }
      }))
    } else if (event.keyCode === 37)  { // left
      if (snake.velocity.x === 1) return;
      this.setState(({snake}) => ({
        snake: { ...snake, velocity: { x: -1, y: 0 } }
      }))
    }
  }

  
  printScore() {
    const { snake } = this.state;
    var temp = `Game Over! You scored ${snake.tail.length} apple(s)!`;
    var newHS = `Congrats on New High Score of ${snake.tail.length} apple(s)!`;
    document.getElementById("myText").innerHTML = temp;

    const isStorage = 'undefined' !== typeof localStorage;
    if (isStorage && localStorage.getItem('userHighScore')) {
      if (localStorage.getItem('userHighScore') < snake.tail.length ) {
        localStorage.setItem('userHighScore', snake.tail.length);
        document.getElementById("myText").innerHTML = newHS;
      }
    } else {
      localStorage.setItem('userHighScore', snake.tail.length);
    }

    document.getElementById("highScore").innerHTML = localStorage.getItem('userHighScore');

  }

  HighScore() {
    const isStorage = 'undefined' !== typeof localStorage;
    if (isStorage && localStorage.getItem('userHighScore')) {
      return localStorage.getItem('userHighScore');
    } else {
      return 0;
    }
  };

  render() {
    const { grid, snake, gameOver } = this.state;
    
    return (
      <div>

        <div id= "header">
          <h1 align="center" vertical-align="middle"> <span className="text"> 5nak3 Gam3 🐍 </span> </h1>
        </div>


        <div className="split">
          <h3 className="text" align="center">Your Highest Score</h3>
  
          <h2 id="highScore" align="center" className="text">{this.HighScore()}</h2>
            
        </div>
        
        <div align="center">
          <h1> <span className="text" id="myText">Welcome to Snake Game</span></h1> 
        </div>
        <div className="App">


          {gameOver? this.printScore(): ""}
          {
            gameOver ? 
            <section align="center" className="grid">
            {
              grid.map((row, i) => (row.map(cell => (
                  <div key={`${cell.row} ${cell.col}`} className={`cell
                    ${
                      this.isHead(cell) ? 'head' : 
                      this.isApple(cell) ? 'apple' : 
                      this.isTail(cell) ? 'tail' : 
                      ''}`}>
                  </div>
                ))
              ))
            }
            </section> : 
            <section align="center" className="grid">
              {
                grid.map((row, i) => (row.map(cell => (
                    <div key={`${cell.row} ${cell.col}`} className={`cell
                      ${
                        this.isHead(cell) ? 'head' : 
                        this.isApple(cell) ? 'apple' : 
                        this.isTail(cell) ? 'tail' : 
                        ''}`}>
                    </div>
                  ))
                ))
              } 
              </section>
          }

          </div>
      </div>
      
      
    );
  }
}

export default App;
