export const MATCH_PIXEL_RATIO = false;

export function configureCanvasDensity(canvas) {
  const context = canvas.getContext("2d", { colorSpace: "display-p3" });
  const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
  context.scale(pixelRatio, pixelRatio);
  canvas.width = canvas.width * pixelRatio;
  canvas.height = canvas.height * pixelRatio;
}

export function prepCanvas(src, canvas, scale = 1.0) {
  canvas.width = src.width;
  canvas.height = src.height;
  if (MATCH_PIXEL_RATIO) {
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    canvas.width = src.width / pixelRatio * scale;
    canvas.height = src.height / pixelRatio * scale;
    configureCanvasDensity(canvas);
  } else {
    canvas.width = src.width * scale;
    canvas.height = src.height * scale;
  }
  const context = canvas.getContext("2d", { colorSpace: "display-p3" });
  if (scale != 1.0) {
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  return context;
}

export function displayImage(image, canvas, scale = 1.0) {
  prepCanvas(image, canvas, scale).drawImage(image, 0, 0, image.width * scale, image.height * scale);
}


export async function loadImage(src) {
  const image = new Image();
  image.src = src;
  await new Promise(x => image.onload = x);
  return image;
}


import index_html from './index.html' assert { type: 'html' }
export function getFilePaths() {
  return {
    index_html,
  };
}

import image_a from './336699.png' assert { type: 'png' };
import image_b from './6699cc.png' assert { type: 'png' };
const imageFiles = [
  image_a,
  image_b,
];

let currentIndex = 0;
let srcImage;

window.addEventListener("load", async () => {
  const srcCanvas = document.body.appendChild(document.createElement('canvas'));
  srcCanvas.width = srcCanvas.height = 0;
  const delay_in_ms = 200;
  async function timerFunc() {
    currentIndex = (currentIndex + 1) % imageFiles.length;
    const path = imageFiles[currentIndex];
    console.log(`Loading image - ${path}`);
    srcImage = await loadImage(path);
    // displayImage(srcImage, srcCanvas);
    setTimeout(timerFunc, delay_in_ms);
  }
  setTimeout(timerFunc, delay_in_ms);
});
