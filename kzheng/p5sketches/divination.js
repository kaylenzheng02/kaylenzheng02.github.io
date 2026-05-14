
let input;
let message = "";
let oracleAnswer = "";
let allFonts = [];
let particles = [];
let currentFont = "sans-serif";
let isAnalysing = false;
let oracleStatus = "Initializing the Void...";

let capture;
let osc;
let faceBrightness = 127;

const API_KEY =
  typeof window !== "undefined" && window.DIVINATION_GOOGLE_FONTS_KEY
    ? window.DIVINATION_GOOGLE_FONTS_KEY
    : "";
const API_URL = API_KEY
  ? `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${API_KEY}`
  : "";

const CANVAS_W = 600;
const CANVAS_H = 450;

const responses = {
  bright: [
    "The path is clear, illuminated by your own light.",
    "A sudden clarity will resolve your doubt.",
    "The sun rises on this endeavor. Proceed with confidence.",
    "Your energy is vibrant; the answer is a resounding YES.",
    "Look toward the horizon; the solution is already visible.",
  ],
  dark: [
    "The shadows hide the truth for now. Wait for the moon to wane.",
    "You seek answers in the void, but the void seeks only silence.",
    "A secret influence is working against your current path.",
    "Turn inward. The darkness holds the key you misplaced.",
    "The answer is veiled. Ask again when the stars align.",
  ],
  neutral: [
    "Balance is required before the way opens.",
    "The scales are tipping. Your next move is critical.",
    "Neither yes nor no, but a transformation of the question.",
    "The ether is thick today. Clarity is a choice, not a gift.",
    "As above, so below. Your inner state reflects the outcome.",
  ],
};

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);

  osc = new p5.Oscillator("sine");
  osc.amp(0);
  osc.start();

  capture = createCapture(VIDEO);
  capture.size(CANVAS_W, CANVAS_H);
  capture.hide();

  input = createInput();
  input.position(width / 2 - 150, height * 0.85);
  input.size(300);
  input.attribute("placeholder", "Ask a question and press Enter...");
  input.style("background", "transparent");
  input.style("border", "none");
  input.style("border-bottom", "2px solid #00ff64");
  input.style("color", "#00ff64");
  input.style("text-align", "center");
  input.style("font-family", "monospace");
  input.style("outline", "none");

  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  loadFonts();
}

async function loadFonts() {
  try {
    if (!API_URL) throw new Error("no fonts API key");
    const response = await fetch(API_URL);
    const data = await response.json();
    if (data && data.items) {
      allFonts = data.items.filter(
        (f) => f.category === "display" || f.category === "handwriting"
      );
      oracleStatus = "The Oracle has opened its eye. Speak your truth.";
    }
  } catch (err) {
    oracleStatus = "Connection to the beyond is severed.";
  }
  if (allFonts.length === 0) {
    allFonts = [
      { family: "Georgia", category: "serif" },
      { family: "Palatino Linotype", category: "serif" },
      { family: "Courier New", category: "monospace" },
    ];
    oracleStatus = "The Oracle has opened its eye. Speak your truth.";
  }
}

function keyPressed() {
  if (keyCode === ENTER && allFonts.length > 0) {
    performDivination();
  }
}

function performDivination() {
  let val = input.value();
  if (val.trim() === "") return;

  message = val;
  input.value("");
  oracleAnswer = ""; // Clear previous answer
  isAnalysing = true;
  oracleStatus = "EXTRACTING DESTINY...";

  osc.amp(0.2, 0.5);
  osc.freq(map(faceBrightness, 0, 255, 100, 800), 1.5);

  setTimeout(() => {
    faceBrightness = getAverageBrightness(capture);
    let ritualIndex =
      abs(message.length * 13 + floor(faceBrightness)) % allFonts.length;
    let selectedFont = allFonts[ritualIndex];
    currentFont = selectedFont.family;

    let mood = "neutral";
    if (faceBrightness > 160) mood = "bright";
    if (faceBrightness < 90) mood = "dark";

    let responseList = responses[mood];
    oracleAnswer =
      responseList[
        abs(message.length + floor(faceBrightness)) % responseList.length
      ];

    let link = createElement("link");
    link.attribute("rel", "stylesheet");
    link.attribute(
      "href",
      `https://fonts.googleapis.com/css2?family=${currentFont.replace(
        / /g,
        "+"
      )}`
    );

    isAnalysing = false;
    oracleStatus = "The Oracle has spoken.";
    osc.amp(0, 1.0);
  }, 2500);
}

function getAverageBrightness(img) {
  img.loadPixels();
  let r = 0,
    g = 0,
    b = 0,
    count = 0;
  if (img.pixels.length === 0) return 127;
  for (let i = 0; i < img.pixels.length; i += 40) {
    r += img.pixels[i];
    g += img.pixels[i + 1];
    b += img.pixels[i + 2];
    count++;
  }
  return (r + g + b) / (3 * count);
}

function draw() {
  background(5, 12, 8);

  push();
  translate(width, 0);
  scale(-1, 1);
  tint(0, 255, 100, 35);
  imageMode(CENTER);
  image(capture, width / 2, height / 2, width, height);
  faceBrightness = getAverageBrightness(capture);
  pop();

  drawEnergyMeter();

  particles.forEach((p) => {
    p.update(isAnalysing, faceBrightness);
    p.show();
  });

  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  let boxW = width * 0.8;
  let boxH = height * 0.4;

  if (isAnalysing) {
    fill(0, 255, 100, 200);
    textFont("monospace");
    textSize(22);
    text("SCANNINING THE ETHER...", width / 2, height / 2);

    // Scanning square
    noFill();
    stroke(0, 255, 100, 100);
    rect(width / 2, height / 2, 250, 200);
  } else if (oracleAnswer !== "") {
    textFont(currentFont);
    textSize(constrain(map(oracleAnswer.length, 20, 100, 60, 35), 24, 75));

    // Glowing Shadow
    fill(0, 255, 100, 40);
    text(oracleAnswer, width / 2 + 3, height / 2 + 3, boxW, boxH);

    // Main Text
    fill(220, 255, 230);
    text(oracleAnswer, width / 2, height / 2, boxW, boxH);

    // Question Label
    textFont("monospace");
    textSize(12);
    fill(0, 255, 100, 100);
    text("QUERY: " + message.toUpperCase(), width / 2, height * 0.75);
  } else {
    fill(0, 255, 100, 150);
    textFont("monospace");
    textSize(16);
    text(oracleStatus.toUpperCase(), width / 2, height / 2);
  }
}

function drawEnergyMeter() {
  let meterW = 300;
  let meterX = width / 2;
  let meterY = height - 60;

  rectMode(CENTER);
  noFill();
  stroke(0, 255, 100, 50);
  rect(meterX, meterY, meterW, 10);

  let fillWidth = map(faceBrightness, 0, 255, 0, meterW);
  fill(0, 255, 100, 180);
  noStroke();
  rectMode(CORNER); // Switch to fill from left
  rect(meterX - meterW / 2, meterY - 5, fillWidth, 10);

  let label = "NEUTRAL";
  if (faceBrightness > 160) label = "RADIANT";
  if (faceBrightness < 90) label = "OBSCURE";

  textAlign(CENTER);
  textFont("monospace");
  textSize(10);
  text("ESSENCE ENERGY: " + label, meterX, meterY - 15);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.size = random(1, 4);
  }
  update(agitated, brightness) {
    let speed = agitated ? 10 : map(brightness, 0, 255, 0.1, 2);
    this.pos.add(this.vel.copy().mult(speed));
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  show() {
    noStroke();
    fill(0, 255, 100, 60);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(CANVAS_W, CANVAS_H);
}
