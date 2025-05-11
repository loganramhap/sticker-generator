const canvas = document.getElementById('stickerCanvas');
const ctx = canvas.getContext('2d');
const stickerSelect = document.getElementById('stickerSelect');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const modeSelect = document.getElementById('modeSelect');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const drawControls = document.getElementById('drawControls');
const textControls = document.getElementById('textControls');
const textInput = document.getElementById('textInput');
const textSize = document.getElementById('textSize');

let drawing = false;
let isDrawingMode = true;
let baseImage = new Image();

function loadSticker(filename) {
  baseImage.src = `stickers/${filename}`;
  baseImage.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  };
}

fetch('stickers/manifest.json')
  .then(res => res.json())
  .then(files => {
    files.forEach(filename => {
      const option = document.createElement('option');
      option.value = filename;
      option.textContent = filename;
      stickerSelect.appendChild(option);
    });
    if (files.length > 0) loadSticker(files[0]);
  });

stickerSelect.addEventListener('change', (e) => {
  loadSticker(e.target.value);
});

canvas.addEventListener('mousedown', (e) => {
  if (isDrawingMode) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  } else {
    const text = textInput.value.trim();
    const size = parseInt(textSize.value, 10);
    if (text) {
      ctx.font = `${size}px Arial`;
      ctx.fillStyle = colorPicker.value;
      ctx.fillText(text, e.offsetX, e.offsetY);
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (drawing && isDrawingMode) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = parseInt(brushSize.value, 10);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
});

clearBtn.addEventListener('click', () => {
  if (baseImage.src) {
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  }
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'signed-sticker.png';
  link.href = canvas.toDataURL();
  link.click();
});

modeSelect.addEventListener('change', () => {
  isDrawingMode = modeSelect.value === 'draw';
  drawControls.style.display = isDrawingMode ? 'inline-block' : 'none';
  textControls.style.display = isDrawingMode ? 'none' : 'inline-block';
});