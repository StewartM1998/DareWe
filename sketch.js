async function savePosterMobile() {
if (isSharing) {
  console.log('Share already in progress');
  return;
}

isSharing = true;
console.log('Starting save...');

try {
  const originalScaleRatio = scaleRatio;
  const originalCanvasW = canvasW;
  const originalCanvasH = canvasH;
  
  scaleRatio = 1;
  const fullWidth = posterSizes[posterSize].width;
  const fullHeight = posterSizes[posterSize].height;
  
  console.log('Resizing to full resolution:', fullWidth, 'x', fullHeight);
  resizeCanvas(fullWidth, fullHeight);
  redraw();
  
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const dataUrl = canvas.elt.toDataURL('image/jpeg', 0.98);
  
  scaleRatio = originalScaleRatio;
  canvasW = originalCanvasW;
  canvasH = originalCanvasH;
  resizeCanvas(canvasW, canvasH);
  redraw();
  
  console.log('Image captured, starting download...');
  
  // Direct download - works in all iframes
  const fileName = `dare-we-poster-${posterSize}-${Date.now()}.jpg`;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  
  // For iOS - open in new tab if download doesn't work
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    link.target = '_blank';
  }
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('Download triggered');
  
} catch (error) {
  console.log('Error:', error.message);
  scaleRatio = 0.5;
  calculateScaleRatio();
  updateCanvasSize();
  redraw();
} finally {
  setTimeout(() => {
    isSharing = false;
  }, 500);
}
}
