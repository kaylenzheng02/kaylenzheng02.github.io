let circles = [];

function setup() {
  createCanvas(600, 450);
  circles.push(new Circle(width / 2, height / 2, 70, 0));
}

function draw() {
  background(255); 

  //  relationship lines 
  for (let c of circles) {
    c.drawConnection();
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].move();
    circles[i].display();
  }
}

function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    if (c.contains(mouseX, mouseY)) {
      if (c.r > 12) { 
        let angle = random(TWO_PI); 
        let c1 = new Circle(c.x, c.y, c.r * 0.75, c.level + 1);
        let c2 = new Circle(c.x, c.y, c.r * 0.75, c.level + 1);
        
        let force = 10; 
        c1.vx = cos(angle) * force;
        c1.vy = sin(angle) * force;
        c2.vx = cos(angle + PI) * force;
        c2.vy = sin(angle + PI) * force;
        
        c1.partner = c2; 
        c1.connectionAlpha = 200; 

        circles.push(c1, c2);
        circles.splice(i, 1);
        break; 
      }
    }
  }
}

class Circle {
  constructor(x, y, r, level) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.level = level; 
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.92;
    this.partner = null;
    this.connectionAlpha = 0;
  }

  move() { //avoid mouse func
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 120) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let push = map(d, 0, 120, 0.4, 0);
      this.vx += cos(angle) * push;
      this.vy += sin(angle) * push;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;

    let padding = 2;
    if (this.x + this.r > width - padding) {
      this.x = width - this.r - padding;
      this.vx *= -1;
    } else if (this.x - this.r < padding) {
      this.x = this.r + padding;
      this.vx *= -1;
    }

    if (this.y + this.r > height - padding) {
      this.y = height - this.r - padding;
      this.vy *= -1;
    } else if (this.y - this.r < padding) {
      this.y = this.r + padding;
      this.vy *= -1;
    }

    if (this.connectionAlpha > 0) this.connectionAlpha -= 4;
  }

  drawConnection() {
    if (this.partner && this.connectionAlpha > 0) {
      stroke(0, this.connectionAlpha);
      strokeWeight(0.5); // connect with other split
      line(this.x, this.y, this.partner.x, this.partner.y);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // escape from mouse thing squash n split func
    let speed = dist(0, 0, this.vx, this.vy);
    let stretch = map(speed, 0, 20, 1, 1.3);
    let squash = map(speed, 0, 20, 1, 0.8);
    let angle = atan2(this.vy, this.vx);
    
    rotate(angle);
    scale(stretch, squash);

    if (this.level >= 2) {
      rotate(-angle); 
      scale(1/stretch, 1/squash); 
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.r * 0.85);
      textStyle(BOLD);
      text("SPLIT", 0, 0);
    } 
    else {
      stroke(0);
      strokeWeight(2);
      fill(0);
      ellipse(0, 0, this.r * 2);
    }
    pop();
  }

  contains(mx, my) {
    return dist(mx, my, this.x, this.y) < this.r;
  }
}