class SnakeGame {
  constructor() {
    this.canvas = document.getElementById( 'canvas' );

    if ( ! this.canvas ) return;

    this.startGameDialog = document.getElementById( 'start-ui' );
    this.restartGameDialog = document.getElementById( 'restart-ui' );

    this.SNAKE_COLOR = '#9726CC';
    this.SEGMENT_SIZE = 10;

    this.snakeSegments = [
      { x: 40, y : 0 },
      { x: 30, y : 0 },
      { x: 20, y : 0 },
      { x: 10, y : 0 },
      { x: 0, y : 0 },
    ];

    this.raf = null;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.speed = 100;
    this.lastMoveTime = 0;
  }
  
  init() {
    this.drawCanvas();
    this.canvasContext();
    this.drawSnake();
    this.startGameUi();  
    this.controls();
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
      _this.ctx.fillRect(segment.x, segment.y, _this.SEGMENT_SIZE, _this.SEGMENT_SIZE);
      _this.ctx.strokeStyle = 'black';
      _this.ctx.lineWidth = 1;
      _this.ctx.strokeRect(segment.x, segment.y, _this.SEGMENT_SIZE, _this.SEGMENT_SIZE);
    } )
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
  }

  moveSnake( timestamp ) {
    const _this = this;
    if ( ! _this.lastMoveTime ) _this.lastMoveTime = timestamp;

    const elapsed = timestamp - _this.lastMoveTime;

    if ( elapsed >= _this.speed ) {
      _this.lastMoveTime = timestamp;

      _this.direction = _this.nextDirection;

      const head = { ..._this.snakeSegments[0] };

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

      if ( head.x < 0 || head.x >= _this.cw || head.y < 0 || head.y >= _this.ch ) {
        _this.restartGameUi();
        return;
      }

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
    this.raf = requestAnimationFrame( this.moveSnake.bind(this) );
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

}

const game = new SnakeGame();
game.init();