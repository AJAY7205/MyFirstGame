window.onload = function () {
    const game = document.getElementById("game");
    const bike = document.getElementById("bike");
    const scoreDisplay = document.getElementById("score");

    let score = 0;
    let isGameOver = false;
    let obstacles = [];
    const numObstacles = 2;

    const lanes = [160, 285, 410, 535];
    let bikeLane = 0;
    bike.style.left = lanes[bikeLane] + "px";

    const obstacleImages = [
         "../images/obstacles/stone.png",
         "../images/obstacles/isuzu.png",
          "../images/obstacles/truck.png"
        ];

    let lastIndex = -1;  // store previous obstacle image index

for (let i = 0; i < numObstacles; i++) {
  let obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // create image element
  let img = document.createElement("img");

  // pick a random index different from lastIndex
  let va;
  do {
    va = Math.floor(Math.random() * obstacleImages.length);
  } while (va === lastIndex);

  img.src = obstacleImages[va];
  img.alt = "Obstacle";

  // 🎯 normalize sizes by file
  if (img.src.includes("isuzu.png")) {
    img.style.width = "250px";  // make car wider
  } else if (img.src.includes("stone.png")) {
    img.style.width = "100px";  // shrink rock
  } else if (img.src.includes("truck.png")) {
    img.style.width = "300px";  // medium size
  }

  obstacle.appendChild(img);

  resetObstacle(obstacle, true);
  game.appendChild(obstacle);
  obstacles.push(obstacle);

  // update lastIndex
  lastIndex = va;
}




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
  function resetObstacle(obstacle, firstTime = false) {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    obstacle.style.left = (lane) + "px";
    obstacle.style.top = firstTime
      ? Math.floor(Math.random() * -game.clientHeight) + "px"
      : "-50px";
  }

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
}