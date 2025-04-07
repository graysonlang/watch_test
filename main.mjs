window.addEventListener("load", async () => {
  async function loadImage(src) {
    const image = new Image();
    image.src = src;
    await new Promise(x => image.onload = x);
    return image;
  }
  const imageFiles = [
    './336699.png',
    './6699cc.png',

    // 'http://localhost/336699.png',
    // 'http://localhost/6699cc.png',

    // "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/inbox_fill_baseline_n900_20dp.png",
    // "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/star_baseline_nv700_20dp.png",
  ];
  let currentIndex = 0;
  const delay_in_ms = 500;
  async function timerFunc() {
    const path = imageFiles[currentIndex];
    console.log(`Loading image: ${path}`);
    let srcImage = await loadImage(path);
    currentIndex = (currentIndex + 1) % imageFiles.length;
    setTimeout(timerFunc, delay_in_ms);
  }
  setTimeout(timerFunc, delay_in_ms);
});
