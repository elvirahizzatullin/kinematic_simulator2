const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.ArcRotateCamera(
  'camera',
  -Math.PI / 4,
  Math.PI / 3,
  80,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

let ball = null;
let currentTrajectory = null;
let allTrajectories = [];
let points = [];
let index = 0;

function computeTrajectory(v0, thetaDeg, phiDeg, y0, g) {

  const theta = thetaDeg * Math.PI / 180;
  const phi   = phiDeg   * Math.PI / 180;

  const v0x = v0 * Math.cos(theta) * Math.cos(phi);
  const v0y = v0 * Math.sin(theta);
  const v0z = v0 * Math.cos(theta) * Math.sin(phi);

  const discriminant = v0y * v0y + 2 * g * y0;
  if (discriminant < 0) return null;

  const T = (v0y + Math.sqrt(discriminant)) / g;

  const N = 500;
  const dt = T / N;

  const pts = [];

  for (let i = 0; i <= N; i++) {
    const t = i * dt;

    const x = v0x * t;
    const y = Math.max(0, y0 + v0y * t - 0.5 * g * t * t);
    const z = v0z * t;

    pts.push(new BABYLON.Vector3(x, y, z));
  }

  return pts;
}
function run() {
  const v0 = +document.getElementById('v0').value;
  const theta = +document.getElementById('theta').value;
  const phi = +document.getElementById('phi').value;
  const y0 = +document.getElementById('y0').value;
  const g = +document.getElementById('g').value;

  if (v0 <= 0 || g <= 0) return;

  const result = computeTrajectory(v0, theta, phi, y0, g);
  if (!result) return;

  points = result;

  if (currentTrajectory) {
    allTrajectories.push(currentTrajectory);
  }

  if (ball) ball.dispose();
  ball = BABYLON.MeshBuilder.CreateSphere('ball', { diameter: 1.5 }, scene);

  index = 0;
}