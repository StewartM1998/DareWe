// -------------------------------------------------------------
// DARE WE GENERATOR — optimized for iOS stability
// Steps implemented: 1) pixelDensity/frameRate  2) downscaled illustration loading  3) capped canvas size
// -------------------------------------------------------------

let bgColor = '#400d60';
let layout = 1;
let posterSize = 'Story';
let hashtagText = '# dare we';
let mainText = '';
let illustrationX = 4;
let illustrationY = 0;
let illustrationScale = 1;
let illustrationCategory = 'HandA';

let logos = [];
let logosRight, logosRight2;
let currentIllu = null; // single illustration (lazy-loaded)
let rgfFont, helveticaFont;
let canvas;
let fontsLoaded = false;

const F_UI   = 'assets/UI/';
const F_FONTS= 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

// -------------------------------------------------------------
// 1. PRELOAD — only essential UI + fonts (no big illustration arrays)
// -------------------------------------------------------------
function preload() {
  selectedIndicator = loadImage(F_UI + 'selected01.png');

  for (let i=0; i<6; i++) logos[i] = loadImage(F_UI + `logo-new${i}.png`);
  logosRight  = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  rgfFont = loadFont(F_FONTS + 'RGFDare-Regular.otf', ()=>fontsLoaded=true, ()=>fontsLoaded=true);

  // optional — you can delete HelveticaNeueLTPro-Roman.ttf if unused
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// -------------------------------------------------------------
// 2. LOAD ONLY THE CURRENT ILLUSTRATION (downscaled if large)
// -------------------------------------------------------------
const ILLUS_MAX_HEIGHT = 1024;

function loadCurrentIllustration() {
  const colors = {
    '#400d60': {illuIdx:4}, '#db48ff':{illuIdx:3}, '#f8add2':{illuIdx:5},
    '#a4e5d8':{illuIdx:1}, '#2737a2':{illuIdx:3}
  };
  const styleIdx = colors[bgColor]?.illuIdx ?? 0;
  const url = `${F_ILLU}${illustrationCategory}/${illustrationCategory}${styleIdx}.png`;

  loadImage(url, (img)=>{
    if (img.height > ILLUS_MAX_HEIGHT) {
      const s = ILLUS_MAX_HEIGHT / img.height;
      img.resize(Math.round(img.width*s), ILLUS_MAX_HEIGHT);
    }
    currentIllu = img;
  }, (err)=>console.error('Failed to load illustration', err));
}

// -------------------------------------------------------------
// 3. SETUP — pixelDensity(1), frameRate(30), cap canvas size
// -------------------------------------------------------------
function setup() {
  pixelDensity(1);     // disables Retina scaling (massive iOS win)
  frameRate(30);       // gentle on CPU/GPU

  const posterSizes = {
    'Story':{width:1080,height:1920}, 
    'Post':{width:1080,height:1350},
    'Square':{width:1080,height:1080}, 
    'Landscape':{width:1920,height:1080}
  };

  // Calculate scaled + capped dimensions
  const base = posterSizes[posterSize];
  const scaleRatio = Math.min((windowWidth-100)/base.width, (windowHeight-150)/base.height, 0.5);
  const MAX_CANVAS_W = 1080, MAX_CANVAS_H = 1920;
  const canvasW = Math.min(base.width * scaleRatio, MAX_CANVAS_W);
  const canvasH = Math.min(base.height * scaleRatio, MAX_CANVAS_H);

  canvas = createCanvas(canvasW, canvasH);
  canvas.parent('app');

  textFont(rgfFont);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  // Load the one illustration we actually need
  loadCurrentIllustration();
}

// -------------------------------------------------------------
// DRAW — simplified to show where illustration is used
// -------------------------------------------------------------
function draw() {
  background(bgColor);

  // Example placement
  if (currentIllu) {
    const illuH = 700 * illustrationScale;
    const illuW = currentIllu.width * (illuH / currentIllu.height);
    image(currentIllu, illustrationX, height - illuH - 200 + illustrationY, illuW + 200, illuH + 200);
  }

  // Sample footer text
  fill(255);
  textSize(40);
  text('Reykjavik Global Forum 2025', 40, height - 80);
}
