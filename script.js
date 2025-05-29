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

// Touch and swipe controls for mobile
let touchStartX = null;
let touchEndX = null;

road.addEventListener('touchstart', function(e) {
  if (!e.touches || e.touches.length === 0) return;
  touchStartX = e.touches[0].clientX;
});

road.addEventListener('touchmove', function(e) {
  if (!e.touches || e.touches.length === 0) return;
  touchEndX = e.touches[0].clientX;
});

road.addEventListener('touchend', function(e) {
  if (touchStartX === null || touchEndX === null) return;
  const dx = touchEndX - touchStartX;
  if (Math.abs(dx) > 30) {
    if (dx < 0 && carPosition > 0) {
      carPosition -= 20;
    } else if (dx > 0 && carPosition < 360) {
      carPosition += 20;
    }
    car.style.left = `${carPosition}px`;
  }
  touchStartX = null;
  touchEndX = null;
});

// On-screen control buttons for mobile
function createControlButtons() {
  if (document.querySelector('.control-buttons')) return;
  const controls = document.createElement('div');
  controls.className = 'control-buttons';
  controls.innerHTML = `
    <button class="control-btn" id="btn-left">⟵</button>
    <button class="control-btn" id="btn-right">⟶</button>
  `;
  document.querySelector('.game-container').appendChild(controls);
  document.getElementById('btn-left').addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (carPosition > 0) {
      carPosition -= 20;
      car.style.left = `${carPosition}px`;
    }
  });
  document.getElementById('btn-right').addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (carPosition < 360) {
      carPosition += 20;
      car.style.left = `${carPosition}px`;
    }
  });
}

// Show controls on mobile
if (window.innerWidth < 700) {
  createControlButtons();
}
window.addEventListener('resize', () => {
  if (window.innerWidth < 700) {
    createControlButtons();
  }
});

// Start game
gameInterval = setInterval(() => {}, 100);
obstacleInterval = setInterval(createObstacle, 1000);
