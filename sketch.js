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

// ---------- Setup / UI scaffolding ----------
let scaleRatio = 0.5;
let canvasW, canvasH;

function setup() {
const main = createDiv().id('mainContainer');
main.parent('app');
main.style('width','100%');
main.style('display','flex');
main.style('flex-direction','column');
main.style('align-items','center');

// CHANGED: Create editor FIRST (appears at top)
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

// CHANGED: Create wall container SECOND (appears at bottom)
wallContainer = createDiv().id('wallContainer');
wallContainer.parent(main);
wallContainer.style('width','100%');
wallContainer.style('max-width','1200px');
wallContainer.style('padding','10px');
wallContainer.style('background-color','#f5f5f5');
wallContainer.style('margin-top','20px');  // CHANGED: margin-top instead of margin-bottom
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

// CHANGED: Send fixed height to Wix
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

const illuH  = 700 * illustrationScale;
const illuImg= illustrationImgs[illustrationCategory][styleIdx.illuIdx];
const illuW  = illuImg.width * (illuH / illuImg.height);
image(illuImg, illustrationX, posterHeight - illuH - illuPos.bottomOffset + illustrationY, illuW + 200, illuH + 200);

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
if (!inputText || inputText.length === 0) return ['Type your text here'];
let lines = [], currentPos = 0;
while (currentPos < inputText.length) {
let endPos = Math.min(currentPos + charsPerLine, inputText.length);
if (endPos < inputText.length && inputText[endPos] !== ' ') {
  let lastSpace = inputText.lastIndexOf(' ', endPos);
  if (lastSpace > currentPos) endPos = lastSpace + 1;
}
lines.push(inputText.substring(currentPos, endPos).trim());
currentPos = endPos;
}
return lines;
}
function updateWrappedText() {
const cpl = getCharsPerLine();
wrappedHashtagText = createCharacterLimitedText(hashtagText, cpl);
const def = 'share your ideas and Feature the voices Here';
wrappedMainText = createCharacterLimitedText((mainText && mainText.length>0)? mainText : def, cpl);
}
function wouldExceedLineLimit(currentText, newChar) {
const cpl = getCharsPerLine();
const lines = createCharacterLimitedText(currentText + newChar, cpl);
return lines.length > getMaxLines();
}

// ---------- Saved posters wall ----------
function loadSavedPosters() {
const s = localStorage.getItem('rgfSavedPosters');
if (!s) return;
try {
savedPosters = JSON.parse(s);
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

// ---------- UI ----------
function createUI(ui) {
function createLabel(text, parent) {
const label = createDiv(text);
label.parent(parent);
label.addClass('label');
label.style('margin-bottom','8px');
label.style('font-weight','bold');
if (fontsLoaded) label.style('font-family','"RGF Sans", sans-serif');
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
});

createLabel('Style:', posterSection);
const layoutSelector = createSelect().id('layoutSelector');
layoutSelector.option('Layout 1',1);
layoutSelector.option('Layout 2',2);
layoutSelector.parent(posterSection);
layoutSelector.style('width','100%'); layoutSelector.style('padding','10px');
layoutSelector.style('margin-bottom','15px'); layoutSelector.style('font-size','16px');
layoutSelector.changed(()=>{
if (layoutSelector.value()==2 && (posterSize!=='Story' && posterSize!=='Post')) {
  layoutSelector.value(1); layout = 1;
} else {
  layout = int(layoutSelector.value());
}
updateWrappedText(); updateLineLimitDisplay(); validateTextLength();
});

const colorSection = createSection();
createLabel('Colour:', colorSection);
const colorContainer = createDiv();
colorContainer.parent(colorSection);
colorContainer.style('display','flex'); colorContainer.style('flex-wrap','wrap');
colorContainer.style('justify-content','center'); colorContainer.style('margin-bottom','15px');

Object.keys(colors).forEach(col=>{
const wrap = createDiv().addClass('color-button-container'); wrap.parent(colorContainer);
const btn = createButton('').addClass('color-button'); btn.style('background-color', col); btn.parent(wrap);
btn.mousePressed(()=>{ bgColor = col; updateSelectedColorIndicator(); });
const ind = createImg(F_UI + 'selected01.png','selected').addClass('selected-indicator'); ind.parent(wrap);
colorButtons[col] = wrap;
});
updateSelectedColorIndicator();

const illuSection = createSection();
createLabel('Illustration:', illuSection);
const illuSelector = createSelect(); categories.forEach(n=>illuSelector.option(n));
illuSelector.parent(illuSection);
illuSelector.style('width','100%'); illuSelector.style('padding','10px');
illuSelector.style('margin-bottom','15px'); illuSelector.style('font-size','16px');
illuSelector.changed(()=> illustrationCategory = illuSelector.value());

createLabel('Scale:', illuSection);
const sizeSliderContainer = createDiv().id('sizeSliderContainer');
sizeSliderContainer.parent(illuSection);
sizeSliderContainer.style('position','relative'); sizeSliderContainer.style('width','100%'); sizeSliderContainer.style('height','30px');
sizeSliderContainer.style('margin-bottom','15px');
sizeSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
sizeSliderContainer.style('background-repeat','repeat-x'); sizeSliderContainer.style('background-position','center');

const sizeSlider = createSlider(0.5,2,1,0.01);
sizeSlider.parent(sizeSliderContainer);
sizeSlider.style('width','100%'); sizeSlider.style('height','30px'); sizeSlider.style('opacity','0'); sizeSlider.style('z-index','2');

const sizeHandle = createImg(F_UI + 'handle.png','slider handle'); sizeHandle.parent(sizeSliderContainer);
sizeHandle.style('position','absolute'); sizeHandle.style('height','30px'); sizeHandle.style('width','auto');
sizeHandle.style('top','0'); sizeHandle.style('left','50%'); sizeHandle.style('transform','translateX(-50%)'); sizeHandle.style('pointer-events','none');

sizeSlider.input(()=>{
illustrationScale = sizeSlider.value();
const percent = (sizeSlider.value() - 0.5) / 1.5;
sizeHandle.style('left', (percent*100) + '%');
});

createLabel('Position X:', illuSection);
const illuSliderContainer = createDiv().id('illuSliderContainer');
illuSliderContainer.parent(illuSection);
illuSliderContainer.style('position','relative'); illuSliderContainer.style('width','100%'); illuSliderContainer.style('height','30px');
illuSliderContainer.style('margin-bottom','15px');
illuSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
illuSliderContainer.style('background-repeat','repeat-x'); illuSliderContainer.style('background-position','center');

const illuSlider = createSlider(-2160,2160, illustrationX/scaleRatio);
illuSlider.parent(illuSliderContainer);
illuSlider.style('width','100%'); illuSlider.style('height','30px'); illuSlider.style('opacity','0'); illuSlider.style('z-index','2');

const illuHandle = createImg(F_UI + 'handle.png','slider handle'); illuHandle.parent(illuSliderContainer);
illuHandle.style('position','absolute'); illuHandle.style('height','30px'); illuHandle.style('width','auto');
illuHandle.style('top','0'); illuHandle.style('left','50%'); illuHandle.style('transform','translateX(-50%)'); illuHandle.style('pointer-events','none');

illuSlider.input(()=>{
illustrationX = illuSlider.value()*scaleRatio;
const percent = (illuSlider.value()+2160)/4320;
illuHandle.style('left', (percent*100)+'%');
});

createLabel('Position Y:', illuSection);
const illuYSliderContainer = createDiv().id('illuYSliderContainer');
illuYSliderContainer.parent(illuSection);
illuYSliderContainer.style('position','relative'); illuYSliderContainer.style('width','100%'); illuYSliderContainer.style('height','30px');
illuYSliderContainer.style('margin-bottom','15px');
illuYSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
illuYSliderContainer.style('background-repeat','repeat-x'); illuYSliderContainer.style('background-position','center');

const illuYSlider = createSlider(-1080,1080, illustrationY/scaleRatio);
illuYSlider.parent(illuYSliderContainer);
illuYSlider.style('width','100%'); illuYSlider.style('height','30px'); illuYSlider.style('opacity','0'); illuYSlider.style('z-index','2');

const illuYHandle = createImg(F_UI + 'handle.png','slider handle'); illuYHandle.parent(illuYSliderContainer);
illuYHandle.style('position','absolute'); illuYHandle.style('height','30px'); illuYHandle.style('width','auto');
illuYHandle.style('top','0'); illuYHandle.style('left','50%'); illuYHandle.style('transform','translateX(-50%)'); illuYHandle.style('pointer-events','none');

illuYSlider.input(()=>{
illustrationY = illuYSlider.value()*scaleRatio;
const percent = (illuYSlider.value()+1080)/2160;
illuYHandle.style('left', (percent*100)+'%');
});

const textSection = createSection();
const lineLabel = createLabel(`Main Text (${getMaxLines()} lines max):`, textSection);
lineLabel.id('lineLimit');

mainTextArea = createElement('textarea');
mainTextArea.parent(textSection);
mainTextArea.style('width','95%'); mainTextArea.style('height','90px'); mainTextArea.style('padding','10px');
mainTextArea.style('border','1px solid #ccc'); mainTextArea.style('border-radius','4px'); mainTextArea.style('font-size','16px');
mainTextArea.style('margin-bottom','10px'); mainTextArea.style('resize','vertical');

mainTextArea.elt.addEventListener('keydown',(e)=>{
if (['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key) || e.ctrlKey || e.metaKey) return true;
if (wouldExceedLineLimit(mainTextArea.value(), e.key)) { e.preventDefault(); return false; }
});
mainTextArea.input(()=>validateTextLength(mainTextArea.value()));

const exportSection = createSection();
const saveBtn = createButton('Save Poster');
saveBtn.parent(exportSection);
saveBtn.style('width','100%'); saveBtn.style('background-color','#2737A2'); saveBtn.style('color','white');
saveBtn.style('padding','15px'); saveBtn.style('border','none'); saveBtn.style('border-radius','4px');
saveBtn.style('cursor','pointer'); saveBtn.style('font-size','18px'); saveBtn.style('font-weight','bold');
if (fontsLoaded) saveBtn.style('font-family','"RGF Sans", sans-serif');
saveBtn.mouseOver(()=> saveBtn.style('background-color','#F8ADD2'));
saveBtn.mouseOut ( ()=> saveBtn.style('background-color','#2737A2'));
saveBtn.mousePressed(()=>{
const filename = `social_post_${posterSize}_${layout}`;
saveCanvas(filename, 'jpg');
const dataUrl = canvas.elt.toDataURL('image/jpeg');
const posterData = { dataUrl, posterSize, layout, timestamp: Date.now() };
savedPosters.push(posterData);
if (savedPosters.length>20) savedPosters.shift();
localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));
displayPosterInWall(posterData, true);
document.getElementById('wallContainer').scrollIntoView({behavior:'smooth', block:'start'});
});

const clearBtn = createButton('Clear All Saved Posters');
clearBtn.parent(exportSection);
clearBtn.style('width','100%'); clearBtn.style('background-color','#db48ff'); clearBtn.style('color','white');
clearBtn.style('padding','10px'); clearBtn.style('border','none'); clearBtn.style('border-radius','4px');
clearBtn.style('cursor','pointer'); clearBtn.style('font-size','16px'); clearBtn.style('margin-top','10px');
if (fontsLoaded) clearBtn.style('font-family','"RGF Sans", sans-serif');
clearBtn.mouseOver(()=> clearBtn.style('background-color','#A4E5D8'));
clearBtn.mouseOut ( ()=> clearBtn.style('background-color','#db48ff'));
clearBtn.mousePressed(()=>{
savedPosters = [];
localStorage.removeItem('rgfSavedPosters');
const grid = select('#posterGrid');
if (grid) { while (grid.elt.firstChild) grid.elt.removeChild(grid.elt.firstChild); }
});
}

function updateLayoutOptions() {
const layoutSelector = select('#layoutSelector'); if (!layoutSelector) return;
const options = layoutSelector.elt.options;
for (let i=0;i<options.length;i++) {
if (options[i].value==='2') {
  options[i].disabled = !(['Story','Post'].includes(posterSize));
}
}
}
function validateTextLength(currentText = mainTextArea.value()) {
const maxLines = getMaxLines();
const cpl = getCharsPerLine();
const lines = createCharacterLimitedText(currentText, cpl);
if (lines.length > maxLines) {
let s=''; for (let i=0;i<maxLines;i++) s += lines[i] + (i<maxLines-1?' ':'');
mainTextArea.value(s);
mainText = s;
} else {
mainText = currentText;
}
updateWrappedText();
}

function calculateScaleRatio() {
let availableWidth  = windowWidth - 450;
if (windowWidth <= 1200) availableWidth = windowWidth - 100;
const availableHeight = windowHeight - 150;

const posterWidth  = posterSizes[posterSize].width;
const posterHeight = posterSizes[posterSize].height;

const widthRatio  = availableWidth  / posterWidth;
const heightRatio = availableHeight / posterHeight;

scaleRatio = Math.min(widthRatio, heightRatio, 0.5);
scaleRatio = Math.max(scaleRatio, 0.15);
}
function updateCanvasSize() {
canvasW = posterSizes[posterSize].width  * scaleRatio;
canvasH = posterSizes[posterSize].height * scaleRatio;
if (typeof resizeCanvas === 'function') resizeCanvas(canvasW, canvasH);
adjustContainerForPosterSize();
}
function windowResized() { calculateScaleRatio(); updateCanvasSize(); }
function adjustContainerForPosterSize() {
const editor = select('#editorContainer'); if (!editor) return;
if (posterSize==='Landscape') editor.addClass('landscape-mode'); else editor.removeClass('landscape-mode');
}
function applyRGFFontToHeaders() {
if (!fontsLoaded) return;
const heads = selectAll('h1, h2, h3, h4, h5, h6'); for (const h of heads) h.addClass('rgf-font');
const labels= selectAll('.label'); for (const l of labels) l.addClass('rgf-font');
}
function updateSelectedColorIndicator() {
for (const col in colorButtons) colorButtons[col].removeClass('selected');
if (colorButtons[bgColor]) colorButtons[bgColor].addClass('selected');
}
function updateLineLimitDisplay() {
const lineLabel = select('#lineLimit');
if (lineLabel) lineLabel.html(`Main Text (${getMaxLines()} lines max):`);
}
function initializeSliderPositions() {
setTimeout(()=>{
const sizePercent = (1-0.5)/1.5;
const sImg = select('#sizeSliderContainer img'); if (sImg) sImg.style('left', (sizePercent*100)+'%');
const xPercent = (illustrationX/scaleRatio + 2160)/4320;
const xImg = select('#illuSliderContainer img'); if (xImg) xImg.style('left', (xPercent*100)+'%');
const yPercent = (illustrationY/scaleRatio + 1080)/2160;
const yImg = select('#illuYSliderContainer img'); if (yImg) yImg.style('left', (yPercent*100)+'%');
},100);
}
function setupEventListeners() {
const sizeSelector = select('#posterSizeSelector');
if (sizeSelector) {
sizeSelector.changed(()=>{
  posterSize = sizeSelector.value();
  calculateScaleRatio(); updateCanvasSize();
  updateLineLimitDisplay(); updateWrappedText(); validateTextLength();
});
}
window.addEventListener('resize', windowResized);
}
function addStyles() {
const style = document.createElement('style');
style.textContent = `
@font-face {
font-family: 'RGF Sans';
src: url('assets/Fonts/200525_RGF_Sans.otf') format('opentype');
}
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
canvas { max-width:100%; height:auto !important; object-fit:contain; }
#editorContainer.landscape-mode { max-width:1600px; }
select option:disabled { color:#999; font-style:italic; }

/* Custom scrollbar for poster wall */
#wallContainer::-webkit-scrollbar { width: 10px; }
#wallContainer::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 5px; }
#wallContainer::-webkit-scrollbar-thumb { background: #2737A2; border-radius: 5px; }
#wallContainer::-webkit-scrollbar-thumb:hover { background: #db48ff; }

@media (max-width:1200px){
#editorContainer{ flex-direction:column; align-items:center; padding-bottom: 60px; }
#uiPanel{ width:100%; max-width:600px; margin-bottom:15px; position:static; }
}
@media (max-width:768px){
#posterGrid{ grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); }
}
`;
document.head.appendChild(style);
}
function enforceLayoutRestrictions() {
if (layout===3) layout=1;
if (layout===2 && !(posterSize==='Story'||posterSize==='Post')) layout=1;
const layoutSelector = select('#layoutSelector'); if (layoutSelector) layoutSelector.value(layout);
}

// Fixed height calculator for Wix embed
function _dwGetDesiredHeight(pad = 0) {
const editor = document.getElementById('editorContainer');

if (!editor) {
return 1700 + pad; // Default fallback
}

// Fixed height: editor (~900px) + wall (800px) + padding
const FIXED_HEIGHT = 1700;
return FIXED_HEIGHT + pad;
}

// ---------- EMBED RESIZE COMMUNICATION ----------
let __dw_resizeTO;

function _dwPostHeight(pad = 0) {
if (window.parent === window) return;
const h = _dwGetDesiredHeight(pad);
window.parent.postMessage({ type: 'DW_HEIGHT', height: h }, '*');
}

function _dwPostHeightDebounced(pad = 0) {
clearTimeout(__dw_resizeTO);
__dw_resizeTO = setTimeout(() => _dwPostHeight(pad), 60);
}

// Send initial height on load
window.addEventListener('load', () => {
_dwPostHeight(30);
});
