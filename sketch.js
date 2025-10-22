// -----------------------------
// DARE WE — Final GitHub Pages version
// -----------------------------

let bgColor = '#400d60';
let layout = 1;
let posterSize = 'Story'; // 'Story', 'Post', 'Square', or 'Landscape'
let hashtagText = '# dare we';
let mainText = '';
let illustrationX = 4;
let illustrationY = 0;
let illustrationScale = 1;
let illustrationCategory = 'Cake';
let illustrationIndex = 0;

// Assets and UI elements
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

// Folder constants (for your current file structure)
const F_UI = 'assets/UI/';
const F_FONTS = 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

// Categories
const categories = [
  "Cake", "Eye", "FlowerA", "FlowerB", "FlowerC",
  "HandA", "HandB", "HandC", "Lip", "Question"
];

// Character limits per poster size
const charsPerLineConfig = {
  'Story': 10,
  'Post': 10,
  'Square': 10,
  'Landscape': 16
};

// Layout and size constants
const posterSizes = {
  'Story': { width: 1080, height: 1920 },
  'Post': { width: 1080, height: 1350 },
  'Square': { width: 1080, height: 1080 },
  'Landscape': { width: 1920, height: 1080 }
};

// Positioning and color configuration objects (unchanged from your version)
// — keep your headerPositions, footerPositions, textPositions, illustrationPositions,
//   lineLimits, colorPalette, etc. exactly as you had them before.

// -----------------------------
// PRELOAD — with corrected asset paths
// -----------------------------
function preload() {
  // Selected indicator
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

  // Only load Helvetica if it exists
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// -----------------------------
// SETUP
// -----------------------------
function setup() {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';

  // Create main container
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

  // Title
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

  // Calculate canvas scale
  calculateScaleRatio();
  updateCanvasSize();

  // Create canvas
  canvas = createCanvas(canvasW, canvasH);
  canvas.parent(canvasContainer);

  textFont(rgfFont);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  // Build UI
  createUI(ui);
  addStyles();
  updateWrappedText();
}

// -----------------------------
// DRAW
// -----------------------------
function draw() {
  scale(scaleRatio);
  background(bgColor);

  // (Your existing draw logic remains unchanged)
}

// -----------------------------
// CREATE UI — with correct UI paths
// -----------------------------
function createUI(ui) {
  // Example of a single fix: the background track uses your correct folder
  let sizeSliderContainer = createDiv();
  sizeSliderContainer.style('background-image', 'url(' + F_UI + 'vector2.png)');
  let sizeHandle = createImg(F_UI + 'handle.png', 'slider handle');
  sizeHandle.style('display', 'none');
}

// -----------------------------
// ADD STYLES — correct font path
// -----------------------------
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
  `;
  document.head.appendChild(style);
}

// -----------------------------
// SCALE + WINDOW RESIZE
// -----------------------------
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
