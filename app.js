const canvas = document.querySelector('#board');
const context = canvas.getContext('2d');
const hint = document.querySelector('#emptyHint');

let drawing = false;
let color = '#242328';
let size = 5;

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
  drawing = true;
  hint.hidden = true;
  const point = pointFromEvent(event);
  context.beginPath();
  context.moveTo(point.x, point.y);
  canvas.setPointerCapture(event.pointerId);
}

function draw(event) {
  if (!drawing) return;
  const point = pointFromEvent(event);
  context.strokeStyle = color;
  context.lineWidth = size;
  context.lineTo(point.x, point.y);
  context.stroke();
}

function stopDrawing() {
  drawing = false;
  context.closePath();
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
