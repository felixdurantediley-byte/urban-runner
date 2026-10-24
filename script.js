const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

let isPlaying = false;
let score = 0;
let animationFrameId;

// Propiedades del jugador
const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 50,
  velocityY: 0,
  gravity: 0.8,
  jumpPower: -13,
  grounded: true
};

// Obstáculos
let obstacles = [];
let obstacleTimer = 0;
let speed = 6;

function jump() {
  if (player.grounded && isPlaying) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }
}

// Escuchar controles de teclado y táctil
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    jump();
  }
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  jump();
});

function spawnObstacle() {
  obstacleTimer++;
  if (obstacleTimer > 80 + Math.random() * 40) {
    obstacles.push({
      x: canvas.width,
      y: 310,
      width: 30,
      height: 40
    });
    obstacleTimer = 0;
  }
}

function update() {
  if (!isPlaying) return;

  // Física del jugador
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= 300) {
    player.y = 300;
    player.velocityY = 0;
    player.grounded = true;
  }

  // Generar y mover obstáculos
  spawnObstacle();

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= speed;

    // Colisión
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver();
      return;
    }
  }

  // Eliminar obstáculos fuera de pantalla y sumar puntos
  if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
    score += 10;
    scoreEl.textContent = score;
  }

  draw();
  animationFrameId = requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar suelo
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 350, canvas.width, 50);

  // Dibujar jugador
  ctx.fillStyle = '#e94560';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Dibujar obstáculos
  ctx.fillStyle = '#53354a';
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function startGame() {
  isPlaying = true;
  score = 0;
  scoreEl.textContent = score;
  obstacles = [];
  player.y = 300;
  player.velocityY = 0;
  player.grounded = true;
  cancelAnimationFrame(animationFrameId);
  update();
}

function gameOver() {
  isPlaying = false;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#fff';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('¡Juego Terminado!', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '20px Arial';
  ctx.fillText('Puntaje final: ' + score, canvas.width / 2, canvas.height / 2 + 30);
}

startBtn.addEventListener('click', startGame);
