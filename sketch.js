// -------------------------------------------------------------
// DARE WE GENERATOR — GitHub Pages Edition
// -------------------------------------------------------------

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
let fontsLoaded = false;
let colorButtons = {};

const F_UI = 'assets/UI/';
const F_FONTS = 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

// -------------------------------------------------------------
// POSTER SIZES
// -------------------------------------------------------------
const posterSizes = {
  'Story': { width: 1080, height: 1920 },
  'Post': { width: 1080, height: 1350 },
  'Square': { width: 1080, height: 1080 },
  'Landscape': { width: 1920, height: 1080 }
};

// -------------------------------------------------------------
// PRELOAD — all asset paths corrected
// -------------------------------------------------------------
function preload() {
  selectedIndicator = loadImage(F_UI + 'selected01.png');

  // Load logos
  for (let i = 0; i < 6; i++) logos[i] = loadImage(F_UI + `logo-left${i}.png`);
  logosRight = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  // Illustrations
  const categories = ["Cake", "Eye", "FlowerA", "FlowerB", "FlowerC", "HandA", "HandB", "HandC", "Lip", "Question"];
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
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// -------------------------------------------------------------
// SETUP
// -------------------------------------------------------------
let scaleRatio = 0.5;
let canvasW, canvasH;

function setup() {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';

  calculateScaleRatio();
  updateCanvasSize();

  canvas = createCanvas(canvasW, canvasH);
  canvas.parent('app');

  textFont(rgfFont);
  textAlign(CENTER, CENTER);
  textSize(120);
}

// -------------------------------------------------------------
// DRAW
// -------------------------------------------------------------
function draw() {
  scale(scaleRatio);
  background(bgColor);

  // Header logos
  imageMode(CORNER);
  if (logos[0]) image(logos[0], 50, 50, 130, 130);
  if (logosRight2) image(logosRight2, width / scaleRatio - 180, 50, 130, 85);

  // Central illustration
  if (illustrationImgs[illustrationCategory]) {
    let illuImg = illustrationImgs[illustrationCategory][0];
    if (illuImg) {
      let illuH = 700 * illustrationScale;
      let illuW = illuImg.width * (illuH / illuImg.height);
      image(
        illuImg,
        illustrationX,
        (posterSizes[posterSize].height / 2) - illuH / 2 + illustrationY,
        illuW,
        illuH
      );
    }
  }

  // Text content
  fill(255);
  textAlign(CENTER, CENTER);
  text(hashtagText, width / (2 * scaleRatio), height / (2 * scaleRatio) - 200);
  textSize(80);
  text('share your ideas and feature voices here', width / (2 * scaleRatio), height / (2 * scaleRatio) + 100);
}

// -------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------
function calculateScaleRatio() {
  let posterWidth = posterSizes[posterSize].width;
  let posterHeight = posterSizes[posterSize].height;
  let widthRatio = windowWidth / posterWidth;
  let heightRatio = windowHeight / posterHeight;
  scaleRatio = Math.min(widthRatio, heightRatio, 0.5);
  scaleRatio = Math.max(scaleRatio, 0.25);
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
