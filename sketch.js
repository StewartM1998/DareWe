// -------------------------------------------------------------
// DARE WE GENERATOR — Mobile-optimized with bottom icon bar
// -------------------------------------------------------------

// Mobile detection and limits
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let loadError = false;

const MAX_SAVED_POSTERS = isMobile ? 5 : 20;
const MAX_PIXEL_DENSITY = isMobile ? 1 : 2;

// Mobile panel state
let activeMobilePanel = null;

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
const charsPerLineConfig = {
'Story': 9, 'Post': 9, 'Square': 9, 'Landscape': 24
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

// ---------- Preload with error handling ----------
function preload() {
try {
 selectedIndicator = loadImage(F_UI + 'selected01.png', 
   () => console.log('Selected indicator loaded'),
   (err) => { console.error('Failed to load selected indicator:', err); loadError = true; }
 );

 // Load logos with error handling
 for (let i = 0; i < 6; i++) {
   logos[i] = loadImage(F_UI + `logo-new${i}.png`,
     () => console.log(`Logo ${i} loaded`),
     (err) => { console.error(`Failed to load logo ${i}:`, err); loadError = true; }
   );
 }
 
 logosRight = loadImage(F_UI + 'logo-right.png',
   () => console.log('Logo right loaded'),
   (err) => { console.error('Failed to load logo-right:', err); loadError = true; }
 );
 
 logosRight2 = loadImage(F_UI + 'logo-right2.png',
   () => console.log('Logo right2 loaded'),
   (err) => { console.error('Failed to load logo-right2:', err); loadError = true; }
 );

 // CRITICAL FIX: Only preload current illustration category on mobile
 if (isMobile) {
   // Just load the default category
   illustrationImgs[illustrationCategory] = [];
   for (let i = 0; i < 6; i++) {
     illustrationImgs[illustrationCategory][i] = loadImage(
       F_ILLU + `${illustrationCategory}/${illustrationCategory}${i}.png`,
       () => console.log(`${illustrationCategory} ${i} loaded`),
       (err) => { console.error(`Failed to load ${illustrationCategory} ${i}:`, err); loadError = true; }
     );
   }
 } else {
   // Load all categories on desktop
   for (let cat of categories) {
     illustrationImgs[cat] = [];
     for (let i = 0; i < 6; i++) {
       illustrationImgs[cat][i] = loadImage(
         F_ILLU + `${cat}/${cat}${i}.png`,
         () => console.log(`${cat} ${i} loaded`),
         (err) => { console.error(`Failed to load ${cat} ${i}:`, err); loadError = true; }
       );
     }
   }
 }

 // Font loading with better error handling
 rgfFont = loadFont(F_FONTS + 'RGFDare-Regular.otf', 
   () => { 
     fontsLoaded = true; 
     console.log('RGFDare font loaded'); 
   }, 
   (err) => { 
     console.error('Error loading RGFDare font:', err); 
     fontsLoaded = true; // Continue anyway with system font
     loadError = true;
   }
 );

} catch (error) {
 console.error('Preload error:', error);
 loadError = true;
 fontsLoaded = true; // Allow setup to continue
}
}

// Add lazy loading function for illustrations on mobile
function lazyLoadIllustration(cat) {
if (!isMobile) return; // Only for mobile
if (illustrationImgs[cat] && illustrationImgs[cat].length > 0) return; // Already loaded

console.log(`Lazy loading ${cat}...`);
illustrationImgs[cat] = [];
for (let i = 0; i < 6; i++) {
 illustrationImgs[cat][i] = loadImage(
   F_ILLU + `${cat}/${cat}${i}.png`,
   () => console.log(`Lazy loaded ${cat} ${i}`),
   (err) => console.error(`Failed to lazy load ${cat} ${i}:`, err)
 );
}
}

// ---------- Setup / UI scaffolding ----------
let scaleRatio = 0.5;
let canvasW, canvasH;

function setup() {
try {
 pixelDensity(MAX_PIXEL_DENSITY);
 frameRate(30);
 
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
 
 // Create mobile interface
 if (isMobile) {
   createMobileInterface();
 }
 
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

 // Show warning if loading failed
 if (loadError) {
   console.warn('Some resources failed to load, but continuing...');
 }

 // Send fixed height to Wix
 _dwPostHeightDebounced(30);
 
} catch (error) {
 console.error('Setup error:', error);
 // Display error to user
 const errorDiv = createDiv('Failed to initialize. Please refresh the page.');
 errorDiv.style('color', 'red');
 errorDiv.style('padding', '20px');
 errorDiv.style('text-align', 'center');
 errorDiv.parent('app');
}
}

function draw() {
try {
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
 
 // Draw only if images are loaded
 if (logos[styleIdx.logoIdx] && logos[styleIdx.logoIdx].width > 0) {
   image(logos[styleIdx.logoIdx], headerPos.leftX, headerPos.y, 130, 130);
 }
 
 if (bgColor === '#400d60' || bgColor === '#2737a2') {
   if (logosRight2 && logosRight2.width > 0) {
     image(logosRight2, posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
   }
 } else {
   if (logosRight && logosRight.width > 0) {
     image(logosRight,  posterWidth - headerPos.rightX - 130, headerPos.y, 130, 85);
   }
 }

 // Check if illustration exists before drawing
 const illuImg = illustrationImgs[illustrationCategory] && 
                 illustrationImgs[illustrationCategory][styleIdx.illuIdx];
 
 if (illuImg && illuImg.width > 0) {
   const illuH  = 700 * illustrationScale;
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
 
} catch (error) {
 console.error('Draw error:', error);
 // Don't redraw on error to prevent infinite loop
 noLoop();
 
 // Show error message
 background(200);
 fill(255, 0, 0);
 textSize(20);
 textAlign(CENTER, CENTER);
 text('Error rendering poster', width/2, height/2);
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
     // Word is longer than charsPerLine, need to break it
     let remaining = word;
     while (remaining.length > charsPerLine) {
       lines.push(remaining.substring(0, charsPerLine));
       remaining = remaining.substring(charsPerLine);
     }
     currentLine = remaining;
   }
 }
}

if (currentLine) {
 lines.push(currentLine);
}

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
try {
 const posterGrid = select('#posterGrid'); 
 if (!posterGrid) return;
 
 const box = createDiv().addClass('poster-thumbnail');
 if (posterData.posterSize === 'Landscape') box.addClass('landscape');
 
 const img = createImg(posterData.dataUrl, 'Saved poster');
 img.style('width','100%'); 
 img.style('height','auto'); 
 img.style('display','block'); 
 img.parent(box);
 
 box.mousePressed(()=>{
   const ix = savedPosters.findIndex(p=>p.dataUrl===posterData.dataUrl);
   if (ix!==-1){ 
     savedPosters.splice(ix,1); 
     try {
       localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters)); 
     } catch (e) {
       console.error('LocalStorage error:', e);
     }
   }
   box.remove();
 });
 
 if (addToTop && posterGrid.elt.firstChild) {
   posterGrid.elt.insertBefore(box.elt, posterGrid.elt.firstChild);
 } else {
   box.parent(posterGrid);
 }
} catch (error) {
 console.error('Error displaying poster:', error);
}
}

// ---------- populateMainTextDropdown ----------
function populateMainTextDropdown() {
const mainTextArea = select('#mainTextSelector');
if (!mainTextArea) return;

mainTextArea.elt.innerHTML = '';
mainTextArea.option('Select a message...', '');

presetResponses.all.forEach(response => {
 mainTextArea.option(response, response);
});

if (posterSize === 'Square' || posterSize === 'Landscape') {
 presetResponses.squareAndLandscape.forEach(response => {
   mainTextArea.option(response, response);
 });
}

if (posterSize === 'Landscape') {
 presetResponses.landscapeOnly.forEach(response => {
   mainTextArea.option(response, response);
 });
}
}

// ---------- MOBILE INTERFACE FUNCTIONS ----------
function createMobileInterface() {
 if (!isMobile) return;
 
 const main = select('#mainContainer');
 if (!main) return;
 
 // Hide desktop editor on mobile
 const editor = select('#editorContainer');
 if (editor) {
   editor.style('display', 'none');
 }
 
 // Create mobile layout
 const mobileLayout = createDiv().id('mobileLayout');
 mobileLayout.parent(main);
 mobileLayout.style('width', '100%');
 mobileLayout.style('height', '100vh');
 mobileLayout.style('display', 'flex');
 mobileLayout.style('flex-direction', 'column');
 mobileLayout.style('position', 'fixed');
 mobileLayout.style('top', '0');
 mobileLayout.style('left', '0');
 mobileLayout.style('background', '#f5f5f5');
 mobileLayout.style('z-index', '1000');
 
 // Poster container (fills available space)
 const posterArea = createDiv().id('mobilePosterArea');
 posterArea.parent(mobileLayout);
 posterArea.style('flex', '1');
 posterArea.style('display', 'flex');
 posterArea.style('justify-content', 'center');
 posterArea.style('align-items', 'center');
 posterArea.style('overflow', 'hidden');
 posterArea.style('padding', '10px');
 posterArea.style('transition', 'all 0.3s ease');
 
 // Move canvas to mobile poster area
 if (canvas) {
   canvas.parent(posterArea);
 }
 
 // Expandable panels container
 const panelsContainer = createDiv().id('mobilePanels');
 panelsContainer.parent(mobileLayout);
 panelsContainer.style('background', 'white');
 panelsContainer.style('box-shadow', '0 -2px 10px rgba(0,0,0,0.1)');
 panelsContainer.style('transition', 'all 0.3s ease');
 panelsContainer.style('max-height', '0');
 panelsContainer.style('overflow', 'hidden');
 
 // Create all panels (hidden by default)
 createColorPanel(panelsContainer);
 createLayoutPanel(panelsContainer);
 createTextPanel(panelsContainer);
 createIllustrationPanel(panelsContainer);
 
 // Bottom icon bar (always visible)
 const iconBar = createDiv().id('mobileIconBar');
 iconBar.parent(mobileLayout);
 iconBar.style('height', '70px');
 iconBar.style('background', 'white');
 iconBar.style('border-top', '2px solid #e0e0e0');
 iconBar.style('display', 'flex');
 iconBar.style('justify-content', 'space-around');
 iconBar.style('align-items', 'center');
 iconBar.style('padding', '0 10px');
 
 // Create icon buttons
 createIconButton(iconBar, '🎨', 'colorPanel', 'Color');
 createIconButton(iconBar, '📏', 'layoutPanel', 'Layout');
 createIconButton(iconBar, '💬', 'textPanel', 'Text');
 createIconButton(iconBar, '🖼️', 'illustrationPanel', 'Image');
 createIconButton(iconBar, '💾', null, 'Save', savePosterMobile);
 
 // Hide wall container on mobile
 if (wallContainer) {
   wallContainer.style('display', 'none');
 }
}

function createIconButton(parent, emoji, panelId, label, callback) {
 const btn = createDiv().addClass('mobile-icon-button');
 btn.parent(parent);
 btn.style('display', 'flex');
 btn.style('flex-direction', 'column');
 btn.style('align-items', 'center');
 btn.style('cursor', 'pointer');
 btn.style('padding', '8px');
 btn.style('border-radius', '8px');
 btn.style('transition', 'all 0.2s');
 btn.style('flex', '1');
 btn.style('max-width', '80px');
 
 const icon = createDiv(emoji);
 icon.parent(btn);
 icon.style('font-size', '24px');
 icon.style('margin-bottom', '4px');
 
 const text = createDiv(label);
 text.parent(btn);
 text.style('font-size', '11px');
 text.style('color', '#666');
 text.style('font-weight', 'bold');
 
 if (callback) {
   // Direct action (like Save)
   btn.mousePressed(callback);
   btn.mouseOver(() => btn.style('background', '#f0f0f0'));
   btn.mouseOut(() => btn.style('background', 'transparent'));
 } else if (panelId) {
   // Toggle panel
   btn.mousePressed(() => toggleMobilePanel(panelId, btn));
   btn.attribute('data-panel', panelId);
 }
}

function toggleMobilePanel(panelId, button) {
 const panelsContainer = select('#mobilePanels');
 const panel = select(`#${panelId}`);
 const posterArea = select('#mobilePosterArea');
 
 if (!panelsContainer || !panel) return;
 
 // Deactivate all buttons
 selectAll('.mobile-icon-button').forEach(btn => {
   btn.style('background', 'transparent');
   const textEl = btn.elt.querySelector('div:last-child');
   if (textEl) textEl.style.color = '#666';
 });
 
 if (activeMobilePanel === panelId) {
   // Close current panel
   panelsContainer.style('max-height', '0');
   posterArea.style('flex', '1');
   activeMobilePanel = null;
 } else {
   // Close all panels
   selectAll('.mobile-panel').forEach(p => p.style('display', 'none'));
   
   // Open selected panel
   panel.style('display', 'block');
   panelsContainer.style('max-height', '300px');
   posterArea.style('flex', '0.6');
   activeMobilePanel = panelId;
   
   // Highlight active button
   button.style('background', '#2737A2');
   const textEl = button.elt.querySelector('div:last-child');
   if (textEl) textEl.style.color = 'white';
 }
 
 // Recalculate canvas size
 setTimeout(() => {
   calculateScaleRatio();
   updateCanvasSize();
 }, 300);
}

function createColorPanel(parent) {
 const panel = createDiv().id('colorPanel').addClass('mobile-panel');
 panel.parent(parent);
 panel.style('display', 'none');
 panel.style('padding', '20px');
 
 const title = createDiv('Choose Color');
 title.parent(panel);
 title.style('font-weight', 'bold');
 title.style('margin-bottom', '15px');
 title.style('font-size', '16px');
 
 const colorGrid = createDiv();
 colorGrid.parent(panel);
 colorGrid.style('display', 'flex');
 colorGrid.style('justify-content', 'space-around');
 colorGrid.style('flex-wrap', 'wrap');
 colorGrid.style('gap', '15px');
 
 Object.keys(colors).forEach(col => {
   const colorBtn = createDiv();
   colorBtn.parent(colorGrid);
   colorBtn.style('width', '50px');
   colorBtn.style('height', '50px');
   colorBtn.style('border-radius', '50%');
   colorBtn.style('background-color', col);
   colorBtn.style('cursor', 'pointer');
   colorBtn.style('border', '3px solid transparent');
   colorBtn.style('transition', 'transform 0.2s, border 0.2s');
   
   if (col === bgColor) {
     colorBtn.style('border', '3px solid #333');
     colorBtn.style('transform', 'scale(1.1)');
   }
   
   colorBtn.mousePressed(() => {
     bgColor = col;
     // Update all color buttons
     selectAll('#colorPanel > div > div > div').forEach(btn => {
       btn.style('border', '3px solid transparent');
       btn.style('transform', 'scale(1)');
     });
     colorBtn.style('border', '3px solid #333');
     colorBtn.style('transform', 'scale(1.1)');
   });
 });
}

function createLayoutPanel(parent) {
 const panel = createDiv().id('layoutPanel').addClass('mobile-panel');
 panel.parent(parent);
 panel.style('display', 'none');
 panel.style('padding', '20px');
 
 const title = createDiv('Poster Size & Style');
 title.parent(panel);
 title.style('font-weight', 'bold');
 title.style('margin-bottom', '15px');
 title.style('font-size', '16px');
 
 // Size selector
 const sizeLabel = createDiv('Size:');
 sizeLabel.parent(panel);
 sizeLabel.style('margin-bottom', '8px');
 sizeLabel.style('font-size', '14px');
 
 const sizeSelector = createSelect().id('mobilePosterSize');
 sizeSelector.option('Story (1080×1920)', 'Story');
 sizeSelector.option('Post (1080×1350)', 'Post');
 sizeSelector.option('Square (1080×1080)', 'Square');
 sizeSelector.option('Landscape (1920×1080)', 'Landscape');
 sizeSelector.parent(panel);
 sizeSelector.style('width', '100%');
 sizeSelector.style('padding', '12px');
 sizeSelector.style('margin-bottom', '15px');
 sizeSelector.style('font-size', '14px');
 sizeSelector.changed(() => {
   posterSize = sizeSelector.value();
   updateLayoutOptions();
   calculateScaleRatio();
   updateCanvasSize();
   updateWrappedText();
   populateMobileTextDropdown();
   
   // Sync desktop dropdown if exists
   const desktopSize = select('#posterSizeSelector');
   if (desktopSize) desktopSize.value(posterSize);
 });
 
 // Layout selector
 const layoutLabel = createDiv('Style:');
 layoutLabel.parent(panel);
 layoutLabel.style('margin-bottom', '8px');
 layoutLabel.style('font-size', '14px');
 
 const layoutSelector = createSelect().id('mobileLayoutStyle');
 layoutSelector.option('Layout 1', 1);
 layoutSelector.option('Layout 2', 2);
 layoutSelector.parent(panel);
 layoutSelector.style('width', '100%');
 layoutSelector.style('padding', '12px');
 layoutSelector.style('font-size', '14px');
 layoutSelector.changed(() => {
   layout = int(layoutSelector.value());
   updateWrappedText();
   
   // Sync desktop dropdown if exists
   const desktopLayout = select('#layoutSelector');
   if (desktopLayout) desktopLayout.value(layout);
 });
}

function createTextPanel(parent) {
 const panel = createDiv().id('textPanel').addClass('mobile-panel');
 panel.parent(parent);
 panel.style('display', 'none');
 panel.style('padding', '20px');
 panel.style('max-height', '280px');
 panel.style('overflow-y', 'auto');
 
 const title = createDiv('Message');
 title.parent(panel);
 title.style('font-weight', 'bold');
 title.style('margin-bottom', '15px');
 title.style('font-size', '16px');
 
 const textSelector = createSelect().id('mobileTextSelector');
 textSelector.parent(panel);
 textSelector.style('width', '100%');
 textSelector.style('padding', '12px');
 textSelector.style('font-size', '14px');
 
 // Populate options
 populateMobileTextDropdown();
 
 textSelector.changed(() => {
   mainText = textSelector.value();
   updateWrappedText();
   
   // Sync desktop dropdown if exists
   const desktopText = select('#mainTextSelector');
   if (desktopText) desktopText.value(mainText);
 });
}

function populateMobileTextDropdown() {
 const textSelector = select('#mobileTextSelector');
 if (!textSelector) return;
 
 textSelector.elt.innerHTML = '';
 textSelector.option('Select a message...', '');
 
 presetResponses.all.forEach(response => {
   textSelector.option(response, response);
 });
 
 if (posterSize === 'Square' || posterSize === 'Landscape') {
   presetResponses.squareAndLandscape.forEach(response => {
     textSelector.option(response, response);
   });
 }
 
 if (posterSize === 'Landscape') {
   presetResponses.landscapeOnly.forEach(response => {
     textSelector.option(response, response);
   });
 }
}

function createIllustrationPanel(parent) {
 const panel = createDiv().id('illustrationPanel').addClass('mobile-panel');
 panel.parent(parent);
 panel.style('display', 'none');
 panel.style('padding', '20px');
 panel.style('max-height', '280px');
 panel.style('overflow-y', 'auto');
 
 const title = createDiv('Illustration');
 title.parent(panel);
 title.style('font-weight', 'bold');
 title.style('margin-bottom', '15px');
 title.style('font-size', '16px');
 
 // Category selector
 const catLabel = createDiv('Category:');
 catLabel.parent(panel);
 catLabel.style('margin-bottom', '8px');
 catLabel.style('font-size', '14px');
 
 const illuSelector = createSelect().id('mobileIlluCategory');
 categories.forEach(n => illuSelector.option(n));
 illuSelector.parent(panel);
 illuSelector.value(illustrationCategory);
 illuSelector.style('width', '100%');
 illuSelector.style('padding', '12px');
 illuSelector.style('margin-bottom', '15px');
 illuSelector.style('font-size', '14px');
 illuSelector.changed(() => {
   illustrationCategory = illuSelector.value();
   if (isMobile) {
     lazyLoadIllustration(illustrationCategory);
   }
 });
 
 // Simple sliders with labels
 createSimpleSlider(panel, 'Scale', 0.5, 2, 1, 0.1, (val) => {
   illustrationScale = val;
 });
 
 createSimpleSlider(panel, 'Position X', -500, 500, 0, 10, (val) => {
   illustrationX = val;
 });
 
 createSimpleSlider(panel, 'Position Y', -500, 500, 0, 10, (val) => {
   illustrationY = val;
 });
}

function createSimpleSlider(parent, label, min, max, defaultVal, step, callback) {
 const container = createDiv();
 container.parent(parent);
 container.style('margin-bottom', '15px');
 
 const labelDiv = createDiv(label);
 labelDiv.parent(container);
 labelDiv.style('margin-bottom', '8px');
 labelDiv.style('font-size', '14px');
 
 const slider = createSlider(min, max, defaultVal, step);
 slider.parent(container);
 slider.style('width', '100%');
 slider.input(() => callback(slider.value()));
}

function savePosterMobile() {
 try {
   const filename = `social_post_${posterSize}_${layout}`;
   saveCanvas(filename, 'jpg');
   
   // Show confirmation
   const confirmation = createDiv('✓ Saved!');
   confirmation.style('position', 'fixed');
   confirmation.style('top', '50%');
   confirmation.style('left', '50%');
   confirmation.style('transform', 'translate(-50%, -50%)');
   confirmation.style('background', '#2737A2');
   confirmation.style('color', 'white');
   confirmation.style('padding', '20px 40px');
   confirmation.style('border-radius', '8px');
   confirmation.style('font-size', '18px');
   confirmation.style('font-weight', 'bold');
   confirmation.style('z-index', '10000');
   confirmation.parent('body');
   
   setTimeout(() => confirmation.remove(), 2000);
 } catch (error) {
   console.error('Error saving:', error);
   alert('Failed to save poster');
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
sizeSelector.style('width','100%'); 
sizeSelector.style('padding','10px');
sizeSelector.style('margin-bottom','15px'); 
sizeSelector.style('font-size','16px');
sizeSelector.changed(()=>{
 posterSize = sizeSelector.value();
 if ((posterSize==='Square'||posterSize==='Landscape') && layout===2) {
   layout = 1; 
   const ls = select('#layoutSelector'); 
   if (ls) ls.value(1);
 }
 updateLayoutOptions();
 calculateScaleRatio(); 
 updateCanvasSize();
 updateLineLimitDisplay(); 
 updateWrappedText(); 
 validateTextLength();
 populateMainTextDropdown();
});

createLabel('Style:', posterSection);
const layoutSelector = createSelect().id('layoutSelector');
layoutSelector.option('Layout 1',1);
layoutSelector.option('Layout 2',2);
layoutSelector.parent(posterSection);
layoutSelector.style('width','100%'); 
layoutSelector.style('padding','10px');
layoutSelector.style('margin-bottom','15px'); 
layoutSelector.style('font-size','16px');
layoutSelector.changed(()=>{
 if (layoutSelector.value()==2 && (posterSize!=='Story' && posterSize!=='Post')) {
   layoutSelector.value(1); 
   layout = 1;
 } else {
   layout = int(layoutSelector.value());
 }
 updateWrappedText(); 
 updateLineLimitDisplay(); 
 validateTextLength();
});

const colorSection = createSection();
createLabel('Colour:', colorSection);
const colorContainer = createDiv();
colorContainer.parent(colorSection);
colorContainer.style('display','flex'); 
colorContainer.style('flex-wrap','wrap');
colorContainer.style('justify-content','center'); 
colorContainer.style('margin-bottom','15px');

Object.keys(colors).forEach(col=>{
 const wrap = createDiv().addClass('color-button-container'); 
 wrap.parent(colorContainer);
 const btn = createButton('').addClass('color-button'); 
 btn.style('background-color', col); 
 btn.parent(wrap);
 btn.mousePressed(()=>{ 
   bgColor = col; 
   updateSelectedColorIndicator(); 
 });
 const ind = createImg(F_UI + 'selected01.png','selected').addClass('selected-indicator'); 
 ind.parent(wrap);
 colorButtons[col] = wrap;
});
updateSelectedColorIndicator();

// ---------- TEXT SECTION WITH DROPDOWN ----------
const textSection = createSection();
const lineLabel = createLabel(`Main Text:`, textSection);
lineLabel.id('lineLimit');

// Create dropdown instead of textarea
mainTextArea = createSelect().id('mainTextSelector');
mainTextArea.parent(textSection);
mainTextArea.style('width','100%');
mainTextArea.style('padding','10px');
mainTextArea.style('margin-bottom','15px');
mainTextArea.style('font-size','16px');

// Initial population
populateMainTextDropdown();

// Update handler for dropdown
mainTextArea.changed(() => {
 const selectedText = mainTextArea.value();
 mainText = selectedText;
 updateWrappedText();
});

const illuSection = createSection();
createLabel('Illustration:', illuSection);
const illuSelector = createSelect(); 
categories.forEach(n=>illuSelector.option(n));
illuSelector.parent(illuSection);
illuSelector.value(illustrationCategory);
illuSelector.style('width','100%'); 
illuSelector.style('padding','10px');
illuSelector.style('margin-bottom','15px'); 
illuSelector.style('font-size','16px');
illuSelector.changed(()=> {
 illustrationCategory = illuSelector.value();
 // Lazy load on mobile
 if (isMobile) {
   lazyLoadIllustration(illustrationCategory);
 }
});

createLabel('Scale:', illuSection);
const sizeSliderContainer = createDiv().id('sizeSliderContainer');
sizeSliderContainer.parent(illuSection);
sizeSliderContainer.style('position','relative'); 
sizeSliderContainer.style('width','100%'); 
sizeSliderContainer.style('height','30px');
sizeSliderContainer.style('margin-bottom','15px');
sizeSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
sizeSliderContainer.style('background-repeat','repeat-x'); 
sizeSliderContainer.style('background-position','center');

const sizeSlider = createSlider(0.5,2,1,0.01);
sizeSlider.parent(sizeSliderContainer);
sizeSlider.style('width','100%'); 
sizeSlider.style('height','30px'); 
sizeSlider.style('opacity','0'); 
sizeSlider.style('z-index','2');

const sizeHandle = createImg(F_UI + 'handle.png','slider handle'); 
sizeHandle.parent(sizeSliderContainer);
sizeHandle.style('position','absolute'); 
sizeHandle.style('height','30px'); 
sizeHandle.style('width','auto');
sizeHandle.style('top','0'); 
sizeHandle.style('left','50%'); 
sizeHandle.style('transform','translateX(-50%)'); 
sizeHandle.style('pointer-events','none');

sizeSlider.input(()=>{
 illustrationScale = sizeSlider.value();
 const percent = (sizeSlider.value() - 0.5) / 1.5;
 sizeHandle.style('left', (percent*100) + '%');
});

createLabel('Position X:', illuSection);
const illuSliderContainer = createDiv().id('illuSliderContainer');
illuSliderContainer.parent(illuSection);
illuSliderContainer.style('position','relative'); 
illuSliderContainer.style('width','100%'); 
illuSliderContainer.style('height','30px');
illuSliderContainer.style('margin-bottom','15px');
illuSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
illuSliderContainer.style('background-repeat','repeat-x'); 
illuSliderContainer.style('background-position','center');

const illuSlider = createSlider(-2160,2160, illustrationX/scaleRatio);
illuSlider.parent(illuSliderContainer);
illuSlider.style('width','100%'); 
illuSlider.style('height','30px'); 
illuSlider.style('opacity','0'); 
illuSlider.style('z-index','2');

const illuHandle = createImg(F_UI + 'handle.png','slider handle'); 
illuHandle.parent(illuSliderContainer);
illuHandle.style('position','absolute'); 
illuHandle.style('height','30px'); 
illuHandle.style('width','auto');
illuHandle.style('top','0'); 
illuHandle.style('left','50%'); 
illuHandle.style('transform','translateX(-50%)'); 
illuHandle.style('pointer-events','none');

illuSlider.input(()=>{
 illustrationX = illuSlider.value()*scaleRatio;
 const percent = (illuSlider.value()+2160)/4320;
 illuHandle.style('left', (percent*100)+'%');
});

createLabel('Position Y:', illuSection);
const illuYSliderContainer = createDiv().id('illuYSliderContainer');
illuYSliderContainer.parent(illuSection);
illuYSliderContainer.style('position','relative'); 
illuYSliderContainer.style('width','100%'); 
illuYSliderContainer.style('height','30px');
illuYSliderContainer.style('margin-bottom','15px');
illuYSliderContainer.style('background-image', `url(${F_UI}vector2.png)`);
illuYSliderContainer.style('background-repeat','repeat-x'); 
illuYSliderContainer.style('background-position','center');

const illuYSlider = createSlider(-1080,1080, illustrationY/scaleRatio);
illuYSlider.parent(illuYSliderContainer);
illuYSlider.style('width','100%'); 
illuYSlider.style('height','30px'); 
illuYSlider.style('opacity','0'); 
illuYSlider.style('z-index','2');

const illuYHandle = createImg(F_UI + 'handle.png','slider handle'); 
illuYHandle.parent(illuYSliderContainer);
illuYHandle.style('position','absolute'); 
illuYHandle.style('height','30px'); 
illuYHandle.style('width','auto');
illuYHandle.style('top','0'); 
illuYHandle.style('left','50%'); 
illuYHandle.style('transform','translateX(-50%)'); 
illuYHandle.style('pointer-events','none');

illuYSlider.input(()=>{
 illustrationY = illuYSlider.value()*scaleRatio;
 const percent = (illuYSlider.value()+1080)/2160;
 illuYHandle.style('left', (percent*100)+'%');
});

const exportSection = createSection();
const saveBtn = createButton('Save Poster');
saveBtn.parent(exportSection);
saveBtn.style('width','100%'); 
saveBtn.style('background-color','#2737A2'); 
saveBtn.style('color','white');
saveBtn.style('padding','15px'); 
saveBtn.style('border','none'); 
saveBtn.style('border-radius','4px');
saveBtn.style('cursor','pointer'); 
saveBtn.style('font-size','18px'); 
saveBtn.style('font-weight','bold');
if (fontsLoaded) saveBtn.style('font-family','"RGFDare", sans-serif');
saveBtn.mouseOver(()=> saveBtn.style('background-color','#F8ADD2'));
saveBtn.mouseOut ( ()=> saveBtn.style('background-color','#2737A2'));
saveBtn.mousePressed(()=>{
 try {
   const filename = `social_post_${posterSize}_${layout}`;
   saveCanvas(filename, 'jpg');
   
   // Reduce quality for mobile to save storage
   const quality = isMobile ? 0.6 : 0.8;
   const dataUrl = canvas.elt.toDataURL('image/jpeg', quality);
   
   const posterData = { 
     dataUrl, 
     posterSize, 
     layout, 
     timestamp: Date.now() 
   };
   
   savedPosters.push(posterData);
   
   // Enforce limit
   while (savedPosters.length > MAX_SAVED_POSTERS) {
     savedPosters.shift();
   }
   
   try {
     localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));
   } catch (e) {
     console.error('LocalStorage error:', e);
     alert('Storage full! Removing oldest poster...');
     savedPosters.shift();
     try {
       localStorage.setItem('rgfSavedPosters', JSON.stringify(savedPosters));
     } catch (e2) {
       console.error('Still cannot save:', e2);
       alert('Cannot save poster - storage is full. Please clear some posters.');
       return;
     }
   }
   
   displayPosterInWall(posterData, true);
   
   const wallElement = document.getElementById('wallContainer');
   if (wallElement) {
     wallElement.scrollIntoView({behavior:'smooth', block:'start'});
   }
 } catch (error) {
   console.error('Error saving poster:', error);
   alert('Failed to save poster. Please try again.');
 }
});

const clearBtn = createButton('Clear All Saved Posters');
clearBtn.parent(exportSection);
clearBtn.style('width','100%'); 
clearBtn.style('background-color','#db48ff'); 
clearBtn.style('color','white');
clearBtn.style('padding','10px'); 
clearBtn.style('border','none'); 
clearBtn.style('border-radius','4px');
clearBtn.style('cursor','pointer'); 
clearBtn.style('font-size','16px'); 
clearBtn.style('margin-top','10px');
if (fontsLoaded) clearBtn.style('font-family','"RGFDare", sans-serif');
clearBtn.mouseOver(()=> clearBtn.style('background-color','#A4E5D8'));
clearBtn.mouseOut ( ()=> clearBtn.style('background-color','#db48ff'));
clearBtn.mousePressed(()=>{
 savedPosters = [];
 localStorage.removeItem('rgfSavedPosters');
 const grid = select('#posterGrid');
 if (grid) { 
   while (grid.elt.firstChild) {
     grid.elt.removeChild(grid.elt.firstChild); 
   }
 }
});
}

function updateLayoutOptions() {
const layoutSelector = select('#layoutSelector'); 
if (!layoutSelector) return;
const options = layoutSelector.elt.options;
for (let i=0;i<options.length;i++) {
 if (options[i].value==='2') {
   options[i].disabled = !(['Story','Post'].includes(posterSize));
 }
}
}

function validateTextLength() {
updateWrappedText();
}

function calculateScaleRatio() {
 if (isMobile) {
   // Mobile: use available screen space
   const posterArea = select('#mobilePosterArea');
   let availableWidth = windowWidth - 20;
   let availableHeight = windowHeight - 90; // Icon bar height
   
   if (activeMobilePanel) {
     availableHeight = availableHeight * 0.6; // Shrink when panel open
   }
   
   const posterWidth = posterSizes[posterSize].width;
   const posterHeight = posterSizes[posterSize].height;
   
   const widthRatio = availableWidth / posterWidth;
   const heightRatio = availableHeight / posterHeight;
   
   scaleRatio = Math.min(widthRatio, heightRatio, 0.9);
   scaleRatio = Math.max(scaleRatio, 0.1);
 } else {
   // Desktop logic (keep existing)
   let availableWidth = windowWidth - 450;
   if (windowWidth <= 1200) availableWidth = windowWidth - 100;
   const availableHeight = windowHeight - 150;

   const posterWidth = posterSizes[posterSize].width;
   const posterHeight = posterSizes[posterSize].height;

   const widthRatio = availableWidth / posterWidth;
   const heightRatio = availableHeight / posterHeight;

   const maxScale = 0.5;
   scaleRatio = Math.min(widthRatio, heightRatio, maxScale);
   scaleRatio = Math.max(scaleRatio, 0.1);
 }
}

function updateCanvasSize() {
canvasW = posterSizes[posterSize].width  * scaleRatio;
canvasH = posterSizes[posterSize].height * scaleRatio;
if (typeof resizeCanvas === 'function') resizeCanvas(canvasW, canvasH);
adjustContainerForPosterSize();
}

function windowResized() { 
calculateScaleRatio(); 
updateCanvasSize(); 
}

function adjustContainerForPosterSize() {
const editor = select('#editorContainer'); 
if (!editor) return;
if (posterSize==='Landscape') {
 editor.addClass('landscape-mode'); 
} else {
 editor.removeClass('landscape-mode');
}
}

function applyRGFFontToHeaders() {
if (!fontsLoaded) return;
const heads = selectAll('h1, h2, h3, h4, h5, h6'); 
for (const h of heads) h.addClass('rgf-font');
const labels= selectAll('.label'); 
for (const l of labels) l.addClass('rgf-font');
}

function updateSelectedColorIndicator() {
for (const col in colorButtons) {
 colorButtons[col].removeClass('selected');
}
if (colorButtons[bgColor]) {
 colorButtons[bgColor].addClass('selected');
}
}

function updateLineLimitDisplay() {
const lineLabel = select('#lineLimit');
if (lineLabel) lineLabel.html(`Main Text:`);
}

function initializeSliderPositions() {
setTimeout(()=>{
 const sizePercent = (1-0.5)/1.5;
 const sImg = select('#sizeSliderContainer img'); 
 if (sImg) sImg.style('left', (sizePercent*100)+'%');
 
 const xPercent = (illustrationX/scaleRatio + 2160)/4320;
 const xImg = select('#illuSliderContainer img'); 
 if (xImg) xImg.style('left', (xPercent*100)+'%');
 
 const yPercent = (illustrationY/scaleRatio + 1080)/2160;
 const yImg = select('#illuYSliderContainer img'); 
 if (yImg) yImg.style('left', (yPercent*100)+'%');
},100);
}

function setupEventListeners() {
const sizeSelector = select('#posterSizeSelector');
if (sizeSelector) {
 sizeSelector.changed(()=>{
   posterSize = sizeSelector.value();
   calculateScaleRatio(); 
   updateCanvasSize();
   updateLineLimitDisplay(); 
   updateWrappedText(); 
   validateTextLength();
 });
}
window.addEventListener('resize', windowResized);
}

function addStyles() {
const style = document.createElement('style');
style.textContent = `
 @font-face {
   font-family: 'RGFDare';
   src: url('assets/Fonts/RGFDare-Regular.otf') format('opentype');
   font-weight: normal;
   font-style: normal;
 }
 @font-face {
   font-family: 'Helvetica Neue LT Pro';
   src: url('assets/Fonts/HelveticaNeueLTPro-Roman.ttf') format('truetype');
   font-weight: normal;
   font-style: normal;
 }
 body { 
   margin:0; 
   padding:0; 
   overflow-x:hidden; 
   overflow-y:auto; 
   background-color:#f5f5f5; 
 }
 select { 
   padding: 12px 60px 12px 12px !important; 
   appearance: none;
   -webkit-appearance: none;
   -moz-appearance: none;
   background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
   background-repeat: no-repeat;
   background-position: right 15px center;
   background-size: 18px;
 }
 .rgf-font { 
   font-family:'RGFDare', sans-serif !important; 
 }
 .color-button-container { 
   position:relative; 
   display:inline-block; 
   margin:5px; 
 }
 .color-button { 
   width:40px; 
   height:40px; 
   border:none; 
   border-radius:6px; 
   cursor:pointer; 
 }
 .selected-indicator { 
   position:absolute; 
   top:-10px; 
   left:-10px; 
   width:60px; 
   height:60px; 
   pointer-events:none; 
   display:none; 
   transform:scale(0.6); 
 }
 .selected .selected-indicator { 
   display:block; 
 }
 .ui-section { 
   margin-bottom:15px; 
 }
 .poster-thumbnail { 
   width:100%; 
   cursor:pointer; 
   transition: transform 0.2s;
 }
 .poster-thumbnail:hover {
   transform: scale(1.02);
 }
 .poster-thumbnail img { 
   width:100%; 
   height:auto; 
   display:block; 
 }
 .poster-thumbnail.landscape { 
   grid-column:1 / -1; 
 }
 #posterGrid { 
   display:grid; 
   grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); 
   grid-gap:20px; 
   grid-auto-rows:auto; 
   width:100%; 
   padding:20px; 
 }
 #uiPanel { 
   width:350px; 
   min-width:350px; 
   position:sticky; 
   top:20px; 
   align-self:flex-start; 
 }
 #canvasContainer { 
   display:flex; 
   justify-content:center; 
   align-items:center; 
   min-width:0; 
 }
 canvas { 
   max-width:100%; 
   height:auto !important; 
   object-fit:contain; 
 }
 #editorContainer.landscape-mode { 
   max-width:1600px; 
 }
 select option:disabled { 
   color:#999; 
   font-style:italic; 
 }

 /* Custom scrollbar for poster wall */
 #wallContainer::-webkit-scrollbar { 
   width: 10px; 
 }
 #wallContainer::-webkit-scrollbar-track { 
   background: #f1f1f1; 
   border-radius: 5px; 
 }
 #wallContainer::-webkit-scrollbar-thumb { 
   background: #2737A2; 
   border-radius: 5px; 
 }
 #wallContainer::-webkit-scrollbar-thumb:hover { 
   background: #db48ff; 
 }

 /* Mobile icon bar styles */
 .mobile-icon-button {
   user-select: none;
   -webkit-tap-highlight-color: transparent;
 }
 
 .mobile-panel {
   animation: slideUp 0.3s ease;
 }
 
 @keyframes slideUp {
   from {
     opacity: 0;
     transform: translateY(20px);
   }
   to {
     opacity: 1;
     transform: translateY(0);
   }
 }

 @media (max-width:1200px){
   #editorContainer{ 
     flex-direction:column; 
     align-items:center; 
     padding-bottom: 60px; 
   }
   #uiPanel{ 
     width:100%; 
     max-width:600px; 
     margin-bottom:15px; 
     position:static; 
   }
 }
 
 @media (max-width:768px){
   #editorContainer {
     display: none !important;
   }
   
   #wallContainer {
     display: none !important;
   }
   
   #posterGrid{ 
     grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); 
   }
 }
`;
document.head.appendChild(style);
}

function enforceLayoutRestrictions() {
if (layout===3) layout=1;
if (layout===2 && !(posterSize==='Story'||posterSize==='Post')) layout=1;
const layoutSelector = select('#layoutSelector'); 
if (layoutSelector) layoutSelector.value(layout);
}

// Fixed height calculator for Wix embed
function _dwGetDesiredHeight(pad = 0) {
const editor = document.getElementById('editorContainer');

if (!editor) {
 return 1700 + pad;
}

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

// Add error boundary
window.addEventListener('error', (event) => {
console.error('Global error:', event.error);
event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
console.error('Unhandled promise rejection:', event.reason);
event.preventDefault();
});
