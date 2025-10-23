// -------------------------------------------------------------
// DARE WE GENERATOR — Wix-optimized version with scrollable poster wall
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

const F_UI   = 'assets/UI/';
const F_FONTS= 'assets/Fonts/';
const F_ILLU = 'assets/Illustrations/';

const categories = ["Cake", "Eye", "FlowerA", "FlowerB", "FlowerC", "HandA", "HandB", "HandC", "Lip", "Question"];

// ---------- Character limits ----------
const charsPerLineConfig = {
  'Story': 10, 'Post': 10, 'Square': 10, 'Landscape': 16
};
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

// ---------- Preload ----------
function preload() {
  selectedIndicator = loadImage(F_UI + 'selected01.png');
  for (let i=0;i<6;i++) logos[i] = loadImage(F_UI + `logo-left${i}.png`);
  logosRight  = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  for (let cat of categories){
    illustrationImgs[cat] = [];
    for (let i=0;i<6;i++){
      illustrationImgs[cat][i] = loadImage(F_ILLU + `${cat}/${cat}${i}.png`);
    }
  }

  rgfFont = loadFont(F_FONTS + '200525_RGF_Sans.otf', ()=>{ fontsLoaded=true; console.log('RGF Sans font loaded'); });
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// ---------- Setup ----------
let scaleRatio = 0.5;
let canvasW, canvasH;

function setup() {
  const main = createDiv().id('mainContainer');
  main.parent('app');
  main.style('width','100%');
  main.style('display','flex');
  main.style('flex-direction','column');
  main.style('align-items','center');

  // Scrollable wall container
  wallContainer = createDiv().id('wallContainer');
  wallContainer.parent(main);
  wallContainer.style('width','100%');
  wallContainer.style('max-width','1200px');
  wallContainer.style('padding','10px');
  wallContainer.style('background-color','#f5f5f5');
  wallContainer.style('margin-bottom','5px');
  wallContainer.style('display','flex');
  wallContainer.style('flex-direction','column');
  wallContainer.style('align-items','center');
  wallContainer.style('max-height','800px');
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

  const editor = createDiv().id('editorContainer');
  editor.parent(main);
  editor.style('width','100%');
  editor.style('max-width','1200px');
  editor.style('display','flex');
  editor.style('flex-direction','row');
  editor.style('margin-bottom','5px');
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

  calculateScaleRatio();
  updateCanvasSize();

  canvas = createCanvas(canvasW, canvasH);
  canvas.parent(cc);

  textFont(rgfFont);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  createUI(ui);
  updateWrappedText();
  addStyles(); // includes padding fix
  applyRGFFontToHeaders();
  updateSelectedColorIndicator();
  loadSavedPosters();
  setupEventListeners();
  adjustContainerForPosterSize();
  updateLineLimitDisplay();
  initializeSliderPositions();
  enforceLayoutRestrictions();
  updateLayoutOptions();

  // 👇 Add bottom spacer to stop cutoff
  const spacer = createDiv().id('bottomSpacer');
  spacer.parent(main);
  spacer.style('height','140px');  // Increase if still tight
  spacer.style('width','100%');
  spacer.style('flex','0 0 auto');

  _dwPostHeightDebounced(30);
}

// ---------- Draw ----------
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

  const illuH  = 700 * illustrationScale;
  const illuImg= illustrationImgs[illustrationCategory][styleIdx.illuIdx];
  const illuW  = illuImg.width * (illuH / illuImg.height);
  image(illuImg, illustrationX, posterHeight - illuH - illuPos.bottomOffset + illustrationY, illuW + 200, illuH + 200);

  textSize(35);
  fill(palette.footer);
  const footerLeftX  = footerPos.leftX;
  const footerRightX = posterWidth - footerPos.rightX;
  textAlign(LEFT);
  text('Reykjavik', footerLeftX, posterHeight - footerPos.y - 35);
  textAlign(CENTER);
  text('Global forum', posterWidth/2, posterHeight - footerPos.centerY - 35);
  textAlign(RIGHT);
  text('2025', footerRightX, posterHeight - footerPos.y - 35);
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

// ---------- addStyles() ----------
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
  @font-face {
    font-family: 'RGF Sans';
    src: url('assets/Fonts/200525_RGF_Sans.otf') format('opentype');
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: auto; min-height: 100%; overflow-y: auto; }
  body { margin:0; padding:0; overflow-x:hidden; overflow-y:auto; background-color:#f5f5f5; }
  .rgf-font { font-family:'RGF Sans', sans-serif !important; }
  .color-button-container { position:relative; display:inline-block; margin:5px; }
  .color-button { width:40px; height:40px; border:none; border-radius:6px; cursor:pointer; }
  .selected-indicator { position:absolute; top:-10px; left:-10px; width:60px; height:60px; pointer-events:none; display:none; transform:scale(0.6); }
  .selected .selected-indicator { display:block; }
  .ui-section { margin-bottom:15px; }
  .poster-thumbnail { width:100%; cursor:pointer; }
  .poster-thumbnail img { width:100%; height:auto; display:block; }
  .poster-thumbnail.landscape { grid-column:1 / -1; }
  #posterGrid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); grid-gap:20px; grid-auto-rows:auto; width:100%; padding:20px; }
  #uiPanel { width:350px; min-width:350px; position:sticky; top:20px; align-self:flex-start; }
  #canvasContainer { display:flex; justify-content:center; align-items:center; min-width:0; }
  #editorContainer { display:flex; justify-content:center; align-items:center; min-width:0; padding-bottom:60px; }
  #editorContainer.landscape-mode { max-width:1600px; }
  canvas { max-width:100%; height:auto !important; object-fit:contain; }
  select option:disabled { color:#999; font-style:italic; }
  #wallContainer::-webkit-scrollbar { width:10px; }
  #wallContainer::-webkit-scrollbar-track { background:#f1f1f1; border-radius:5px; }
  #wallContainer::-webkit-scrollbar-thumb { background:#2737A2; border-radius:5px; }
  #wallContainer::-webkit-scrollbar-thumb:hover { background:#db48ff; }
  @media (max-width:1200px){
    #editorContainer{ flex-direction:column; align-items:center; padding-bottom:60px; }
    #uiPanel{ width:100%; max-width:600px; margin-bottom:15px; position:static; }
  }
  @media (max-width:768px){
    #posterGrid{ grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); }
  }
  `;
  document.head.appendChild(style);
}
