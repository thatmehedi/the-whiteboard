const canvas = document.querySelector('#board');
const context = canvas.getContext('2d');
const hint = document.querySelector('#emptyHint');

let drawing = false;
let color = '#242328';
let size = 5;
let tool = 'pen';
const history = [];

function saveHistory() {
  history.push(context.getImageData(0, 0, canvas.width, canvas.height));
  if (history.length > 30) history.shift();
}

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const snapshot = canvas.width ? context.getImageData(0, 0, canvas.width, canvas.height) : null;
  canvas.width = Math.floor(bounds.width * devicePixelRatio);
  canvas.height = Math.floor(bounds.height * devicePixelRatio);
  context.scale(devicePixelRatio, devicePixelRatio);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  if (snapshot) context.putImageData(snapshot, 0, 0);
}

function pointFromEvent(event) {
  const bounds = canvas.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function startDrawing(event) {
  const point = pointFromEvent(event);
  if (tool === 'text') {
    const words = window.prompt('What would you like to write?');
    if (words) {
      saveHistory();
      context.fillStyle = color;
      context.font = `700 ${Math.max(18, size * 5)}px Nunito, sans-serif`;
      context.fillText(words, point.x, point.y);
      hint.hidden = true;
    }
    return;
  }
  drawing = true;
  hint.hidden = true;
  saveHistory();
  context.beginPath();
  context.moveTo(point.x, point.y);
  canvas.setPointerCapture(event.pointerId);
}

function draw(event) {
  if (!drawing) return;
  const point = pointFromEvent(event);
  context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
  context.strokeStyle = color;
  context.lineWidth = tool === 'eraser' ? size * 4 : size;
  context.lineTo(point.x, point.y);
  context.stroke();
}

function stopDrawing() {
  drawing = false;
  context.closePath();
  context.globalCompositeOperation = 'source-over';
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);
document.querySelectorAll('[data-tool]').forEach((button) => {
  button.addEventListener('click', () => {
    tool = button.dataset.tool;
    document.querySelectorAll('[data-tool]').forEach((item) => item.classList.toggle('active', item === button));
    canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
  });
});
document.querySelectorAll('[data-color]').forEach((button) => {
  button.addEventListener('click', () => {
    color = button.dataset.color;
    document.querySelectorAll('[data-color]').forEach((item) => item.classList.toggle('active', item === button));
  });
});
document.querySelector('#size').addEventListener('input', (event) => { size = Number(event.target.value); });
document.querySelector('#undo').addEventListener('click', () => {
  const previous = history.pop();
  if (previous) context.putImageData(previous, 0, 0);
});
document.querySelector('#clear').addEventListener('click', () => {
  if (!window.confirm('Clear everything from the board?')) return;
  saveHistory();
  context.clearRect(0, 0, canvas.width, canvas.height);
  hint.hidden = false;
});
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
