window.onload = function () {
  const game = document.getElementById("game");
  const bike = document.getElementById("bike");
  const scoreDisplay = document.getElementById("score");

  let score = 0;
  let isGameOver = false;
  let obstacles = [];
  const numObstacles = 3;

  const lanes = [160, 285, 410, 535]; // x positions of lanes
  let bikeLane = 0;
  bike.style.left = lanes[bikeLane] + "px";

  const obstacleImages = [
    "../images/obstacles/stone.png",
    "../images/obstacles/isuzu.png",
    "../images/obstacles/truck.png"
  ];

  let lastIndex = -1;

  // Create obstacles
  for (let i = 0; i < numObstacles; i++) {
  let obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  obstacle.style.position = "absolute";
  obstacle.style.pointerEvents = "none";
  obstacle.style.background = "transparent";

  let img = document.createElement("img");

  // Pick random image not same as last
  let va;
  do {
    va = Math.floor(Math.random() * obstacleImages.length);
  } while (va === lastIndex);
  lastIndex = va;

  img.src = obstacleImages[va];
  img.alt = "Obstacle";

  // normalize sizes depending on type
  if (img.src.includes("isuzu") || img.src.includes("truck")) {
    img.style.width = "120px";
    img.style.height = "100px";
  } else if (img.src.includes("stone")) {
    img.style.width = "120px";
  } else {
    img.style.width = "100px";
  }
  img.style.height = "auto";

  img.onload = function () {
    obstacle.style.width = img.width + "px";
    obstacle.style.height = img.height + "px";
  };

  obstacle.appendChild(img);
  game.appendChild(obstacle);

  resetObstacle(obstacle, true, i);
  obstacles.push(obstacle);
}


  // bike movement
  document.addEventListener("keydown", (event) => {
    if (isGameOver) return;

    if (event.code === "ArrowLeft" && bikeLane > 0) {
      bikeLane--;
    }
    if (event.code === "ArrowRight" && bikeLane < lanes.length - 1) {
      bikeLane++;
    }
    bike.style.left = lanes[bikeLane] + "px";
  });

  // reset obstacle
  // reset obstacle
function resetObstacle(obstacle, firstTime = false, index = 0) {
  let lane;
  let tries = 0;

  do {
    lane = lanes[Math.floor(Math.random() * lanes.length)];
    tries++;
  } while (
    obstacles.some(
      (obs) =>
        obs !== obstacle &&
        Math.abs(parseInt(obs.style.top) - parseInt(obstacle.style.top || 0)) < 200 &&
        parseInt(obs.style.left) === lane - (obstacle.querySelector("img").width || 100) / 2 + 70
    ) &&
    tries < 10
  );

  const img = obstacle.querySelector("img");
  const imgWidth = img.width || 100;

  obstacle.style.left = (lane - imgWidth / 2 + 70) + "px";

  if (firstTime) {
    obstacle.style.top = -(index * 250 + Math.random() * 150) + "px";
  } else {
    obstacle.style.top = -(200 + Math.random() * 200) + "px"; 
  }
}


  // main loop
  function gameLoop() {
    if (isGameOver) return;

    obstacles.forEach((obstacle) => {
      let obstacleTop = parseInt(obstacle.style.top);

      if (obstacleTop < game.clientHeight) {
        obstacle.style.top = obstacleTop + 3 + "px"; // falling speed
      } else {
        resetObstacle(obstacle);
        score++;
        scoreDisplay.innerText = "Score: " + score;
      }

      checkCollision(obstacle);
    });

    requestAnimationFrame(gameLoop);
  }

  // collision detection
  function checkCollision(obstacle) {
    let bikeRect = bike.getBoundingClientRect();
    let obsRect = obstacle.getBoundingClientRect();

    if (
      bikeRect.left < obsRect.right &&
      bikeRect.right > obsRect.left &&
      bikeRect.top < obsRect.bottom &&
      bikeRect.bottom > obsRect.top
    ) {
      isGameOver = true;
      alert("Game Over! Final Score: " + score);
      location.reload();
    }
  }

  gameLoop();
};
