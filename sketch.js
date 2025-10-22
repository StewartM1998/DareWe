// -------------------------------------------------------------
// DARE WE GENERATOR — Full version (GitHub Pages + Wix EMBED)
// Folder names are case-sensitive:
//   assets/UI/   (handle.png, logo-left*.png, logo-right*.png, selected01.png, vector2.png)
//   assets/Fonts/ (200525_RGF_Sans.otf, HelveticaNeueLTPro-Roman.ttf [optional])
//   assets/Illustrations/<Category>/<Category>0..5.png
// -------------------------------------------------------------

// ===== EMBED SETTINGS =====
const EMBED_MODE     = true;   // true when running inside Wix/iframe
const SHOW_WALL      = false;  // hide the saved-posts wall in embed (set true to show)
const WALL_MAX_HEIGHT= 280;    // if showing wall, cap its height (px)

// ---------- Global state ----------
let bgColor = '#400d60';
let layout = 1;
let posterSize = 'Story'; // 'Story' | 'Post' | 'Square' | 'Landscape'
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

const F_UI    = 'assets/UI/';
const F_FONTS = 'assets/Fonts/';
const F_ILLU  = 'assets/Illustrations/';

const categories = ["Cake", "Eye", "FlowerA", "FlowerB", "FlowerC", "HandA", "HandB", "HandC", "Lip", "Question"];

// ---------- Character limits ----------
const charsPerLineConfig = {
  'Story': 10, 'Post': 10, 'Square': 10, 'Landscape': 16
};
function getCharsPerLine(){ return charsPerLineConfig[posterSize] || 10; }

// ---------- Positions ----------
const headerPositions = {
  1:{'Story':{leftX:40,rightX:80,y:150},'Post':{leftX:40,rightX:40,y:40},'Square':{leftX:40,rightX:40,y:40},'Landscape':{leftX:40,rightX:40,y:40}},
  2:{'Story':{leftX:40,rightX:40,y:150},'Post':{leftX:40,rightX:40,y:40},'Square':{leftX:40,rightX:40,y:40},'Landscape':{leftX:40,rightX:40,y:40}}
};
const footerPositions = {
  1:{'Story':{leftX:40,centerY:40,rightX:40,y:40},'Post':{leftX:40,centerY:35,rightX:40,y:40},'Square':{leftX:40,centerY:35,rightX:40,y:40},'Landscape':{leftX:40,centerY:35,rightX:40,y:40}},
  2:{'Story':{leftX:40,centerY:40,rightX:140,y:40},'Post':{leftX:40,centerY:40,rightX:40,y:40},'Square':{leftX:40,centerY:35,rightX:40,y:40},'Landscape':{leftX:40,centerY:35,rightX:40,y:40}}
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
function preload(){
  selectedIndicator = loadImage(F_UI + 'selected01.png');

  for (let i=0;i<6;i++) { logos[i] = loadImage(F_UI + `logo-left${i}.png`); }
  logosRight  = loadImage(F_UI + 'logo-right.png');
  logosRight2 = loadImage(F_UI + 'logo-right2.png');

  for (let cat of categories){
    illustrationImgs[cat] = [];
    for (let i=0;i<6;i++){
      illustrationImgs[cat][i] = loadImage(F_ILLU + `${cat}/${cat}${i}.png`);
    }
  }

  rgfFont = loadFont(F_FONTS + '200525_RGF_Sans.otf', ()=>{ fontsLoaded=true; console.log('RGF Sans font loaded'); });
  // optional secondary font (comment if not present)
  helveticaFont = loadFont(F_FONTS + 'HelveticaNeueLTPro-Roman.ttf');
}

// ---------- Setup / UI scaffolding ----------
let scaleRatio = 0.5;
let canvasW, canvasH;
let _resizeObserver;

function setup(){
  const main = createDiv().id('mainContainer');
  main.parent('app');
  main.style('width'
