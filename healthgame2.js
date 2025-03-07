let foods = [];
let score = 0;
let gameState = "playing";
let doorWidth;
let speedMultiplier = 1;
let restartButton;
let scaleFactor; // For responsive scaling

function setup() {
  // Set canvas to fit screen with max limits
  let canvasWidth = min(windowWidth, 800); // Cap for desktop
  let canvasHeight = min(windowHeight, 1000); // Cap for desktop
  createCanvas(canvasWidth, canvasHeight);

  // Calculate scale factor based on base resolution (600x800)
  scaleFactor = min(width / 600, height / 800);
  doorWidth = 100 * scaleFactor; // Scale door dynamically

  hero = new Hero();
  textAlign(CENTER);

  // Restart button
  restartButton = createButton('Restart');
  restartButton.size(80 * scaleFactor, 40 * scaleFactor); // Scale button
  restartButton.style('font-size', `${20 * scaleFactor}px`);
  restartButton.hide();
  restartButton.mousePressed(resetGame);

  positionUIElements(); // Initial positioning
}

function windowResized() {
  // Resize canvas on window change
  let canvasWidth = min(windowWidth, 800);
  let canvasHeight = min(windowHeight, 1000);
  resizeCanvas(canvasWidth, canvasHeight);
  scaleFactor = min(width / 600, height / 800);
  doorWidth = 100 * scaleFactor;
  positionUIElements();
}

function positionUIElements() {
  restartButton.position(width / 2 - (40 * scaleFactor), height - (100 * scaleFactor));
}

// Hero Class
class Hero {
  constructor() {
    this.x = width / 2;
    this.size = 50 * scaleFactor; // Scaled size
    this.energy = 100;
    this.speed = 5 * scaleFactor; // Scaled speed
    this.velocity = 0;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.velocity = -this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velocity = this.speed;
    } else {
      let targetX = constrain(mouseX, this.size / 2, width - this.size / 2);
      this.velocity = (targetX - this.x) * 0.1;
    }
    this.x += this.velocity;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.size = map(this.energy, 100, 0, 50 * scaleFactor, 150 * scaleFactor);
  }

  show() {
    push();
    translate(this.x, height - (100 * scaleFactor));
    fill(255, 200, 150);
    ellipse(0, -this.size / 2, this.size / 2, this.size / 2);
    fill(100, 150, 255);
    rect(-this.size / 4, -this.size / 4, this.size / 2, this.size / 2, 5 * scaleFactor);
    fill(255, 200, 150);
    rect(-this.size / 2, -this.size / 4, this.size / 4, this.size / 2);
    rect(this.size / 4, -this.size / 4, this.size / 4, this.size / 2);
    fill(50, 50, 50);
    rect(-this.size / 4, 0, this.size / 2, this.size / 2);
    fill(255);
    ellipse(-this.size / 8, -this.size / 2, this.size / 10);
    ellipse(this.size / 8, -this.size / 2, this.size / 10);
    pop();
  }
}

// Food Class
class Food {
  constructor(type) {
    this.x = random(20 * scaleFactor, width - (20 * scaleFactor));
    this.y = -20 * scaleFactor;
    this.type = type;
    this.isHealthy = type < 6;
    this.speed = random(2, 4) * speedMultiplier * scaleFactor;
  }

  update() {
    this.y += this.speed;
    if (dist(this.x, this.y, hero.x, height - (100 * scaleFactor)) < hero.size / 2 + (20 * scaleFactor)) {
      if (this.isHealthy) {
        hero.energy = min(100, hero.energy + 10);
        score += 10;
      } else {
        hero.energy = max(0, hero.energy - 15);
        score -= 5;
      }
      return true;
    }
    return this.y > height;
  }

  show() {
    push();
    translate(this.x, this.y);
    switch (this.type) {
      case 0: // Apple
        fill(255, 100, 100);
        ellipse(0, 0, 25 * scaleFactor, 25 * scaleFactor);
        fill(255, 150, 150, 150);
        arc(-5 * scaleFactor, -5 * scaleFactor, 10 * scaleFactor, 10 * scaleFactor, PI, PI * 1.5);
        fill(139, 69, 19);
        rect(0, -15 * scaleFactor, 2 * scaleFactor, 10 * scaleFactor);
        fill(0, 100, 0);
        ellipse(3 * scaleFactor, -10 * scaleFactor, 8 * scaleFactor, 4 * scaleFactor);
        break;
      case 1: // Broccoli
        fill(0, 120, 0);
        ellipse(0, -5 * scaleFactor, 20 * scaleFactor, 20 * scaleFactor);
        ellipse(-8 * scaleFactor, -10 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        ellipse(8 * scaleFactor, -10 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        ellipse(-4 * scaleFactor, 0, 12 * scaleFactor, 12 * scaleFactor);
        ellipse(4 * scaleFactor, 0, 12 * scaleFactor, 12 * scaleFactor);
        fill(0, 80, 0);
        rect(-4 * scaleFactor, 5 * scaleFactor, 8 * scaleFactor, 10 * scaleFactor);
        break;
      case 2: // Carrot
        fill(255, 150, 0);
        triangle(0, -15 * scaleFactor, -12 * scaleFactor, 15 * scaleFactor, 12 * scaleFactor, 15 * scaleFactor);
        stroke(200, 100, 0);
        strokeWeight(1 * scaleFactor);
        line(-6 * scaleFactor, 0, 6 * scaleFactor, 0);
        line(-4 * scaleFactor, 5 * scaleFactor, 4 * scaleFactor, 5 * scaleFactor);
        noStroke();
        fill(0, 150, 0);
        triangle(0, -15 * scaleFactor, -5 * scaleFactor, -20 * scaleFactor, 5 * scaleFactor, -20 * scaleFactor);
        triangle(-3 * scaleFactor, -15 * scaleFactor, -8 * scaleFactor, -18 * scaleFactor, -2 * scaleFactor, -18 * scaleFactor);
        triangle(3 * scaleFactor, -15 * scaleFactor, 8 * scaleFactor, -18 * scaleFactor, 2 * scaleFactor, -18 * scaleFactor);
        break;
      case 3: // Banana
        fill(255, 255, 0);
        beginShape();
        vertex(-10 * scaleFactor, -15 * scaleFactor);
        bezierVertex(-15 * scaleFactor, 0, -10 * scaleFactor, 15 * scaleFactor, 0, 20 * scaleFactor);
        bezierVertex(10 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor, 0, 10 * scaleFactor, -15 * scaleFactor);
        endShape(CLOSE);
        stroke(200, 200, 0);
        strokeWeight(1 * scaleFactor);
        line(-5 * scaleFactor, -5 * scaleFactor, 5 * scaleFactor, -5 * scaleFactor);
        line(-7 * scaleFactor, 5 * scaleFactor, 7 * scaleFactor, 5 * scaleFactor);
        noStroke();
        break;
      case 4: // Grapes
        fill(150, 50, 200);
        ellipse(0, 0, 15 * scaleFactor, 15 * scaleFactor);
        ellipse(-8 * scaleFactor, -5 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        ellipse(8 * scaleFactor, -5 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        ellipse(-4 * scaleFactor, 5 * scaleFactor, 12 * scaleFactor, 12 * scaleFactor);
        ellipse(4 * scaleFactor, 5 * scaleFactor, 12 * scaleFactor, 12 * scaleFactor);
        fill(200, 100, 255, 150);
        ellipse(-8 * scaleFactor, -7 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
        ellipse(8 * scaleFactor, -7 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
        fill(0, 100, 0);
        rect(0, -10 * scaleFactor, 2 * scaleFactor, 5 * scaleFactor);
        break;
      case 5: // Orange
        fill(255, 150, 0);
        ellipse(0, 0, 25 * scaleFactor, 25 * scaleFactor);
        noFill();
        stroke(200, 100, 0);
        strokeWeight(1 * scaleFactor);
        for (let i = 0; i < 5; i++) {
          point(random(-10 * scaleFactor, 10 * scaleFactor), random(-10 * scaleFactor, 10 * scaleFactor));
        }
        noStroke();
        fill(0, 150, 0);
        ellipse(5 * scaleFactor, -10 * scaleFactor, 10 * scaleFactor, 5 * scaleFactor);
        break;
      case 6: // Burger
        fill(150, 100, 50);
        arc(0, -5 * scaleFactor, 30 * scaleFactor, 20 * scaleFactor, PI, TWO_PI, CHORD);
        fill(0, 200, 0);
        arc(0, 0, 28 * scaleFactor, 10 * scaleFactor, 0, PI);
        fill(139, 69, 19);
        rect(-15 * scaleFactor, 0, 30 * scaleFactor, 8 * scaleFactor);
        fill(150, 100, 50);
        rect(-15 * scaleFactor, 8 * scaleFactor, 30 * scaleFactor, 8 * scaleFactor, 0, 0, 5 * scaleFactor, 5 * scaleFactor);
        fill(255, 255, 200);
        ellipse(-8 * scaleFactor, -10 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        ellipse(0, -12 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        ellipse(8 * scaleFactor, -10 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        break;
      case 7: // Donut
        fill(200, 100, 150);
        ellipse(0, 0, 30 * scaleFactor, 30 * scaleFactor);
        fill(20, 40, 60);
        ellipse(0, 0, 12 * scaleFactor, 12 * scaleFactor);
        fill(255, 150, 150);
        rect(-10 * scaleFactor, -5 * scaleFactor, 4 * scaleFactor, 1 * scaleFactor);
        rect(5 * scaleFactor, 5 * scaleFactor, 1 * scaleFactor, 4 * scaleFactor);
        fill(150, 255, 150);
        rect(0, -10 * scaleFactor, 4 * scaleFactor, 1 * scaleFactor);
        rect(8 * scaleFactor, 0, 1 * scaleFactor, 4 * scaleFactor);
        break;
      case 8: // Soda Can
        fill(150);
        rect(-10 * scaleFactor, -15 * scaleFactor, 20 * scaleFactor, 30 * scaleFactor, 5 * scaleFactor);
        fill(200);
        ellipse(0, -15 * scaleFactor, 20 * scaleFactor, 5 * scaleFactor);
        fill(100);
        rect(-8 * scaleFactor, -5 * scaleFactor, 16 * scaleFactor, 10 * scaleFactor);
        fill(255, 0, 0);
        ellipse(0, 0, 8 * scaleFactor, 8 * scaleFactor);
        break;
      case 9: // Pizza Slice
        fill(255, 200, 100);
        triangle(0, -15 * scaleFactor, -15 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        fill(255, 150, 0);
        triangle(0, -10 * scaleFactor, -12 * scaleFactor, 12 * scaleFactor, 12 * scaleFactor, 12 * scaleFactor);
        fill(255, 0, 0);
        ellipse(-5 * scaleFactor, 0, 5 * scaleFactor, 5 * scaleFactor);
        ellipse(5 * scaleFactor, 0, 5 * scaleFactor, 5 * scaleFactor);
        fill(0, 150, 0);
        rect(0, 5 * scaleFactor, 4 * scaleFactor, 2 * scaleFactor);
        break;
      case 10: // Ice Cream
        fill(222, 184, 135);
        triangle(0, 15 * scaleFactor, -10 * scaleFactor, -5 * scaleFactor, 10 * scaleFactor, -5 * scaleFactor);
        stroke(188, 143, 143);
        strokeWeight(1 * scaleFactor);
        line(-5 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
        line(-2 * scaleFactor, 0, 2 * scaleFactor, 0);
        noStroke();
        fill(255, 230, 200);
        ellipse(0, -10 * scaleFactor, 20 * scaleFactor, 20 * scaleFactor);
        ellipse(-5 * scaleFactor, -15 * scaleFactor, 15 * scaleFactor, 15 * scaleFactor);
        break;
      case 11: // Candy Bar
        fill(100, 50, 0);
        rect(-15 * scaleFactor, -10 * scaleFactor, 30 * scaleFactor, 20 * scaleFactor);
        fill(255, 0, 0, 150);
        rect(-15 * scaleFactor, -10 * scaleFactor, 30 * scaleFactor, 5 * scaleFactor);
        fill(255);
        textSize(8 * scaleFactor);
        text("YUM", -8 * scaleFactor, 0);
        break;
      case 12: // Hamburger
        fill(139, 69, 19);
        arc(0, -8 * scaleFactor, 30 * scaleFactor, 20 * scaleFactor, PI, TWO_PI, CHORD);
        fill(255, 255, 200);
        ellipse(-8 * scaleFactor, -12 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        ellipse(0, -14 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        ellipse(8 * scaleFactor, -12 * scaleFactor, 3 * scaleFactor, 2 * scaleFactor);
        fill(0, 200, 0);
        arc(0, -2 * scaleFactor, 28 * scaleFactor, 8 * scaleFactor, 0, PI);
        fill(255, 0, 0);
        rect(-14 * scaleFactor, 0, 28 * scaleFactor, 4 * scaleFactor);
        fill(165, 42, 42);
        rect(-15 * scaleFactor, 4 * scaleFactor, 30 * scaleFactor, 8 * scaleFactor);
        fill(255, 215, 0);
        rect(-13 * scaleFactor, 2 * scaleFactor, 26 * scaleFactor, 4 * scaleFactor);
        fill(139, 69, 19);
        rect(-15 * scaleFactor, 12 * scaleFactor, 30 * scaleFactor, 8 * scaleFactor, 0, 0, 5 * scaleFactor, 5 * scaleFactor);
        break;
    }
    pop();
  }
}

// Game Functions
function spawnFood() {
  if (frameCount % 15 === 0) {
    let type = floor(random(13));
    foods.push(new Food(type));
    speedMultiplier += 0.015;
  }
}

function updateFoods() {
  for (let i = foods.length - 1; i >= 0; i--) {
    foods[i].show();
    if (foods[i].update()) {
      foods.splice(i, 1);
    }
  }
}

function drawDoor() {
  fill(100, 150, 255);
  rect(width / 2 - doorWidth / 2, height - (50 * scaleFactor), doorWidth, 50 * scaleFactor);
  fill(255);
  textSize(20 * scaleFactor);
  text("Exit", width / 2, height - (25 * scaleFactor));
}

function drawStars() {
  for (let i = 0; i < 50; i++) {
    fill(255, random(150, 255));
    ellipse(random(width), random(height), random(2, 5) * scaleFactor);
  }
}

function drawUI() {
  fill(255);
  textSize(20 * scaleFactor);
  textAlign(LEFT);
  text(`Score: ${score}`, 20 * scaleFactor, 30 * scaleFactor);
  text(`Energy: ${hero.energy}%`, 20 * scaleFactor, 60 * scaleFactor);
}

function checkGameOver() {
  if (hero.size > doorWidth) {
    gameState = "gameover";
  }
}

function drawGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER);
  textSize(40 * scaleFactor);
  text("Too Big to Fit!", width / 2, height / 2 - (50 * scaleFactor));
  textSize(20 * scaleFactor);
  text(`Score: ${score}`, width / 2, height / 2);
  text("Press SPACE or Tap Restart to retry.", width / 2, height / 2 + (50 * scaleFactor));
  text("Eat Healthy Download the REALGRRT APP now:", width / 2, height / 2 + (100 * scaleFactor));
  fill(0, 191, 255);
  text("https://realgrrtapp.com", width / 2, height / 2 + (130 * scaleFactor));
}

function resetGame() {
  hero = new Hero();
  foods = [];
  score = 0;
  speedMultiplier = 1;
  gameState = "playing";
}

function keyPressed() {
  if (key === ' ' && gameState === "gameover") {
    resetGame();
  }
}

function touchMoved() {
  if (gameState === "playing") {
    hero.x = constrain(mouseX, hero.size / 2, width - hero.size / 2);
  }
  return false; // Prevent scrolling on mobile
}

function draw() {
  background(20, 40, 60);
  drawStars();

  if (gameState === "playing") {
    spawnFood();
    hero.update();
    hero.show();
    updateFoods();
    drawDoor();
    drawUI();
    checkGameOver();
    restartButton.hide();
  } else {
    drawGameOver();
    restartButton.show();
  }
}
