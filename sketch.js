

let foods = [];
let score = 0;
let gameState = "playing";
let doorWidth = 100;
let speedMultiplier = 1;

function setup() {
  createCanvas(600, 800);
  hero = new Hero();
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
  } else {
    drawGameOver();
  }
}

// Hero Class (updated for reliable keyboard controls)
class Hero {
  constructor() {
    this.x = width / 2;
    this.size = 50;
    this.energy = 100;
    this.speed = 5; // Speed for keyboard movement
    this.velocity = 0; // Added velocity for smoother movement
  }

  update() {
    // Keyboard control takes priority
    if (keyIsDown(LEFT_ARROW)) {
      this.velocity = -this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velocity = this.speed;
    } else {
      // If no arrow keys are pressed, use mouse control
      let targetX = constrain(mouseX, this.size / 2, width - this.size / 2);
      // Smoothly move towards mouse position
      this.velocity = (targetX - this.x) * 0.1;
    }

    // Update position with velocity
    this.x += this.velocity;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    
    // Update size based on energy
    this.size = map(this.energy, 100, 0, 50, 150);
  }

  show() {
    push();
    translate(this.x, height - 100);
    fill(255, 200, 150);
    ellipse(0, -this.size / 2, this.size / 2, this.size / 2);
    fill(100, 150, 255);
    rect(-this.size / 4, -this.size / 4, this.size / 2, this.size / 2, 5);
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

// Food Class (unchanged)
class Food {
  constructor(type) {
    this.x = random(20, width - 20);
    this.y = -20;
    this.type = type;
    this.isHealthy = type < 6;
    this.speed = random(2, 4) * speedMultiplier;
  }

  update() {
    this.y += this.speed;
    if (dist(this.x, this.y, hero.x, height - 100) < hero.size / 2 + 20) {
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
        ellipse(0, 0, 25, 25);
        fill(255, 150, 150, 150);
        arc(-5, -5, 10, 10, PI, PI * 1.5);
        fill(139, 69, 19);
        rect(0, -15, 2, 10);
        fill(0, 100, 0);
        ellipse(3, -10, 8, 4);
        break;
      case 1: // Broccoli
        fill(0, 120, 0);
        ellipse(0, -5, 20, 20);
        ellipse(-8, -10, 15, 15);
        ellipse(8, -10, 15, 15);
        ellipse(-4, 0, 12, 12);
        ellipse(4, 0, 12, 12);
        fill(0, 80, 0);
        rect(-4, 5, 8, 10);
        break;
      case 2: // Carrot
        fill(255, 150, 0);
        triangle(0, -15, -12, 15, 12, 15);
        stroke(200, 100, 0);
        strokeWeight(1);
        line(-6, 0, 6, 0);
        line(-4, 5, 4, 5);
        noStroke();
        fill(0, 150, 0);
        triangle(0, -15, -5, -20, 5, -20);
        triangle(-3, -15, -8, -18, -2, -18);
        triangle(3, -15, 8, -18, 2, -18);
        break;
      case 3: // Banana
        fill(255, 255, 0);
        beginShape();
        vertex(-10, -15);
        bezierVertex(-15, 0, -10, 15, 0, 20);
        bezierVertex(10, 15, 15, 0, 10, -15);
        endShape(CLOSE);
        stroke(200, 200, 0);
        strokeWeight(1);
        line(-5, -5, 5, -5);
        line(-7, 5, 7, 5);
        noStroke();
        break;
      case 4: // Grapes
        fill(150, 50, 200);
        ellipse(0, 0, 15, 15);
        ellipse(-8, -5, 15, 15);
        ellipse(8, -5, 15, 15);
        ellipse(-4, 5, 12, 12);
        ellipse(4, 5, 12, 12);
        fill(200, 100, 255, 150);
        ellipse(-8, -7, 5, 5);
        ellipse(8, -7, 5, 5);
        fill(0, 100, 0);
        rect(0, -10, 2, 5);
        break;
      case 5: // Orange
        fill(255, 150, 0);
        ellipse(0, 0, 25, 25);
        noFill();
        stroke(200, 100, 0);
        strokeWeight(1);
        for (let i = 0; i < 5; i++) {
          point(random(-10, 10), random(-10, 10));
        }
        noStroke();
        fill(0, 150, 0);
        ellipse(5, -10, 10, 5);
        break;
      case 6: // Burger
        fill(150, 100, 50);
        arc(0, -5, 30, 20, PI, TWO_PI, CHORD);
        fill(0, 200, 0);
        arc(0, 0, 28, 10, 0, PI);
        fill(139, 69, 19);
        rect(-15, 0, 30, 8);
        fill(150, 100, 50);
        rect(-15, 8, 30, 8, 0, 0, 5, 5);
        fill(255, 255, 200);
        ellipse(-8, -10, 3, 2);
        ellipse(0, -12, 3, 2);
        ellipse(8, -10, 3, 2);
        break;
      case 7: // Donut
        fill(200, 100, 150);
        ellipse(0, 0, 30, 30);
        fill(20, 40, 60);
        ellipse(0, 0, 12, 12);
        fill(255, 150, 150);
        rect(-10, -5, 4, 1);
        rect(5, 5, 1, 4);
        fill(150, 255, 150);
        rect(0, -10, 4, 1);
        rect(8, 0, 1, 4);
        break;
      case 8: // Soda Can
        fill(150);
        rect(-10, -15, 20, 30, 5);
        fill(200);
        ellipse(0, -15, 20, 5);
        fill(100);
        rect(-8, -5, 16, 10);
        fill(255, 0, 0);
        ellipse(0, 0, 8, 8);
        break;
      case 9: // Pizza Slice
        fill(255, 200, 100);
        triangle(0, -15, -15, 15, 15, 15);
        fill(255, 150, 0);
        triangle(0, -10, -12, 12, 12, 12);
        fill(255, 0, 0);
        ellipse(-5, 0, 5, 5);
        ellipse(5, 0, 5, 5);
        fill(0, 150, 0);
        rect(0, 5, 4, 2);
        break;
      case 10: // Ice Cream
        fill(222, 184, 135);
        triangle(0, 15, -10, -5, 10, -5);
        stroke(188, 143, 143);
        strokeWeight(1);
        line(-5, 5, 5, 5);
        line(-2, 0, 2, 0);
        noStroke();
        fill(255, 230, 200);
        ellipse(0, -10, 20, 20);
        ellipse(-5, -15, 15, 15);
        break;
      case 11: // Candy Bar
        fill(100, 50, 0);
        rect(-15, -10, 30, 20);
        fill(255, 0, 0, 150);
        rect(-15, -10, 30, 5);
        fill(255);
        textSize(8);
        text("YUM", -8, 0);
        break;
      case 12: // Hamburger
        fill(139, 69, 19);
        arc(0, -8, 30, 20, PI, TWO_PI, CHORD);
        fill(255, 255, 200);
        ellipse(-8, -12, 3, 2);
        ellipse(0, -14, 3, 2);
        ellipse(8, -12, 3, 2);
        fill(0, 200, 0);
        arc(0, -2, 28, 8, 0, PI);
        fill(255, 0, 0);
        rect(-14, 0, 28, 4);
        fill(165, 42, 42);
        rect(-15, 4, 30, 8);
        fill(255, 215, 0);
        rect(-13, 2, 26, 4);
        fill(139, 69, 19);
        rect(-15, 12, 30, 8, 0, 0, 5, 5);
        break;
    }
    pop();
  }
}

// Game Functions (unchanged)
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
  rect(width / 2 - doorWidth / 2, height - 50, doorWidth, 50);
  fill(255);
  textAlign(CENTER);
  text("Exit", width / 2, height - 25);
}

function drawStars() {
  for (let i = 0; i < 50; i++) {
    fill(255, random(150, 255));
    ellipse(random(width), random(height), random(2, 5));
  }
}

function drawUI() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text(`Score: ${score}`, 20, 30);
  text(`Energy: ${hero.energy}%`, 20, 60);
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
  textSize(40);
  text("Too Big to Fit!", width / 2, height / 2 - 50);
  textSize(20);
  text(`Score: ${score}`, width / 2, height / 2);
  text("Eat better next time! Press SPACE to retry.", width / 2, height / 2 + 50);
  text("Download the REALGRRT APP now:", width / 2, height / 2 + 100);
  fill(0, 191, 255);
  text("https://realgrrtapp.com", width / 2, height / 2 + 130);
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