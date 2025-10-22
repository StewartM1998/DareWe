// -------------------------------------------------------------
// DARE WE GENERATOR (GitHub Pages version)
// Structure: assets/UI/, assets/Fonts/, assets/Illustrations/
// -------------------------------------------------------------

// Globals
let bgColor = '#400d60';
let layout = 1;
let posterSize = 'Story';
let hashtagText = '# dare we';
let mainText = '';
let illustrationX = 4;
let illustrationY = 0;
let illustrationScale = 1;
let illustrationCategory = 'Cake';
let illustrationIndex = 0;

let logos = [];
let logosRight, logosRight2;
let illustrationImgs = {};
let selectedIndicator;
let savedPosters = [];
let wallContainer;
let canvas;
let rgfFont, helveticaFont;
let mainTextArea;
let fontsLoaded = false;
let colorButtons = {};

// Corrected folder constants
const F_UI = 'assets/UI/';
const F_FONTS = 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

// Categories
const categories = [
  "Cake", "Eye", "FlowerA", "FlowerB", "FlowerC",
  "HandA", "HandB", "HandC", "Lip", "Question"
];

// Poster sizes
const posterSizes = {
  'Story': { width: 1080, height: 1920 },
  'Post': { width: 1080, height: 1350 },
  'Square': { width: 1080, height: 1080 },
  'Landscape': { width: 1920, height: 1080 }
};

// Character limits
const charsPerLineConfig = {
  'Story': 10,
  'Post': 10,
  'Square': 10,
  'Landscape': 16
};

// -------------------------------------------------------------
// PRELOAD — loads all assets with correct paths
// -------------------------------------------------------------
function preload() {
  // UI
  selectedIndicator = loadImage(F_UI + 'selected01.png');

  // Logos
  for (let i = 0; i < 6; i++) {
    logos[i] = loadImage(F_UI + `logo-left${i}.png`);
  }
  logosRight = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  // Illustrations
  for (let cat of categories) {
    illustrationImgs[cat] = [];
    for (let i = 0; i < 6; i++) {
      illustrationImgs[cat][i] = loadImage(F_ILLU + `${cat}/${cat}${i}.png`);
    }
  }

  // Fonts
  rgfFont = loadFont(F_FONTS + '200525_RGF_Sans.otf', () => {
    fontsLoaded = true;
    console.log('RGF Sans font loaded');
  });

  // Optional secondary font
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// -------------------------------------------------------------
// SETUP
// -------------------------------------------------------------
function setup() {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';

  // Main container
  let mainContainer = createDiv();
  mainContainer.id('mainContainer');
  mainContainer.style('width', '100%');
  mainContainer.style('display', 'flex');
  mainContainer.style('flex-direction', 'column');
  mainContainer.style('align-items', 'center');

  // Wall container
  wallContainer = createDiv();
  wallContainer.id('wallContainer');
  wallContainer.style('width', '100%');
  wallContainer.style('max-width', '1200px');
  wallContainer.style('padding', '10px');
  wallContainer.style('background-color', '#f5f5f5');
  wallContainer.style('margin-bottom', '5px');
  wallContainer.style('display', 'flex');
  wallContainer.style('flex-direction', 'column');
  wallContainer.style('align-items', 'center');
  wallContainer.parent(mainContainer);

  // Editor container
  let editorContainer = createDiv();
  editorContainer.id('editorContainer');
  editorContainer.style('width', '100%');
  editorContainer.style('max-width', '1200px');
  editorContainer.style('display', 'flex');
  editorContainer.style('flex-direction', 'row');
  editorContainer.style('margin-bottom', '5px');
  editorContainer.style('gap', '20px');
  editorContainer.parent(mainContainer);

  // UI panel
  let ui = createDiv();
  ui.id('uiPanel');
  ui.style('width', '350px');
  ui.style('min-width', '350px');
  ui.style('background', '#ffffff');
  ui.style('padding', '15px');
  ui.style('box-shadow', '0 2px 10px rgba(0,0,0,0.1)');
  ui.style('border-radius', '8px');
  ui.style('overflow-y', 'auto');
  ui.style('position', 'sticky');
  ui.style('top', '15px');
  ui.style('align-self', 'flex-start');
  ui.parent(editorContainer);

  let title = createElement('h1', 'Dare We Generator');
  title.parent(ui);
  title.style('margin-top', '0');
  title.style('margin-bottom', '20px');
  title.style('color', '#333');

  // Canvas container
  let canvasContainer = createDiv();
  canvasContainer.id('canvasContainer');
  canvasContainer.style('flex-grow', '1');
  canvasContainer.style('background-color', '#ffffff');
  canvasContainer.style('padding', '10px');
  canvasContainer.style('border-radius', '8px');
  canvasContainer.style('box-shadow', '0 2px 10px rgba(0,0,0,0.1)');
  canvasContainer.style('display', 'flex');
  canvasContainer.style('justify-content', 'center');
  canvasContainer.style('align-items', 'center');
  canvasContainer.style('min-width', '0');
  canvasContainer.parent(editorContainer);

  calculateScaleRatio();
  updateCanvasSize();

  canvas = createCanvas(canvasW, canvasH);
  canvas.parent(canvasContainer);

  textFont(rgfFont);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  createUI(ui);
  addStyles();
  updateWrappedText();
}

// -------------------------------------------------------------
// DRAW
// -------------------------------------------------------------
function draw() {
  scale(scaleRatio);
  background(bgColor);

  // (Your existing draw logic for logo/text/illustration goes here)
}

// -------------------------------------------------------------
// CREATE UI — all paths corrected
// -------------------------------------------------------------
function createUI(ui) {
  // Sliders
  let sizeSliderContainer = createDiv();
  sizeSliderContainer.style('background-image', 'url(' + F_UI + 'vector2.png)');
  let sizeHandle = createImg(F_UI + 'handle.png', 'slider handle');
  sizeHandle.style('display', 'none');

  let illuSliderContainer = createDiv();
  illuSliderContainer.style('background-image', 'url(' + F_UI + 'vector2.png)');
  let illuHandle = createImg(F_UI + 'handle.png', 'slider handle');
  illuHandle.style('display', 'none');

  let illuYSliderContainer = createDiv();
  illuYSliderContainer.style('background-image', 'url(' + F_UI + 'vector2.png)');
  let illuYHandle = createImg(F_UI + 'handle.png', 'slider handle');
  illuYHandle.style('display', 'none');

  // Color indicator
  let indicator = createImg(F_UI + 'selected01.png', 'selected');
  indicator.style('display', 'none');
}

// -------------------------------------------------------------
// ADD STYLES
// -------------------------------------------------------------
function addStyles() {
  let style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'RGF Sans';
      src: url('assets/Fonts/200525_RGF_Sans.otf') format('opentype');
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      overflow-x: hidden;
    }

    h1 {
      font-family: 'RGF Sans';
      font-size: 1.5em;
      color: #333;
    }
  `;
  document.head.appendChild(style);
}

// -------------------------------------------------------------
// SCALE + RESIZE
// -------------------------------------------------------------
let scaleRatio = 0.5;
let canvasW, canvasH;

function calculateScaleRatio() {
  let posterWidth = posterSizes[posterSize].width;
  let posterHeight = posterSizes[posterSize].height;
  let widthRatio = windowWidth / posterWidth;
  let heightRatio = windowHeight / posterHeight;
  scaleRatio = Math.min(widthRatio, heightRatio, 0.5);
  scaleRatio = Math.max(scaleRatio, 0.15);
}

function updateCanvasSize() {
  canvasW = posterSizes[posterSize].width * scaleRatio;
  canvasH = posterSizes[posterSize].height * scaleRatio;
  resizeCanvas(canvasW, canvasH);
}

function windowResized() {
  calculateScaleRatio();
  updateCanvasSize();
}
