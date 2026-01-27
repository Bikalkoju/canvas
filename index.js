function myApp() {
  canvas = document.getElementById("canvas");

  if (!canvas) return;

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.border = '5px solid #000';

  const ctx = canvas.getContext("2d");
  const cw = canvas.width;
  const ch = canvas.height;

  const SNAKE_COLOR = 'yellow';
  const SEGMENT_SIZE = 10;

  const snake = [
    { x: 40, y: 0 },
    { x: 30, y: 0 },
    { x: 20, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 0 }
  ]

  let raf = null;
  let direction = 'right';
  let nextDirection = 'right';
  let speed = 100;
  let lastMoveTime = 0;


  function drawSnake() {
    ctx.clearRect(0, 0, cw, ch);

    snake.forEach((segment) => {
      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
    })
  }

  function moveSnake(timestamp) {
    if (!lastMoveTime) lastMoveTime = timestamp;

    const elapsed = timestamp - lastMoveTime;

    if (elapsed >= speed) {
      lastMoveTime = timestamp;

      direction = nextDirection;

      const head = { ...snake[0] };

      switch (direction) {
        case 'right':
          head.x += SEGMENT_SIZE;
          break;
        case 'left':
          head.x -= SEGMENT_SIZE;
          break;
        case 'up':
          head.y -= SEGMENT_SIZE;
          break;
        case 'down':
          head.y += SEGMENT_SIZE;
          break;
      }

      if (head.x < 0 || head.x >= CANVAS_WIDTH ||
        head.y < 0 || head.y >= CANVAS_HEIGHT) {
        cancelAnimationFrame(raf);
        alert('Game Over! Hit the wall.');
        return;
      }

      // Add new segment
      snake.unshift(head);

      // Remove last segment
      snake.pop();

      drawSnake();
    }

    raf = requestAnimationFrame(moveSnake);
  }

  function changeDirection(newDirection) {
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    if (opposites[newDirection] !== direction) {
      nextDirection = newDirection;
    }
  }

  drawSnake();

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        changeDirection('up');
        break;
      case 'ArrowDown':
        changeDirection('down');
        break;
      case 'ArrowLeft':
        changeDirection('left');
        break;
      case 'ArrowRight':
        changeDirection('right');
        break;
      case ' ':
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        } else {
          lastMoveTime = 0;
          raf = requestAnimationFrame(moveSnake);
        }
        break;
    }

    // Start movement if not already moving
    if (!raf && e.key.startsWith('Arrow')) {
      lastMoveTime = 0;
      raf = requestAnimationFrame(moveSnake);
    }
  })
}

myApp();
