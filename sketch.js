// -------------------------------------------------------------
// DARE WE GENERATOR — mobile-stable version (steps 1–3 applied)
// -------------------------------------------------------------

// ---------- Global state ----------
let bgColor = '#400d60';
let layout = 1;
let posterSize = 'Story';
let hashtagText = '# dare we';
let mainText = '';
let illustrationX = 4;
let illustrationY = 0;
let illustrationScale = 1;
let illustrationCategory = 'HandA';
let illustrationIndex = 0;

let logos = [];
let logosRight, logosRight2;
// let illustrationImgs = {};   // <<< REMOVED: no bulk preload
let currentIllu = null;         // <<< CHANGED: single, lazily-loaded image
let selectedIndicator;
let savedPosters = [];
let wallContainer;
let canvas;
let rgfFont, helveticaFont;
let mainTextArea;
let fontsLoaded = false;
let colorButtons = {};

const F_UI   = 'assets/UI/';
const F_FONTS= 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

const categories = ["Cake", "Eye", "FlowerA", "FlowerB", "FlowerC", "HandA", "HandB", "HandC", "Lip", "Question"];

// ---------- Preset responses for dropdown ----------
const presetResponses = {
  all: [
    "Power, together",
    "Attain & retain power",
    "Lead in the workplace",
    "Do it for the women who could not",
    "Empower the next generation",
    "Speak loud and proud",
    "Turn ideas into action",
    "Build an equal world",
    "Demand equal pay",
    "Fight for equal parental leave",
    "End gender based violence",
  ],
  squareAndLandscape: [
    "Demand equal representation",
  ],
  landscapeOnly: [
    "Create communities that drive change",
    "Believe in the power of collective action",
    "Inspire others and help each other grow",
    "Empower women to attain & retain power",
    "Turn ideas into actionable plans for change",
  ]
};

// ---------- Character limits ----------
const charsPerLineConfig = {'Story': 9, 'Post': 9, 'Square': 9, 'Landscape': 24};
function getCharsPerLine() { return charsPerLineConfig[posterSize] || 10; }

// ---------- Positions ----------
const headerPositions = {
  1: {'Story':{leftX:40,rightX:80,y:150},'Post':{leftX:40,rightX:40,y:40},'Square':{leftX:40,rightX:40,y:40},'Landscape':{leftX:40,rightX:40,y:40}},
  2: {'Story':{leftX:40,rightX:40,y:150},'Post':{leftX:40,rightX:40,y:40},'Square':{leftX:40,rightX:40,y:40},'Landscape':{leftX:40,rightX:40,y:40}}
};
const footerPositions = {
  1: {'Story':{leftX:40,centerY:40,rightX:40,y:40},'Post':{leftX:40,centerY:35,rightX:40,y:40},'Square':{leftX:40,centerY:35,rightX:40,y:40},'Landscape':{leftX:40,centerY:35,rightX:40,y:40}},
  2: {'Story':{leftX:40,centerY:40,rightX:140,y:40},'Post':{leftX:40,centerY:40,rightX:40,y:40},'Square':{leftX:40,centerY:35,rightX:40,y:40},'Landscape':{leftX:40,centerY:35,rightX:40,y:40}}
};
const textPositions = {
  1:{'Story':{hashtagX:40,hashtagY:360,mainTextX:417,mainTextY:480,leading:115},
     'Post':{hashtagX:40,hashtagY:280,mainTextX:417,mainTextY:400,leading:115},
     'Square':{hashtagX:40,hashtagY:240,mainTextX:417,mainTextY:360,leading:115},
     'Landscape':{hashtagX:40,hashtagY:340,mainTextX:420,mainTextY:450,leading:115}},
  2:{'Story':{titleX:1040,titleY:365,hashtagX:40,hashtagY:1040,mainTextX:386,mainTextY:1165,leading:115},
     'Post':{titleX:1040,titleY:270,hashtagX:40,hashtagY:688,mainTextX:420,mainTextY:800,leading:115},
     'Square':{titleX:1040,titleY:240,hashtagX:40,hashtagY:500,mainTextX:330,mainTextY:620,leading:115},
     'Landscape':{titleX:1880,titleY:240,hashtagX:40,hashtagY:600,mainTextX:330,mainTextY:720,leading:115}}
};
const illustrationPositions = {
  1:{'Story':{bottomOffset:350},'Post':{bottomOffset:200},'Square':{bottomOffset:150},'Landscape':{bottomOffset:200}},
  2:{'Story':{bottomOffset:750},'Post':{bottomOffset:400},'Square':{bottomOffset:300},'Landscape':{bottomOffset:400}}
};
const lineLimits = {
  1:{'Story':10,'Post':6,'Square':4,'Landscape':4},
  2:{'Story':5,'Post':4,'Square':4,'Landscape':4}
};
function getMaxLines(){ return lineLimits[layout][posterSize] || 4; }

// ---------- Poster dimensions ----------
const posterSizes = {
  'Story':{width:1080,height:1920}, 'Post':{width:1080,height:1350},
  'Square':{width:1080,height:1080}, 'Landscape':{width:1920,height:1080}
};

// ---------- Colors ----------
let colors = {
  '#400d60':{logoIdx:3,illuIdx:4}, '#db48ff':{logoIdx:0,illuIdx:3},
  '#f8add2':{logoIdx:0,illuIdx:5}, '#a4e5d8':{logoIdx:1,illuIdx:1},
  '#2737a2':{logoIdx:1,illuIdx:3}
};
let colorPalette = {
  '#400d60':{logo:'#f8add2',block1:'#db48ff',block2:'#f8add2',block3:'#db48ff',readMore:'#a4e5d8',illu:'#a4e5d8',footer:'#f8add2'},
  '#db48ff':{logo:'#2737a2',block1:'#2737a2',block2:'#a4e5d8',block3:'#2737a2',readMore:'#b11bab',illu:'#f8add2',footer:'#a4e5d8'},
  '#f8add2':{logo:'#2737a2',block1:'#43273a',block2:'#db48ff',block3:'#43273a',readMore:'#db48ff',illu:'#400d60',footer:'#2737a2'},
  '#a4e5d8':{logo:'#db48ff',block1:'#2737a2',block2:'#db48ff',block3:'#2737a2',readMore:'#db48ff',illu:'#db48ff',footer:'#db48ff'},
  '#2737a2':{logo:'#db48ff',block1:'#db48ff',block2:'#a4e5d8',block3:'#db48ff',readMore:'#a4e5d8',illu:'#f8add2',footer:'#db48ff'}
};

// ---------- Wrapped text ----------
let wrappedHashtagText = [];
let wrappedMainText = [];

// ---------- Helpers for lazy illustration loading ----------
function getStyleIdx(){ return colors[bgColor]?.illuIdx ?? 0; }

// Step 1: downscale big illustrations once after load
const ILLUS_MAX_HEIGHT = 1024; // adjust if you want more detail

function loadCurrentIllustration(){
  const idx = getStyleIdx();
  const url = `${F_ILLU}${illustrationCategory}/${illustrationCategory}${idx}.png`;
  loadImage(url, (img)=>{
    if (img && img.height > ILLUS_MAX_HEIGHT){
      const s = ILLUS_MAX_HEIGHT / img.height;
      img.resize(Math.round(img.width * s), ILLUS_MAX_HEIGHT);
    }
    currentIllu = img;
    redraw(); // if we're using noLoop later
  }, (err)=> console.error('Failed to load illustration:', err));
}

// ---------- Preload ----------
function preload() {
  selectedIndicator = loadImage(F_UI + 'selected01.png');

  // Keep only the logos you actually use
  for (let i=0;i<6;i++) logos[i] = loadImage(F_UI + `logo-new${i}.png`);
  logosRight  = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  // Fonts
  rgfFont = loadFont(F_FONTS + 'RGFDare-Regular.otf', ()=>{ 
    fontsLoaded=true; 
    console.log('RGFDare font loaded'); 
  }, (err)=>{ 
    console.error('Error loading RGFDare font:', err); 
    fontsLoaded=true; // Continue anyway
  });

  // (Optional) loaded but not applied anywhere; safe to remove file if you want
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf', ()=>{}, ()=>{});
}

// ---------- Setup / UI scaffolding ----------
let scaleRatio = 0.5;
let canvasW, canvasH;

// Step 2: control canvas memory on iOS
function setup() {
  pixelDensity(1);     // <<< CHANGED (critical on iOS)
  frameRate(30);       // <<< CHANGED (gentler)

  const main = createDiv().id('mainContainer');
  main.parent('app');
  main.style('width','100%');
  main.style('display','flex');
  main.style('flex-direction','column');
  main.style('align-items','center');

  // Create editor FIRST (appears at top)
  const editor = createDiv().id('editorContainer');
  editor.parent(main);
  editor.style('width','100%');
  editor.style('max-width','1200px');
  editor.style('display','flex');
  editor.style('flex-direction','row');
  editor.style('margin-bottom','20px');
  editor.style('gap','20px');

  const ui = createDiv().id('uiPanel');
  ui.parent(editor);
  ui.style('width','350px');
  ui.style('min-width','350px');
  ui.style('background','#ffffff');
  ui.style('padding','15px');
  ui.style('box-shadow','0 2px 10px rgba(0,0,0,0.1)');
  ui.style('border-radius','8px');
  ui.style('overflow-y','auto');
  ui.style('position','sticky');
  ui.style('top','15px');
  ui.style('align-self','flex-start');

  const title = createElement('h1','Dare We generator');
  title.parent(ui);
  title.style('margin-top','0');
  title.style('margin-bottom','20px');
  title.style('color','#333');

  const cc = createDiv().id('canvasContainer');
  cc.parent(editor);
  cc.style('flex-grow','1');
  cc.style('background-color','#ffffff');
  cc.style('padding','10px');
  cc.style('border-radius','8px');
  cc.style('box-shadow','0 2px 10px rgba(0,0,0,0.1)');
  cc.style('display','flex');
  cc.style('justify-content','center');
  cc.style('align-items','center');
  cc.style('min-width','0');

  // Create wall container SECOND (appears at bottom)
  wallContainer = createDiv().id('wallContainer');
  wallContainer.parent(main);
  wallContainer.style('width','100%');
  wallContainer.style('max-width','1200px');
  wallContainer.style('padding','10px');
  wallContainer.style('background-color','#f5f5f5');
  wallContainer.style('margin-top','20px');
  wallContainer.style('display','flex');
  wallContainer.style('flex-direction','column');
  wallContainer.style('align-items','center');
  wallContainer.style('max-height','725px');
  wallContainer.style('overflow-y','auto');
  wallContainer.style('overflow-x','hidden');

  const posterGrid = createDiv().id('posterGrid');
  posterGrid.parent(wallContainer);
  posterGrid.style('display','grid');
  posterGrid.style('grid-template-columns','repeat(auto-fill, minmax(300px, 1fr))');
  posterGrid.style('grid-gap','20px');
  posterGrid.style('grid-auto-rows','auto');
  posterGrid.style('width','100%');
  posterGrid.style('padding','10px');

  calculateScaleRatio();
  updateCanvasSize();

  canvas = createCanvas(canvasW, canvasH);
  canvas.parent(cc);

  textFont(rgfFont);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  createUI(ui);
  updateWrappedText();
  addStyles();
  applyRGFFontToHeaders();
  updateSelectedColorIndicator();
  loadSavedPosters();
  setupEventListeners();
  adjustContainerForPosterSize();
  updateLineLimitDisplay();
  initializeSliderPositions();
  enforceLayoutRestrictions();
  updateLayoutOptions();

  // Load the first illustration lazily
  loadCurrentIllustration();   // <<< CHANGED

  // Send fixed height to Wix
  _dwPostHeightDebounced(30);
}

function draw() {
  scale(scaleRatio);
  background(bgColor);

  const posterWidth  = posterSizes[posterSize].width;
  const posterHeight = posterSizes[posterSize].height;

  const positions = textPositions[layout][posterSize];
  const headerPos = headerPositions[layout][posterSize];
  const footerPos = footerPositions[layout][posterSize];
  const illuPos   = illustrationPositions[layout][posterSize];

  const palette = colorPalette[bgColor];
  const styleIdx= colors[bgColor];

  blendMode(BLEND);
  noTint();
  image(logos[styleIdx.logoIdx], headerPos.leftX, headerPos.y, 130, 130);
  if (bgColor === '#400d60' || bgColor === '#2737a2') {
    image(logosRight2, posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
  } else {
    image(logosRight,  posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
  }

  // <<< CHANGED: draw only the single, downscaled illustration if loaded
  const illuH  = 700 * illustrationScale;
  const illuImg= currentIllu;
  if (illuImg){
    const illuW  = illuImg.width * (illuH / illuImg.height);
    image(illuImg, illustrationX, posterHeight - illuH - illuPos.bottomOffset + illustrationY, illuW + 200, illuH + 200);
  }

  textSize(35);
  fill(palette.footer);
  const footerLeftX  = footerPos.leftX;
  const footerRightX = posterWidth - footerPos.rightX;
  textAlign(LEFT);
  text('Reykjavik', footerLeftX,               posterHeight - footerPos.y - 35);
  textAlign(CENTER);
  text('Global forum', posterWidth/2,          posterHeight - footerPos.centerY - 35);
  textAlign(RIGHT);
  text('2025',        footerRightX,            posterHeight - footerPos.y - 35);
  textAlign(LEFT);

  const maxLines = getMaxLines();

  if (layout === 1) {
    textSize(110);
    textLeading(positions.leading);
    fill(palette.block2);
    text(hashtagText, positions.hashtagX, positions.hashtagY);
    fill(palette.block3);
    for (let i = 0; i < Math.min(wrappedMainText.length, maxLines); i++) {
      text(wrappedMainText[i], positions.mainTextX, positions.mainTextY + (i * positions.leading));
    }
  } else if (layout === 2) {
    textSize(110);
    textAlign(RIGHT);
    textLeading(positions.leading);
    fill(palette.block1);
    text("REYKJAVIK\nGLOBAL FORUM\n2025", positions.titleX, positions.titleY);
    textAlign(LEFT);
    fill(palette.block2);
    textSize(110);
    text(hashtagText, positions.hashtagX, positions.hashtagY);
    fill(palette.block3);
    for (let i = 0; i < Math.min(wrappedMainText.length, maxLines); i++) {
      text(wrappedMainText[i], positions.mainTextX, positions.mainTextY + i * positions.leading);
    }
  }
}

// ---------- Text wrapping helpers ----------
function createCharacterLimitedText(inputText, charsPerLine) {
  if (!inputText || inputText.length === 0) return [''];

  const words = inputText.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;

    if (testLine.length <= charsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        let remaining = word;
        while (remaining.length > charsPerLine) {
          lines.push(remaining.substring(0, charsPerLine));
          remaining = remaining.substring(charsPerLine);
        }
        currentLine = remaining;
      }
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [''];
}

function updateWrappedText() {
  const cpl = getCharsPerLine();
  wrappedHashtagText = createCharacterLimitedText(hashtagText, cpl);
  const def = 'share your ideas and feature the voices here';
  const textToWrap = (mainText && mainText.length > 0) ? mainText : def;
  wrappedMainText = createCharacterLimitedText(textToWrap, cpl);
}

// ---------- Saved posters wall ----------
function loadSavedPosters() {
  const s = localStorage.getItem('rgfSavedPosters');
  if (!s) return;
  try {
    savedPosters = JSON.parse(s).slice(-12);                           // <<< CHANGED: cap count
    localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));
    for (let i = savedPosters.length - 1; i >= 0; i--) {
      displayPosterInWall(savedPosters[i], true);
    }
  } catch (e) {
    console.error('Error loading saved posters:', e);
    localStorage.removeItem('rgfSavedPosters');
    savedPosters = [];
  }
}

function displayPosterInWall(posterData, addToTop=false) {
  const posterGrid = select('#posterGrid'); if (!posterGrid) return;
  const box = createDiv().addClass('poster-thumbnail');
  if (posterData.posterSize === 'Landscape') box.addClass('landscape');
  const img = createImg(posterData.dataUrl, 'Saved poster');
  img.style('width','100%'); img.style('height','auto'); img.style('display','block'); img.parent(box);
  box.mousePressed(()=>{
    const ix = savedPosters.findIndex(p=>p.dataUrl===posterData.dataUrl);
    if (ix!==-1){ savedPosters.splice(ix,1); localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters)); }
    box.remove();
  });
  if (addToTop && posterGrid.elt.firstChild) posterGrid.elt.insertBefore(box.elt, posterGrid.elt.firstChild);
  else box.parent(posterGrid);
}

// ---------- MOVED OUTSIDE: populateMainTextDropdown ----------
function populateMainTextDropdown() {
  const mainTextArea = select('#mainTextSelector');
  if (!mainTextArea) return;

  mainTextArea.elt.innerHTML = '';
  mainTextArea.option('Select a message...', '');

  presetResponses.all.forEach(response => mainTextArea.option(response, response));

  if (posterSize === 'Square' || posterSize === 'Landscape') {
    presetResponses.squareAndLandscape.forEach(response => mainTextArea.option(response, response));
  }
  if (posterSize === 'Landscape') {
    presetResponses.landscapeOnly.forEach(response => mainTextArea.option(response, response));
  }
}

// ---------- UI ----------
function createUI(ui) {
  function createLabel(text, parent) {
    const label = createDiv(text);
    label.parent(parent);
    label.addClass('label');
    label.style('margin-bottom','8px');
    label.style('font-weight','bold');
    if (fontsLoaded) label.style('font-family','"RGFDare", sans-serif');
    return label;
  }
  function createSection() {
    const section = createDiv();
    section.addClass('ui-section');
    section.parent(ui);
    return section;
  }

  const posterSection = createSection();
  createLabel('Size:', posterSection);
  const sizeSelector = createSelect().id('posterSizeSelector');
  sizeSelector.option('Story (1080×1920)','Story');
  sizeSelector.option('Post (1080×1350)','Post');
  sizeSelector.option('Square (1080×1080)','Square');
  sizeSelector.option('Landscape (1920×1080)','Landscape');
  sizeSelector.parent(posterSection);
  sizeSelector.style('width','100%'); sizeSelector.style('padding','10px');
  sizeSelector.style('margin-bottom','15px'); sizeSelector.style('font-size','16px');
  sizeSelector.changed(()=>{
    posterSize = sizeSelector.value();
    if ((posterSize==='Square'||posterSize==='Landscape') && layout===2) {
      layout = 1; const ls = select('#layoutSelector'); if (ls) ls.value(1);
    }
    updateLayoutOptions();
    calculateScaleRatio(); updateCanvasSize();
    updateLineLimitDisplay(); updateWrappedText(); validateTextLength();
    populateMainTextDropdown();
  });

  createLabel('Style:', posterSection);
  const layoutSelector = createSelect().id('layoutSelector');
  layoutSelector.option('Layout 1',1
