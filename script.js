const car = document.getElementById('car');
const road = document.getElementById('road');
const scoreDisplay = document.getElementById('score');

let carPosition = 180;
let score = 0;
let gameInterval;
let obstacleInterval;

// Move car left and right
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && carPosition > 0) {
    carPosition -= 20;
  } else if (e.key === 'ArrowRight' && carPosition < 360) {
    carPosition += 20;
  }
  car.style.left = `${carPosition}px`;
});

// Create an obstacle from CSS-only shapes
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = `${Math.floor(Math.random() * 10) * 40}px`;

  obstacle.innerHTML = `
    <div class="body"></div>
    <div class="roof"></div>
    <div class="wheel front-left"></div>
    <div class="wheel front-right"></div>
    <div class="wheel rear-left"></div>
    <div class="wheel rear-right"></div>
  `;

  road.appendChild(obstacle);

  let obstacleTop = 0;
  const moveInterval = setInterval(() => {
    obstacleTop += 5;
    obstacle.style.top = `${obstacleTop}px`;

    const obstacleLeft = parseInt(obstacle.style.left);

    // Collision detection
    if (
      obstacleTop + 70 >= 510 &&
      obstacleTop <= 590 &&
      obstacleLeft === carPosition
    ) {
      alert('💥 Crash! Game Over.\nYour score: ' + score);
      clearInterval(gameInterval);
      clearInterval(obstacleInterval);
      document.location.reload();
    }

    // Passed obstacle
    if (obstacleTop > 600) {
      clearInterval(moveInterval);
      road.removeChild(obstacle);
      score += 1;
      scoreDisplay.innerText = `Score: ${score}`;
    }
  }, 30);
}

// Touch controls for mobile
road.addEventListener('touchstart', function(e) {
  if (!e.touches || e.touches.length === 0) return;
  const touch = e.touches[0];
  const rect = road.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  if (x < rect.width / 2 && carPosition > 0) {
    carPosition -= 20;
  } else if (x >= rect.width / 2 && carPosition < 360) {
    carPosition += 20;
  }
  car.style.left = `${carPosition}px`;
});
// Start game
gameInterval = setInterval(() => {}, 100);
obstacleInterval = setInterval(createObstacle, 1000);
