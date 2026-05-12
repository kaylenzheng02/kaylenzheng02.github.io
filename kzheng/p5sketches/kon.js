let capture;
let handPose;
let hands = [];
let particles = [];
let s = 120,
  minS = 120;
let grabbing = false;
let isIndexing = false;

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(600, 450);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  background(0);

  handPose.detectStart(capture, gotHands);

  for (let i = 0; i < 1200; i++) {
    let handID = i % 2;
    particles.push(new Particle(handID));
  }
}

function gotHands(results) {
  hands = results;
}

function draw() {
  // ghost particke
  push();
  fill(0, 15);
  rect(0, 0, width, height);
  pop();

  // VIDEO DISPLAY
  push();
  translate(width, 0);
  scale(-1, 1);
  tint(255, 12);
  image(capture, 0, 0);
  pop();

  capture.loadPixels();

  let anyHandGrabbing = false;
  let anyHandIndexing = false;
  let handData = [];

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let indexTip = hand.index_finger_tip;
    let middleTip = hand.middle_finger_tip;
    let thumbTip = hand.thumb_tip;

    let indexing =
      indexTip.y < middleTip.y - 40 && indexTip.y < thumbTip.y - 40;
    let d = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
    let grab = d < 45;

    if (grab) anyHandGrabbing = true;
    if (indexing) anyHandIndexing = true;

    handData.push({
      x: width - indexTip.x,
      y: indexTip.y,
      isGrabbing: grab,
      isIndexing: indexing,
    });
  }

  // collison, check how close fingers are
  let handsTouching = false;
  if (handData.length === 2) {
    let dBetween = dist(
      handData[0].x,
      handData[0].y,
      handData[1].x,
      handData[1].y
    );
    if (dBetween < 80) handsTouching = true; 
  }

  grabbing = anyHandGrabbing;
  isIndexing = anyHandIndexing;

  for (let p of particles) {
    p.update(handData, s, handsTouching);
    if (anyHandGrabbing || anyHandIndexing) {
      p.display();
    }
  }

  handlePhysics();

  push();
  textAlign(CENTER);
  textFont('Helvetica');
  textSize(14);
  fill(200, 70); 
  noStroke();
  text("pinch = blue, index = red, c = clear, use both hands : - D", width / 2, 50);
  pop();
}

class Particle {
  constructor(handID) {
    this.myHandID = handID;
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.acc = createVector(0, 0);
    this.maxSpeed = random(8, 15);
    this.maxForce = random(0.4, 1.2);

    this.angle = random(TWO_PI);
    this.angleStep = random(0.05, 0.15);
    this.orbitRadius = random(10, 80);
    this.color = color(255);
  }

  update(handData, size, isCollision) {
    this.prevPos = this.pos.copy();
    this.angle += this.angleStep;

    let targetPos;
    let state = { grabbing: false, indexing: false };

    if (handData.length > this.myHandID) {
      let h = handData[this.myHandID];
      state.grabbing = h.isGrabbing;
      state.indexing = h.isIndexing;
      let offsetX = cos(this.angle) * (this.orbitRadius + size / 2);
      let offsetY = sin(this.angle) * (this.orbitRadius + size / 4);
      targetPos = createVector(h.x + offsetX, h.y + offsetY);
    } else if (handData.length > 0) {
      let h = handData[0];
      state.grabbing = h.isGrabbing;
      state.indexing = h.isIndexing;
      targetPos = createVector(h.x, h.y);
    } else {
      targetPos = createVector(width / 2, height / 2);
    }

    let steer = p5.Vector.sub(targetPos, this.pos);
    let d = steer.mag();

    let speedLimit = isCollision ? this.maxSpeed * 2.0 : this.maxSpeed;

    if (d < 100) {
      steer.setMag(map(d, 0, 100, 0, speedLimit));
    } else {
      steer.setMag(speedLimit);
    }

    let force = p5.Vector.sub(steer, this.vel);
    force.limit(this.maxForce);
    this.acc.add(force);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }

    // color
    if (capture.pixels.length > 0) {
      let mx = floor(constrain(width - this.pos.x, 0, width - 1));
      let my = floor(constrain(this.pos.y, 0, height - 1));
      let pixIdx = (my * width + mx) * 4;

      let r = capture.pixels[pixIdx];
      let g = capture.pixels[pixIdx + 1];
      let b = capture.pixels[pixIdx + 2];

      if (isCollision) {
this.color = color(r + 180, g - 200, b + 255, 200);      
      } else if (state.grabbing) {
        this.color = color(r + 0, g + 100, b + 200, 255);
      } else if (state.indexing) {
        this.color = color(255 - r, 70 - g, 100 - b, 255);
      } else {
        this.color = color(r + 60, g + 60, b + 60, 40);
      }
    }
  }

  display() {
    stroke(this.color);
    strokeWeight(1.3);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  }
}

function handlePhysics() {
  if (grabbing || isIndexing) {
    s += 8;
    if (s > 300) s = 300;
  } else {
    if (s > minS) s = lerp(s, minS, 0.1);
  }
}

function keyPressed() {
  if (key === "c" || key === "C") background(0);
}