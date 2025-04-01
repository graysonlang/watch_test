import index_html from './index.html' assert { type: 'html' };
// import image_a from './336699.png' assert { type: 'png' };
// import image_b from './6699cc.png' assert { type: 'png' };
export function getFilePaths() {
  return {
    index_html,
    // image_a,
    // image_b,
  };
}

const imageFiles = [
  './336699.png',
  './6699cc.png',
];

async function loadImage(src) {
  const image = new Image();
  image.src = src;
  await new Promise(x => image.onload = x);
  return image;
}

window.addEventListener("load", async () => {
  let currentIndex = 0;
  let srcImage;
  const delay_in_ms = 500;
  async function timerFunc() {
    const path = imageFiles[currentIndex];
    console.log(`Loading image: ${path}`);
    srcImage = await loadImage(path);
    currentIndex = (currentIndex + 1) % imageFiles.length;
    setTimeout(timerFunc, delay_in_ms);
  }
  setTimeout(timerFunc, delay_in_ms);
});
