// Import stylesheets
import './style.css';
import { createDrawer } from './drawer';
import { rayTracer } from './shader';
import { Cube, Object3d, Plane, Sphere } from './definitions';
import { objects3d } from './scene-objects';
const height = 500;
const width = 500;
let data: { numberOfRays: number; objects3d: Object3d[] };
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const numberOfRays = document.getElementById(
  'numberOfRays'
) as HTMLButtonElement;
const fpsElement = document.getElementById('fps') as HTMLSpanElement;
const renderButton = document.getElementById('render') as HTMLButtonElement;
const realyTimeRendering = document.getElementById(
  'animate'
) as HTMLButtonElement;
//setup
canvas.height = height;
canvas.width = width;
let ms = [0, 0];
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const image = new ImageData(height, width);
const drawer = createDrawer(image.data, [width, height], ms);
let shaderRunner = drawer.shader();
renderButton.addEventListener('click', () => {
  data.numberOfRays = +numberOfRays.value;
  shaderRunner(rayTracer, data);
});
realyTimeRendering.addEventListener('click', () => {
  realTimeRendering != realTimeRendering;
});
canvas.addEventListener('mousemove', (m) => {
  const x = (m.x / width) * -4 - 1;
  const y = (m.y / height) * -4 - 1;
  ms[0] = x;
  ms[1] = y;
});

let realTimeRendering = false;

let start,
  previousTimeStamp,
  frames = 0;
start = 0;
previousTimeStamp = 0;

data = {
  numberOfRays: +numberOfRays.value,
  objects3d,
};
function animate() {
  if (realTimeRendering) {
    shaderRunner(rayTracer, data);
  }
}
function step(timestampMs: number) {
  const elapsed = timestampMs - start;
  previousTimeStamp = elapsed;
  ctx.putImageData(image, 0, 0);
  animate();

  frames++;
  if (elapsed >= 1000) {
    // 1 second
    const fps = frames / (elapsed / 1000);
    fpsElement.innerHTML = `${fps.toFixed(2)}`;
    frames = 0;
    start = timestampMs;
  }

  requestAnimationFrame(step);
}
requestAnimationFrame(step);
