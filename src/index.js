import * as THREE from 'three';
import World from './world';
import { Mouse } from './mouse';

const canvas = document.getElementById("game-canvas");
const renderer = new THREE.WebGLRenderer({canvas});

let world;
function initWorld() {
  world = new World(canvas.width, canvas.height);
}

Mouse.init(window);

let oldTime = 0;
function render(newTime) {
  if (world.player.reset) {
    //TODO clean up old world assets
    initWorld();
  }
  let delta = newTime - oldTime;
  oldTime = newTime;
  if (isNaN(delta)) {
    delta = 16.66
  }
  for (let i = 0; i < 10; i++) {
    world.update(Math.max(Math.min(.2, delta * 6 / 1000), .05));
  }
  world.render(renderer);
  requestAnimationFrame(render);
}

initWorld();
render();
