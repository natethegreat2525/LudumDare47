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

function render() {
  if (world.player.reset) {
    initWorld();
  }
  for (let i = 0; i < 10; i++) {
    world.update(.1);
  }
  world.render(renderer);
  requestAnimationFrame(render);
}

initWorld();
render();
