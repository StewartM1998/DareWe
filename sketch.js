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

// Character limits per poster size
const charsPerLineConfig = {
'Story': 10,
'Post': 10,
'Square': 10,
'Landscape': 16
};

// Function to get current character limit per line
function getCharsPerLine() {
return charsPerLineConfig[posterSize] || 10;
}

// Header positions for each layout and poster size
const headerPositions = {
1: { // Layout 1
'Story': { leftX: 40, rightX: 80, y: 150 },
'Post': { leftX: 40, rightX: 40, y: 40 },
'Square': { leftX: 40, rightX: 40, y: 40 },
'Landscape': { leftX: 40, rightX: 40, y: 40 }
},
2: { // Layout 2
'Story': { leftX: 40, rightX: 40, y: 150 },
'Post': { leftX: 40, rightX: 40, y: 40 },
'Square': { leftX: 40, rightX: 40, y: 40 },
'Landscape': { leftX: 40, rightX: 40, y: 40 }
}
};

// Footer positions for each layout and poster size
const footerPositions = {
1: { // Layout 1
'Story': { leftX: 40, centerY: 40, rightX: 40, y: 40 },
'Post': { leftX: 40, centerY: 35, rightX: 40, y: 40 },
'Square': { leftX: 40, centerY: 35, rightX: 40, y: 40 },
'Landscape': { leftX: 40, centerY: 35, rightX: 40, y: 40 }
},
2: { // Layout 2
'Story': { leftX: 40, centerY: 40, rightX: 140, y: 40 },
'Post': { leftX: 40, centerY: 40, rightX: 40, y: 40 },
'Square': { leftX: 40, centerY: 35, rightX: 40, y: 40 },
'Landscape': { leftX: 40, centerY: 35, rightX: 40, y: 40 }
}
};

// Text positions for each layout and poster size
const textPositions = {
1: { // Layout 1
'Story': {
  hashtagX: 40,
  hashtagY: 360,
  mainTextX: 417,
  mainTextY: 480,
  leading: 115
},
'Post': {
  hashtagX: 40,
  hashtagY: 280,
  mainTextX: 417,
  mainTextY: 400,
  leading: 115
},
'Square': {
  hashtagX: 40,
  hashtagY: 240,
  mainTextX: 417,
  mainTextY: 360,
  leading: 115
},
'Landscape': {
  hashtagX: 40,
  hashtagY: 340,
  mainTextX: 420,
  mainTextY: 450,
  leading: 115
}
},
2: { // Layout 2
'Story': {
  titleX: 1040,
  titleY: 365,
  hashtagX: 40,
  hashtagY: 1040,
  mainTextX: 386,
  mainTextY: 1165,
  leading: 115
},
'Post': {
  titleX: 1040,
  titleY: 270,
  hashtagX: 40,
  hashtagY: 688,
  mainTextX: 420,
  mainTextY: 800,
  leading: 115
},
'Square': {
  titleX: 1040,
  titleY: 240,
  hashtagX: 40,
  hashtagY: 500,
  mainTextX: 330,
  mainTextY: 620,
  leading: 115
},
'Landscape': {
  titleX: 1880,
  titleY: 240,
  hashtagX: 40,
  hashtagY: 600,
  mainTextX: 330,
  mainTextY: 720,
  leading: 115
}
}
};

// Illustration positions for each layout and poster size
const illustrationPositions = {
1: { // Layout 1
'Story': { bottomOffset: 350 },
'Post': { bottomOffset: 200 },
'Square': { bottomOffset: 150 },
'Landscape': { bottomOffset: 200 }
},
2: { // Layout 2
'Story': { bottomOffset: 750 },
'Post': { bottomOffset: 400 },
'Square': { bottomOffset: 300 },
'Landscape': { bottomOffset: 400 }
}
};

// Line limits for each layout and poster size
const lineLimits = {
1: { // Layout 1
'Story': 10,
'Post': 6,
'Square': 4,
'Landscape': 4
},
2: { // Layout 2
'Story': 5,
'Post': 4,
'Square': 4,
'Landscape': 4
}
};

// Function to get current max lines based on layout and poster size
function getMaxLines() {
return lineLimits[layout][posterSize] || 4;
}

// Canvas scaling and dimensions
let scaleRatio = 0.5;
let canvasW, canvasH;

// Poster dimensions
const posterSizes = {
'Story': { width: 1080, height: 1920 },
'Post': { width: 1080, height: 1350 },
'Square': { width: 1080, height: 1080 },
'Landscape': { width: 1920, height: 1080 }
};

// Color configurations
let colors = {
'#400d60': { logoIdx: 3, illuIdx: 4 },
'#db48ff': { logoIdx: 0, illuIdx: 3 },
'#f8add2': { logoIdx: 0, illuIdx: 5 },
'#a4e5d8': { logoIdx: 1, illuIdx: 1 },
'#2737a2': { logoIdx: 1, illuIdx: 3 }
};

let colorPalette = {
'#400d60': {
logo: '#f8add2',
block1: '#db48ff',
block2: '#f8add2',
block3: '#db48ff',
readMore: '#a4e5d8',
illu: '#a4e5d8',
footer: '#f8add2'
},
'#db48ff': {
logo: '#2737a2',
block1: '#2737a2',
block2: '#a4e5d8',
block3: '#2737a2',
readMore: '#b11bab',
illu: '#f8add2',
footer: '#a4e5d8'
},
'#f8add2': {
logo: '#2737a2',
block1: '#43273a',
block2: '#db48ff',
block3: '#43273a',
readMore: '#db48ff',
illu: '#400d60',
footer: '#2737a2'
},
'#a4e5d8': {
logo: '#db48ff',
block1: '#2737a2',
block2: '#db48ff',
block3: '#2737a2',
readMore: '#db48ff',
illu: '#db48ff',
footer: '#db48ff'
},
'#2737a2': {
logo: '#db48ff',
block1: '#db48ff',
block2: '#a4e5d8',
block3: '#db48ff',
readMore: '#a4e5d8',
illu: '#f8add2',
footer: '#db48ff'
}
};

const categories = ["Cake", "Eye", "FlowerA", "FlowerB", "FlowerC", "HandA", "HandB", "HandC", "Lip", "Question"];

// Pre-calculated wrapped text for performance
let wrappedHashtagText = [];
let wrappedMainText = [];

function preload() {
// Load the selected indicator image
selectedIndicator = loadImage('selected01.png');

// Load logos
for (let i = 0; i < 6; i++) {
logos[i] = loadImage(`logo-left${i}.png`);
}
logosRight = loadImage('logo-right.png');
logosRight2 = loadImage('logo-right2.png');

// Load illustrations
for (let cat of categories) {
illustrationImgs[cat] = [];
for (let i = 0; i < 6; i++) {
  illustrationImgs[cat][i] = loadImage(`${cat}${i}.png`);
}
}

// Load fonts
rgfFont = loadFont('200525_RGF_Sans.otf', () => {
fontsLoaded = true;
console.log('RGF Sans font loaded');
});
helveticaFont = loadFont('HelveticaNeueLTPro-Roman.ttf');
}

function setup() {
// Configure body styling
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
//mainContainer.style('min-height', '100vh');
mainContainer.style('align-items', 'center');

// Create wall container for saved posters
wallContainer = createDiv();
wallContainer.id('wallContainer');
wallContainer.style('width', '100%');
wallContainer.style('max-width', '1200px');
wallContainer.style('padding', '10px');
wallContainer.style('background-color', '#f5f5f5');
wallContainer.style('margin-bottom', '5px');
//wallContainer.style('min-height', '70vh');
wallContainer.style('display', 'flex'); // Add flex display
wallContainer.style('flex-direction', 'column'); // Stack children vertically
wallContainer.style('align-items', 'center'); // Center children horizontally
wallContainer.parent(mainContainer);

// Create poster grid
let posterGrid = createDiv();
posterGrid.id('posterGrid');
posterGrid.style('display', 'grid');
posterGrid.style('grid-template-columns', 'repeat(auto-fill, minmax(300px, 1fr))');
posterGrid.style('grid-gap', '20px');
posterGrid.style('grid-auto-rows', 'auto');
posterGrid.style('width', '100%');
posterGrid.style('padding', '10px');
posterGrid.parent(wallContainer);

// Create editor container
let editorContainer = createDiv();
editorContainer.id('editorContainer');
editorContainer.style('width', '100%');
editorContainer.style('max-width', '1200px');
editorContainer.style('display', 'flex');
editorContainer.style('flex-direction', 'row');
editorContainer.style('margin-bottom', '5px');
editorContainer.style('gap', '20px');
editorContainer.parent(mainContainer);

// Create UI panel
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

// Create title for UI panel
let title = createElement('h1', 'Dare We generator');
title.parent(ui);
title.style('margin-top', '0');
title.style('margin-bottom', '20px');
title.style('color', '#333');
if (fontsLoaded) {
title.style('font-family', '"RGF Sans", sans-serif');
}

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

// Calculate initial scale ratio and canvas size
calculateScaleRatio();
updateCanvasSize();

// Create canvas
canvas = createCanvas(canvasW, canvasH);
canvas.parent(canvasContainer);

// Set up text properties
textFont(rgfFont);
textAlign(LEFT, TOP);
textWrap(WORD);

// Create UI elements
createUI(ui);

// Initialize wrapped text
updateWrappedText();

// Add CSS styles
addStyles();

// Apply RGF font to headers
applyRGFFontToHeaders();

// Update selected color indicator
updateSelectedColorIndicator();

// Load saved posters
loadSavedPosters();

// Add event listeners
setupEventListeners();

// Initial adjustments
adjustContainerForPosterSize();
updateLineLimitDisplay();
initializeSliderPositions();

// Enforce layout restrictions
enforceLayoutRestrictions();

// Update layout options based on poster size
updateLayoutOptions();
}

function draw() {
scale(scaleRatio);
background(bgColor);

let posterWidth = posterSizes[posterSize].width;
let posterHeight = posterSizes[posterSize].height;

// Get positions for current layout and poster size
let positions = textPositions[layout][posterSize];
let headerPos = headerPositions[layout][posterSize];
let footerPos = footerPositions[layout][posterSize];
let illuPos = illustrationPositions[layout][posterSize];

let palette = colorPalette[bgColor];
let styleIdx = colors[bgColor];

// Draw header logos
blendMode(BLEND);
noTint();
image(logos[styleIdx.logoIdx], headerPos.leftX, headerPos.y, 130, 130);

if (bgColor === '#400d60' || bgColor === '#2737a2') {
image(logosRight2, posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
} else {
image(logosRight, posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
}

// Draw illustration
blendMode(BLEND);
let illuH = 700 * illustrationScale;
let illuImg = illustrationImgs[illustrationCategory][styleIdx.illuIdx];
let illuW = illuImg.width * (illuH / illuImg.height);

// Position illustration based on layout and poster size
image(illuImg, illustrationX, posterHeight - illuH - illuPos.bottomOffset + illustrationY, illuW + 200, illuH + 200);

// Draw footer text
textSize(35);
fill(palette.footer);

// Calculate footer positions
let footerLeftX = footerPos.leftX;
let footerRightX = posterWidth - footerPos.rightX;

textAlign(LEFT);
text('Reykjavik', footerLeftX, posterHeight - footerPos.y - 35);

textAlign(CENTER);
text('Global forum', posterWidth / 2, posterHeight - footerPos.centerY - 35);

textAlign(RIGHT);
text('2025', footerRightX, posterHeight - footerPos.y - 35);

textAlign(LEFT);

// Get the current max lines for this layout and poster size
let maxLines = getMaxLines();

// Draw text based on layout
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
// Layout 3 condition removed
}

// Helper function to create character-limited text
function createCharacterLimitedText(inputText, charsPerLine) {
if (!inputText || inputText.length === 0) {
return ['Type your text here'];
}

let lines = [];
let currentPos = 0;

while (currentPos < inputText.length) {
let endPos = Math.min(currentPos + charsPerLine, inputText.length);

if (endPos < inputText.length && inputText[endPos] !== ' ') {
  // Look for the last space within the character limit
  let lastSpace = inputText.lastIndexOf(' ', endPos);
  if (lastSpace > currentPos) {
    endPos = lastSpace + 1;
  }
}

lines.push(inputText.substring(currentPos, endPos).trim());
currentPos = endPos;
}

return lines;
}

// Update wrapped text based on current settings
function updateWrappedText() {
let currentCharsPerLine = getCharsPerLine();
wrappedHashtagText = createCharacterLimitedText(hashtagText, currentCharsPerLine);

let defaultText = 'share your ideas and Feature the voices Here';
wrappedMainText = createCharacterLimitedText(
mainText.length > 0 ? mainText : defaultText, 
currentCharsPerLine
);
}

// Check if adding more text would exceed the line limit
function wouldExceedLineLimit(currentText, newChar) {
let testText = currentText + newChar;
let currentCharsPerLine = getCharsPerLine();
let lines = createCharacterLimitedText(testText, currentCharsPerLine);
return lines.length > getMaxLines();
}

// Load saved posters from localStorage
function loadSavedPosters() {
let savedPostersData = localStorage.getItem('rgfSavedPosters');
if (savedPostersData) {
try {
  savedPosters = JSON.parse(savedPostersData);
  // Display each saved poster in reverse order to show newest first
  for (let i = savedPosters.length - 1; i >= 0; i--) {
    displayPosterInWall(savedPosters[i], true);
  }
} catch (e) {
  console.error("Error loading saved posters:", e);
  localStorage.removeItem('rgfSavedPosters');
  savedPosters = [];
}
}
}

// Display a poster in the wall section
function displayPosterInWall(posterData, addToTop = false) {
let posterGrid = select('#posterGrid');
if (!posterGrid) {
console.error("Poster grid not found!");
return;
}

let posterContainer = createDiv();
posterContainer.addClass('poster-thumbnail');

if (posterData.posterSize === 'Landscape') {
posterContainer.addClass('landscape');
}

let img = createImg(posterData.dataUrl, 'Saved poster');
img.style('width', '100%');
img.style('height', 'auto');
img.style('display', 'block');
img.parent(posterContainer);

// Add click handler to delete this poster
posterContainer.mousePressed(() => {
let index = savedPosters.findIndex(p => p.dataUrl === posterData.dataUrl);
if (index !== -1) {
  savedPosters.splice(index, 1);
  localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));
}
posterContainer.remove();
});

// Add to the grid - either at the top or bottom
if (addToTop && posterGrid.elt.firstChild) {
posterGrid.elt.insertBefore(posterContainer.elt, posterGrid.elt.firstChild);
} else {
posterContainer.parent(posterGrid);
}
}

// Create UI elements
function createUI(ui) {
function createLabel(text, parent) {
let label = createDiv(text);
label.parent(parent);
label.addClass('label');
label.style('margin-bottom', '8px');
label.style('font-weight', 'bold');
if (fontsLoaded) {
  label.style('font-family', '"RGF Sans", sans-serif');
}
return label;
}

function createSection() {
let section = createDiv();
section.addClass('ui-section');
section.parent(ui);
return section;
}

// Poster size section
let posterSection = createSection();
createLabel('Size:', posterSection);
let sizeSelector = createSelect();
sizeSelector.id('posterSizeSelector');
sizeSelector.option('Story (1080×1920)', 'Story');
sizeSelector.option('Post (1080×1350)', 'Post');
sizeSelector.option('Square (1080×1080)', 'Square');
sizeSelector.option('Landscape (1920×1080)', 'Landscape');
sizeSelector.parent(posterSection);
sizeSelector.style('width', '100%');
sizeSelector.style('padding', '10px');
sizeSelector.style('margin-bottom', '15px');
sizeSelector.style('font-size', '16px');
sizeSelector.changed(() => {
posterSize = sizeSelector.value();

// If switching to Square or Landscape and layout is 2, switch to layout 1
if ((posterSize === 'Square' || posterSize === 'Landscape') && layout === 2) {
  layout = 1;
  let layoutSelector = select('#layoutSelector');
  if (layoutSelector) {
    layoutSelector.value(1);
  }
}

// Update the layout options based on the poster size
updateLayoutOptions();

calculateScaleRatio();
updateCanvasSize();
updateLineLimitDisplay();
updateWrappedText();
validateTextLength();
});

// Layout section
createLabel('Style:', posterSection);
let layoutSelector = createSelect();
layoutSelector.id('layoutSelector');
layoutSelector.option('Layout 1', 1);
layoutSelector.option('Layout 2', 2);
// Layout 3 option removed
layoutSelector.parent(posterSection);
layoutSelector.style('width', '100%');
layoutSelector.style('padding', '10px');
layoutSelector.style('margin-bottom', '15px');
layoutSelector.style('font-size', '16px');
layoutSelector.changed(() => {
// Check if Layout 2 is selected but poster size is not Story or Post
if (layoutSelector.value() == 2 && 
    (posterSize !== 'Story' && posterSize !== 'Post')) {
  // Switch back to Layout 1 without alert
  layoutSelector.value(1);
  layout = 1;
} else {
  layout = int(layoutSelector.value());
}
updateWrappedText();
updateLineLimitDisplay();
validateTextLength();
});

// Color section
let colorSection = createSection();
createLabel('Colour:', colorSection);
let colorContainer = createDiv();
colorContainer.style('display', 'flex');
colorContainer.style('flex-wrap', 'wrap');
colorContainer.style('justify-content', 'center');
colorContainer.style('margin-bottom', '15px');
colorContainer.parent(colorSection);

let colorOptions = Object.keys(colors);
colorOptions.forEach(col => {
let buttonContainer = createDiv();
buttonContainer.addClass('color-button-container');
buttonContainer.parent(colorContainer);

let btn = createButton('');
btn.addClass('color-button');
btn.style('background-color', col);
btn.parent(buttonContainer);
btn.mousePressed(() => {
  bgColor = col;
  updateSelectedColorIndicator();
});

let indicator = createImg('selected01.png', 'selected');
indicator.addClass('selected-indicator');
indicator.parent(buttonContainer);

colorButtons[col] = buttonContainer;
});

updateSelectedColorIndicator();

// Illustration section
let illuSection = createSection();
createLabel('Illustration:', illuSection);
let illuSelector = createSelect();
categories.forEach(name => illuSelector.option(name));
illuSelector.parent(illuSection);
illuSelector.style('width', '100%');
illuSelector.style('padding', '10px');
illuSelector.style('margin-bottom', '15px');
illuSelector.style('font-size', '16px');
illuSelector.changed(() => illustrationCategory = illuSelector.value());

// Scale slider
createLabel('Scale:', illuSection);
let sizeSliderContainer = createDiv();
sizeSliderContainer.id('sizeSliderContainer');
sizeSliderContainer.style('position', 'relative');
sizeSliderContainer.style('width', '100%');
sizeSliderContainer.style('height', '30px');
sizeSliderContainer.style('margin-bottom', '15px');
sizeSliderContainer.style('background-image', 'url(vector2.png)');
sizeSliderContainer.style('background-repeat', 'repeat-x');
sizeSliderContainer.style('background-position', 'center');
sizeSliderContainer.parent(illuSection);

let sizeSlider = createSlider(0.5, 2, 1, 0.01);
sizeSlider.parent(sizeSliderContainer);
sizeSlider.style('width', '100%');
sizeSlider.style('height', '30px');
sizeSlider.style('opacity', '0');
sizeSlider.style('z-index', '2');

let sizeHandle = createImg('handle.png', 'slider handle');
sizeHandle.parent(sizeSliderContainer);
sizeHandle.style('position', 'absolute');
sizeHandle.style('height', '30px');
sizeHandle.style('width', 'auto');
sizeHandle.style('top', '0');
sizeHandle.style('left', '50%');
sizeHandle.style('transform', 'translateX(-50%)');
sizeHandle.style('pointer-events', 'none');

sizeSlider.input(() => {
illustrationScale = sizeSlider.value();
let percent = (sizeSlider.value() - 0.5) / 1.5;
sizeHandle.style('left', (percent * 100) + '%');
});

// X position slider
createLabel('Position X:', illuSection);
let illuSliderContainer = createDiv();
illuSliderContainer.id('illuSliderContainer');
illuSliderContainer.style('position', 'relative');
illuSliderContainer.style('width', '100%');
illuSliderContainer.style('height', '30px');
illuSliderContainer.style('margin-bottom', '15px');
illuSliderContainer.style('background-image', 'url(vector2.png)');
illuSliderContainer.style('background-repeat', 'repeat-x');
illuSliderContainer.style('background-position', 'center');
illuSliderContainer.parent(illuSection);

let illuSlider = createSlider(-2160, 2160, illustrationX / scaleRatio);
illuSlider.parent(illuSliderContainer);
illuSlider.style('width', '100%');
illuSlider.style('height', '30px');
illuSlider.style('opacity', '0');
illuSlider.style('z-index', '2');

let illuHandle = createImg('handle.png', 'slider handle');
illuHandle.parent(illuSliderContainer);
illuHandle.style('position', 'absolute');
illuHandle.style('height', '30px');
illuHandle.style('width', 'auto');
illuHandle.style('top', '0');
illuHandle.style('left', '50%');
illuHandle.style('transform', 'translateX(-50%)');
illuHandle.style('pointer-events', 'none');

illuSlider.input(() => {
illustrationX = illuSlider.value() * scaleRatio;
let percent = (illuSlider.value() + 2160) / 4320;
illuHandle.style('left', (percent * 100) + '%');
});

// Y position slider
createLabel('Position Y:', illuSection);
let illuYSliderContainer = createDiv();
illuYSliderContainer.id('illuYSliderContainer');
illuYSliderContainer.style('position', 'relative');
illuYSliderContainer.style('width', '100%');
illuYSliderContainer.style('height', '30px');
illuYSliderContainer.style('margin-bottom', '15px');
illuYSliderContainer.style('background-image', 'url(vector2.png)');
illuYSliderContainer.style('background-repeat', 'repeat-x');
illuYSliderContainer.style('background-position', 'center');
illuYSliderContainer.parent(illuSection);

let illuYSlider = createSlider(-1080, 1080, illustrationY / scaleRatio);
illuYSlider.parent(illuYSliderContainer);
illuYSlider.style('width', '100%');
illuYSlider.style('height', '30px');
illuYSlider.style('opacity', '0');
illuYSlider.style('z-index', '2');

let illuYHandle = createImg('handle.png', 'slider handle');
illuYHandle.parent(illuYSliderContainer);
illuYHandle.style('position', 'absolute');
illuYHandle.style('height', '30px');
illuYHandle.style('width', 'auto');
illuYHandle.style('top', '0');
illuYHandle.style('left', '50%');
illuYHandle.style('transform', 'translateX(-50%)');
illuYHandle.style('pointer-events', 'none');

illuYSlider.input(() => {
illustrationY = illuYSlider.value() * scaleRatio;
let percent = (illuYSlider.value() + 1080) / 2160;
illuYHandle.style('left', (percent * 100) + '%');
});

// Text section
let textSection = createSection();
let lineLabel = createLabel(`Main Text (${getMaxLines()} lines max):`, textSection);
lineLabel.id('lineLimit');

mainTextArea = createElement('textarea');
mainTextArea.parent(textSection);
mainTextArea.style('width', '95%');
mainTextArea.style('height', '90px');
mainTextArea.style('padding', '10px');
mainTextArea.style('border', '1px solid #ccc');
mainTextArea.style('border-radius', '4px');
mainTextArea.style('font-size', '16px');
mainTextArea.style('margin-bottom', '10px');
mainTextArea.style('resize', 'vertical');

// Add event listeners for text input
mainTextArea.elt.addEventListener('keydown', function(e) {
// Allow control keys
if (e.key === 'Backspace' || e.key === 'Delete' || 
    e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
    e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
    e.key === 'Home' || e.key === 'End' || 
    e.ctrlKey || e.metaKey) {
  return true;
}

// Check if adding this character would exceed line limit
if (wouldExceedLineLimit(mainTextArea.value(), e.key)) {
  e.preventDefault();
  return false;
}
});

mainTextArea.input(() => {
validateTextLength(mainTextArea.value());
});

// Export section
let exportSection = createSection();
let saveBtn = createButton('Save Poster');
saveBtn.parent(exportSection);
saveBtn.style('width', '100%');
saveBtn.style('background-color', '#2737A2');
saveBtn.style('color', 'white');
saveBtn.style('padding', '15px');
saveBtn.style('border', 'none');
saveBtn.style('border-radius', '4px');
saveBtn.style('cursor', 'pointer');
saveBtn.style('font-size', '18px');
saveBtn.style('font-weight', 'bold');

if (fontsLoaded) {
saveBtn.style('font-family', '"RGF Sans", sans-serif');
}

saveBtn.mouseOver(() => saveBtn.style('background-color', '#F8ADD2'));
saveBtn.mouseOut(() => saveBtn.style('background-color', '#2737A2'));

saveBtn.mousePressed(() => {
let filename = `social_post_${posterSize}_${layout}`;
saveCanvas(filename, 'jpg');

// Save to wall
let dataUrl = canvas.elt.toDataURL('image/jpeg');
let posterData = {
  dataUrl: dataUrl,
  posterSize: posterSize,
  layout: layout,
  timestamp: Date.now()
};

savedPosters.push(posterData);

// Limit saved posters to prevent exceeding storage
if (savedPosters.length > 20) savedPosters.shift();
localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));

// Display in the wall at the top
displayPosterInWall(posterData, true);

// Scroll to the wall
document.getElementById('wallContainer').scrollIntoView({
  behavior: 'smooth',
  block: 'start'
});
});

// Clear button
let clearBtn = createButton('Clear All Saved Posters');
clearBtn.parent(exportSection);
clearBtn.style('width', '100%');
clearBtn.style('background-color', '#db48ff');
clearBtn.style('color', 'white');
clearBtn.style('padding', '10px');
clearBtn.style('border', 'none');
clearBtn.style('border-radius', '4px');
clearBtn.style('cursor', 'pointer');
clearBtn.style('font-size', '16px');
clearBtn.style('margin-top', '10px');

if (fontsLoaded) {
clearBtn.style('font-family', '"RGF Sans", sans-serif');
}

clearBtn.mouseOver(() => clearBtn.style('background-color', '#A4E5D8'));
clearBtn.mouseOut(() => clearBtn.style('background-color', '#db48ff'));

clearBtn.mousePressed(() => {
// Clear saved posters
savedPosters = [];
localStorage.removeItem('rgfSavedPosters');

// Clear the wall
let posterGrid = select('#posterGrid');
if (posterGrid) {
  while (posterGrid.elt.firstChild) {
    posterGrid.elt.removeChild(posterGrid.elt.firstChild);
  }
}
});
}

// Function to update layout options based on poster size
function updateLayoutOptions() {
let layoutSelector = select('#layoutSelector');
if (!layoutSelector) return;

// Get all options
let options = layoutSelector.elt.options;

// Enable/disable Layout 2 based on poster size
for (let i = 0; i < options.length; i++) {
  if (options[i].value === '2') {
    if (posterSize === 'Story' || posterSize === 'Post') {
      options[i].disabled = false;
    } else {
      options[i].disabled = true;
    }
  }
}
}

// Validate and adjust text length based on current layout's line limit
function validateTextLength(currentText = mainTextArea.value()) {
let maxLines = getMaxLines();
let currentCharsPerLine = getCharsPerLine();
let lines = createCharacterLimitedText(currentText, currentCharsPerLine);

// If it exceeds the line limit, truncate it
if (lines.length > maxLines) {
let allowedText = '';
for (let i = 0; i < maxLines; i++) {
  allowedText += lines[i] + (i < maxLines - 1 ? ' ' : '');
}

mainTextArea.value(allowedText);
mainText = allowedText;
} else {
mainText = currentText;
}

updateWrappedText();
}

// Calculate scale ratio based on available screen space
function calculateScaleRatio() {
// Get available width for canvas
let availableWidth = windowWidth - 450; // UI panel + padding
if (windowWidth <= 1200) {
availableWidth = windowWidth - 100; // Just account for padding on smaller screens
}

// Get available height
let availableHeight = windowHeight - 150;

// Get poster dimensions
let posterWidth = posterSizes[posterSize].width;
let posterHeight = posterSizes[posterSize].height;

// Calculate scale ratios
let widthRatio = availableWidth / posterWidth;
let heightRatio = availableHeight / posterHeight;

// Use smaller ratio to ensure poster fits
scaleRatio = Math.min(widthRatio, heightRatio, 0.5);

// Ensure minimum scale for visibility
scaleRatio = Math.max(scaleRatio, 0.15);
}

// Handle window resize
function windowResized() {
calculateScaleRatio();
updateCanvasSize();
}

// Adjust container for poster size
function adjustContainerForPosterSize() {
let editorContainer = select('#editorContainer');
if (posterSize === 'Landscape') {
editorContainer.addClass('landscape-mode');
} else {
editorContainer.removeClass('landscape-mode');
}
}

// Apply RGF font to headers
function applyRGFFontToHeaders() {
if (fontsLoaded) {
// Apply to all headings
let headings = selectAll('h1, h2, h3, h4, h5, h6');
for (let heading of headings) {
  heading.addClass('rgf-font');
}

// Apply to all labels
let labels = selectAll('.label');
for (let label of labels) {
  label.addClass('rgf-font');
}
}
}

// Update selected color indicator
function updateSelectedColorIndicator() {
// Hide all indicators
for (let col in colorButtons) {
colorButtons[col].removeClass('selected');
}

// Show indicator for selected color
if (colorButtons[bgColor]) {
colorButtons[bgColor].addClass('selected');
}
}

// Update canvas size
function updateCanvasSize() {
canvasW = posterSizes[posterSize].width * scaleRatio;
canvasH = posterSizes[posterSize].height * scaleRatio;

if (typeof resizeCanvas === 'function' && typeof width !== 'undefined') {
resizeCanvas(canvasW, canvasH);
}

// Adjust container for the new poster size
adjustContainerForPosterSize();
}

// Update the line limit display in the UI
function updateLineLimitDisplay() {
let lineLabel = select('#lineLimit');
if (lineLabel) {
lineLabel.html(`Main Text (${getMaxLines()} lines max):`);
}
}

// Initialize slider handle positions
function initializeSliderPositions() {
setTimeout(() => {
// Size slider initial position
let sizePercent = (1 - 0.5) / 1.5;
select('#sizeSliderContainer img').style('left', (sizePercent * 100) + '%');

// X offset slider initial position
let xPercent = (illustrationX / scaleRatio + 2160) / 4320;
select('#illuSliderContainer img').style('left', (xPercent * 100) + '%');

// Y offset slider initial position
let yPercent = (illustrationY / scaleRatio + 1080) / 2160;
select('#illuYSliderContainer img').style('left', (yPercent * 100) + '%');
}, 100);
}

// Set up event listeners
function setupEventListeners() {
let sizeSelector = select('#posterSizeSelector');
if (sizeSelector) {
sizeSelector.changed(() => {
  posterSize = sizeSelector.value();
  calculateScaleRatio();
  updateCanvasSize();
  updateLineLimitDisplay();
  updateWrappedText();
  validateTextLength();
});
}

// Add window resize listener
window.addEventListener('resize', windowResized);
}

// Add CSS styles
function addStyles() {
let style = document.createElement('style');
style.textContent = `
@font-face {
  font-family: 'RGF Sans';
  src: url('200525_RGF_Sans.otf') format('opentype');
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.rgf-font {
  font-family: 'RGF Sans', sans-serif !important;
}

.color-button-container {
  position: relative;
  display: inline-block;
  margin: 5px;
}

.color-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.selected-indicator {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 60px;
  height: 60px;
  pointer-events: none;
  display: none;
  transform: scale(0.6);
}

.selected .selected-indicator {
  display: block;
}

.ui-section {
  margin-bottom: 15px;
}

.poster-thumbnail {
  width: 100%;
  cursor: pointer;
}

.poster-thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}

.poster-thumbnail.landscape {
  grid-column: 1 / -1;
}

#posterGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  grid-auto-rows: auto;
  width: 100%;
  padding: 20px;
}

#uiPanel {
  width: 350px;
  min-width: 350px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

#canvasContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

canvas {
  max-width: 100%;
  height: auto !important;
  object-fit: contain;
}

#editorContainer.landscape-mode {
  max-width: 1600px;
}

/* Style for disabled select options */
select option:disabled {
  color: #999;
  font-style: italic;
}

@media (max-width: 1200px) {
  #editorContainer {
    flex-direction: column;
    align-items: center;
  }

  #uiPanel {
    width: 100%;
    max-width: 600px;
    margin-bottom: 15px;
    position: static;
  }
}

@media (max-width: 768px) {
  #posterGrid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
`;
document.head.appendChild(style);
}

// Function to enforce layout restrictions
function enforceLayoutRestrictions() {
// If current layout is 3, switch to layout 1
if (layout === 3) {
  layout = 1;
}

// If layout is 2 but poster size is not Story or Post, switch to layout 1
if (layout === 2 && (posterSize !== 'Story' && posterSize !== 'Post')) {
  layout = 1;
}

// Update the layout selector to match
let layoutSelector = select('#layoutSelector');
if (layoutSelector) {
  layoutSelector.value(layout);
}
}