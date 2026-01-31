/**
 * Snake Game using Canvas
 * 
 * TODO:
 * 1. make snake die if it collides with itself
 * 2. Add Gameover if all segments are filled
 * 
 */


class SnakeGame {
  constructor() {
    this.canvas = document.getElementById( 'canvas' );

    if ( ! this.canvas ) return;

    this.startGameDialog = document.getElementById( 'start-ui' );
    this.restartGameDialog = document.getElementById( 'restart-ui' );
    this.scoreEl = document.getElementById( 'score' );
    this.highScoreEl = document.getElementById( 'highscore' );
    this.levelEl = document.getElementById( 'level' );
    
  }
  
  init() {
    this.drawCanvas();
    this.canvasContext();
    this.variables();
    this.getLevelThreshold();
    this.drawSnake();
    this.startGameUi();  
    this.controls();
  }

  variables () {
    this.SNAKE_COLOR = '#9726CC';
    this.FOOD_COLOR = 'red';
    this.SEGMENT_SIZE = 10;

    this.snakeSegments = [
      { x: 40, y : 0 },
      { x: 30, y : 0 },
      { x: 20, y : 0 },
      { x: 10, y : 0 },
      { x: 0, y : 0 },
    ];

    this.foodPos = this.generateFoodPos();
    this.oldFoodPos = [];

    this.raf = null;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.speed = 200;
    this.lastMoveTime = 0;

    this.score = 0;
    this.highScore = 0;
    this.level = 1;
  }

  drawCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Make the canvas square by taking whichever is smaller between width or height.
    let canvasSize = ( windowWidth < windowHeight ) ? windowWidth  : windowHeight;

    // Reduce Canvas size a bit so that it does not touch the edge of the screen.
    // Make the canvas size value divisible 10.
    if ( canvasSize % 10 === 0 ) {
      canvasSize -= 50;
    } else {
      canvasSize = canvasSize - 50 - ( canvasSize % 10 );
    }

    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.border = '5px solid #000';
  }

  canvasContext() {
    this.ctx = this.canvas.getContext( '2d' );
    this.cw = this.canvas.width;
    this.ch = this.canvas.height;
  }

  drawSnake() {
    const _this = this;
    _this.ctx.clearRect( 0, 0, _this.cw, _this.ch );

    _this.snakeSegments.forEach( ( segment ) => {
      _this.ctx.fillStyle = _this.SNAKE_COLOR;
      _this.ctx.fillRect( segment.x, segment.y, _this.SEGMENT_SIZE, _this.SEGMENT_SIZE );
      _this.ctx.strokeStyle = 'black';
      _this.ctx.lineWidth = 1;
      _this.ctx.strokeRect( segment.x, segment.y, _this.SEGMENT_SIZE, _this.SEGMENT_SIZE );
    } ) 
    
    _this.generateFood();
    _this.setScore( _this.score );
  }

  startGameUi() {
    if ( ! this.startGameDialog ) return;  
    this.startGameDialog.showModal();
  }

  restartGameUi() {
    if ( ! this.restartGameDialog ) return;  
    this.restartGameDialog.showModal();
    cancelAnimationFrame( this.raf );

    this.snakeSegments = [
      { x: 40, y : 0 },
      { x: 30, y : 0 },
      { x: 20, y : 0 },
      { x: 10, y : 0 },
      { x: 0, y : 0 },
    ];

    this.direction = 'right';
    this.nextDirection = 'right';
    this.level = 1;
    this.speed = 200;

    // update highscore
    if ( this.highScore < this.score ) {
      this.highScore = this.score;
    }

    this.score = 0;
    this.setHighScore( this.highScore );
  }

  moveSnake( timestamp ) {
    const _this = this;
    if ( ! _this.lastMoveTime ) _this.lastMoveTime = timestamp;

    const elapsed = timestamp - _this.lastMoveTime;

    if ( elapsed >= _this.speed ) {
      _this.lastMoveTime = timestamp;

      _this.direction = _this.nextDirection;

      const head = { ..._this.snakeSegments[0] };
      const tail = { ..._this.snakeSegments[_this.snakeSegments.length - 1] }

      switch ( _this.direction ) {
        case 'right':
          head.x += _this.SEGMENT_SIZE;
          break;
        case 'left':
          head.x -= _this.SEGMENT_SIZE;
          break;
        case 'up':
          head.y -= _this.SEGMENT_SIZE;
          break;
        case 'down':
          head.y += _this.SEGMENT_SIZE;
          break;
      }

      // Generate new food when food and head collide
      if( head.x === _this.foodPos[0] && head.y === _this.foodPos[1] ) {
        _this.oldFoodPos = _this.foodPos;
        _this.foodPos = _this.generateFoodPos();
        _this.score++;
      }

      // Add a new segment after the food is eaten
      if( _this.oldFoodPos.length && tail.x === _this.oldFoodPos[0] && tail.y === _this.oldFoodPos[1] ) {
        _this.oldFoodPos = [];
        _this.snakeSegments.push( tail );
      }

      if ( head.x < 0 || head.x >= _this.cw || head.y < 0 || head.y >= _this.ch ) {
        _this.restartGameUi();
        return;
      }

      _this.updateLevel(); 

      // Add new segment
      _this.snakeSegments.unshift( head );

      // Remove last segment
      _this.snakeSegments.pop();

      _this.drawSnake();
    }

    _this.raf = requestAnimationFrame( _this.moveSnake.bind(_this) );
  }

  changeDirection( newDirection ) {
    const opposites = {
      'up'    : 'down',
      'down'  : 'up',
      'left'  : 'right',
      'right' : 'left'
    };

    if ( opposites[ newDirection ] !== this.direction ) {
      this.nextDirection = newDirection;
    }
  }

  start() {
    this.lastMoveTime = 0;
    this.raf = requestAnimationFrame( this.moveSnake.bind( this ) );
  }

  controls() {
    const _this = this;
    const startButton = _this.startGameDialog.querySelector( 'button' );
    const restartButton = _this.restartGameDialog.querySelector( 'button' );

    window.addEventListener( 'keydown', ( e ) => {
      switch ( e.key ) {
        case 'ArrowUp':
          _this.changeDirection( 'up' );
          break;
        case 'ArrowDown':
          _this.changeDirection( 'down' );
          break;
        case 'ArrowLeft':
          _this.changeDirection( 'left' );
          break;
        case 'ArrowRight':
          _this.changeDirection( 'right' );
          break;
      }
    })

    if ( startButton ) {
      startButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        _this.startGameDialog.close();
        _this.start();
      } )
    }

    if ( restartButton ) {
      restartButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        _this.restartGameDialog.close();
        _this.start();
      } )
    }
  }

  generateFood(){
    this.ctx.fillStyle = this.FOOD_COLOR;
    this.ctx.fillRect( this.foodPos[0], this.foodPos[1], this.SEGMENT_SIZE, this.SEGMENT_SIZE );
  }

  generateFoodPos() {
    let [x,y] = this.generateRandomXYCoordinate();
    
    // Regenerate x and y if it overlaps snake position
    while ( this.snakeSegments.some( ( segment ) => segment.x === x && segment.y === y ) ) {
      [x, y] = this.generateRandomXYCoordinate();
    }

    return [x,y];
  }

  generateRandomXYCoordinate() {
    // Generate random x and y value from 0 to canvas width and canvas height  minus snake segment size.
    let x = Math.floor( Math.random() * ( this.cw - this.SEGMENT_SIZE + 1 ) );
    let y = Math.floor( Math.random() * ( this.ch - this.SEGMENT_SIZE + 1 ) );

    // Make x and y divisible by 10
    if ( x % 10 !== 0 ) {
      x -= x % 10;
    }

    if ( y % 10 !== 0 ) {
      y -= y % 10;
    }
    return [x,y];
  }

  setScore( score ) {
    this.scoreEl.textContent = `Score: ${score}`;
  }

  setHighScore( highscore ) {
    this.highScoreEl.textContent = `High Score: ${highscore}`;
  }

  setLevel( level ) {
    this.levelEl.textContent = `Level: ${level}`;
  }

  getLevelThreshold() {
    const horizontalGridSegments = this.cw / this.SEGMENT_SIZE;
    const totalGridSegments = horizontalGridSegments * horizontalGridSegments; // Since our canvas is square, squaring the horizontalGridSegments will give total grid segment.

    // Total number of grid segment is how much the score can be obtained ( Ignoring initial snake segments )
    // Let's divide our game into 20 levels based on the total obtainable score, and that will be our level threshold

    this.levelThreshold =  Math.floor( totalGridSegments / 20 );
  }
  
  updateLevel() {
    if ( this.score >= this.level * this.levelThreshold ){
      this.level++;
      this.speed -= 8;
      this.setLevel( this.level );
    }
  }

}

const game = new SnakeGame();
game.init();