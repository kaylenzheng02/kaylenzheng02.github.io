let capture;
let palette = [];
const NUM_COLORS = 8;
const SAMPLE_RATE = 10;
const BINNING_FACTOR = 32;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Interaction State
let selectedColor;
let selectedIndex = -1;
let webcamReady = false;

// Music 
let song;
let isPlaying = false;

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  var host =
    document.querySelector("#hexcode-host") || document.querySelector("main");
  canvas.parent(host);

  capture = createCapture(VIDEO);
  capture.size(CANVAS_WIDTH, CANVAS_HEIGHT);
  capture.hide();

  // Load the song
  song = loadSound("../p5sketches/eddie-jabuley.mp3");

  setTimeout(() => {
    webcamReady = true;
  }, 500);

  noStroke();
  selectedColor = color(255, 255, 255);
}

function draw() {
  background(50, 50, 50);

  if (webcamReady) {
    push();
    translate(CANVAS_WIDTH - 100, 0);
    scale(-1, 1);
    image(capture, 0, 0, CANVAS_WIDTH - 100, CANVAS_HEIGHT);
    pop();

    // Analyze pixels and update palette
    analyzeAndGetPalette();

    // Draw the palette
    drawPalette();

    // Draw the interactive element
    drawInteractiveElement();

    // Draw music controls
    drawMusicControls();
  } else {
    // Display loading message
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text("Loading webcam...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
}

function analyzeAndGetPalette() {
  capture.loadPixels();
  let colorCounts = {};
  const w = capture.width;
  const h = capture.height;

  for (let y = 0; y < h; y += SAMPLE_RATE) {
    for (let x = 0; x < w - 100; x += SAMPLE_RATE) {
      let index = (x + y * w) * 4;

      let r = capture.pixels[index];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];

      // Color Quantization
      let qr = floor(r / BINNING_FACTOR) * BINNING_FACTOR;
      let qg = floor(g / BINNING_FACTOR) * BINNING_FACTOR;
      let qb = floor(b / BINNING_FACTOR) * BINNING_FACTOR;

      let colorKey = `${qr},${qg},${qb}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    }
  }

  updatePalette(colorCounts);
}

function updatePalette(counts) {
  let sortedColors = [];

  for (let key in counts) {
    let [r, g, b] = key.split(",").map(Number);
    sortedColors.push({
      r: r,
      g: g,
      b: b,
      count: counts[key],
    });
  }

  sortedColors.sort((a, b) => b.count - a.count);
  palette = sortedColors.slice(0, NUM_COLORS);
}

function drawPalette() {
  const PALETTE_WIDTH = 100;
  let paletteX = CANVAS_WIDTH - PALETTE_WIDTH;
  let swatchHeight = CANVAS_HEIGHT / NUM_COLORS;

  fill(45, 45, 45);
  rect(paletteX, 0, PALETTE_WIDTH, CANVAS_HEIGHT);

  for (let i = 0; i < palette.length; i++) {
    let c = palette[i];
    let swatchColor = color(c.r, c.g, c.b);
    fill(swatchColor);

    let y = i * swatchHeight;
    rect(paletteX, y, PALETTE_WIDTH, swatchHeight);

    // Draw border only if selected
    if (i === selectedIndex) {
      stroke(255, 255, 255);
      strokeWeight(4);
      noFill();
      rect(paletteX + 2, y + 2, PALETTE_WIDTH - 4, swatchHeight - 4, 5);
      noStroke();
    }
  }
}

function drawInteractiveElement() {
  const centerX = (CANVAS_WIDTH - 100) * 0.15;
  const centerY = CANVAS_HEIGHT / 2;

  // Add drop shadow
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "rgba(0, 0, 0, 0.5)";

  fill(selectedColor);
  rect(centerX - 50, centerY - 50, 100, 100, 8);

  // Display hex code below the square
  fill(255);
  textAlign(CENTER);
  textSize(14);
  let hexCode = rgbToHex(
    red(selectedColor),
    green(selectedColor),
    blue(selectedColor)
  );
  text(hexCode, centerX, centerY + 80);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
}

function drawMusicControls() {
  let buttonX = 30;
  let buttonY = 30;
  let buttonSize = 30;

  fill(100, 150, 255);
  rect(buttonX, buttonY, buttonSize, buttonSize, 5);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  let symbol = isPlaying ? "⏸" : "▶";
  text(symbol, buttonX + buttonSize / 2, buttonY + buttonSize / 2);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("The Ballad of Eddie Jabuley - my fav song", buttonX + buttonSize + 15, buttonY + buttonSize / 2);
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (int(r) << 16) + (int(g) << 8) + int(b))
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

function mouseClicked() {
  const PALETTE_WIDTH = 100;
  let paletteX = CANVAS_WIDTH - PALETTE_WIDTH;
  let swatchHeight = CANVAS_HEIGHT / NUM_COLORS;

  // Check if clicking music button
  let buttonX = 30;
  let buttonY = 30;
  let buttonSize = 30;

  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonSize &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonSize
  ) {
    toggleMusic();
    return;
  }

  if (
    mouseX > paletteX &&
    mouseX < CANVAS_WIDTH &&
    mouseY > 0 &&
    mouseY < CANVAS_HEIGHT
  ) {
    let clickedIndex = floor(mouseY / swatchHeight);

    if (clickedIndex < palette.length) {
      selectedIndex = clickedIndex;
      let c = palette[selectedIndex];
      selectedColor = color(c.r, c.g, c.b);
    }
  }
}

function toggleMusic() {
  if (isPlaying) {
    song.pause();
    isPlaying = false;
  } else {
    song.play();
    isPlaying = true;
  }
}