import * as THREE from 'three';
import World from './world';
import { Mouse } from './mouse';

const canvas = document.getElementById("game-canvas");
const menuCanvas = document.getElementById("menu-canvas");
const transitionCanvas = document.getElementById("transition-canvas");
const renderer = new THREE.WebGLRenderer({canvas});
const menuRenderer = menuCanvas.getContext("2d");
const transitionRenderer = transitionCanvas.getContext("2d");

let world;
function initWorld() {
  world = new World(canvas.width, canvas.height);
}

let inMenu = true;
let inTransition = false;
let transitionIn = false;
let transitionWait = false;
let transitionOut = false;
let transitionTimer = 0;
let transitionAlpha = 0;
let menuFade = 0;

window.addEventListener('keydown', (e) => {
  if (inMenu && menuFade === 0) {
    menuFade = 1;
    world.paused = false;
  }
  if (!inMenu && !inTransition) {
    if (e.key === 'r') {
      initWorld();
    }
  }
});

Mouse.init(window);

let levels = [
  'Let It Sink In',
  'Gravel Pit',
  'Vines',
  'Blue Thumb',
  'Turtle Whisperer',
  'Never Accept The First Offer',
  'Mountain Climber',
  'Binary Canary',
  'aMAZEing',
  'Picky',
  'Never Accept The Second Offer',
  'Meta',
];

let lastLevel = 0;

let found = new Array(12);
found.fill(false);

let oldTime = 0;
function render(newTime) {
  if (inMenu) {
    if (menuFade > 0) {
      menuFade++;
    }
    menuCanvas.style.opacity = 1-(menuFade/65);
    if (menuFade >= 65) {
      inMenu = false;
    }
    menuRenderer.clearRect(0,0,1200,800);
    menuRenderer.fillStyle = 'black';
    menuRenderer.fillRect(400, 300, 400, 200);
    menuRenderer.fillStyle = 'white';
    menuRenderer.font = "10px Arial";
    menuRenderer.fillText("Wisdom is not a product of schooling, but of the lifelong attempt to acquire it.", 433, 450);
    menuRenderer.fillText("-Albert Einstein", 703, 470);
    menuRenderer.font = "bold 50px Arial";
    menuRenderer.fillText("SEEKER", 495, 360);
  }

  if (inTransition) {
    if (transitionIn) {
      transitionAlpha += .05
      if (transitionAlpha >= 1) {
        transitionIn = false;
        transitionWait = true;
        transitionTimer = 200;
      }
    }
    if (transitionWait) {
      transitionTimer--;
      if (transitionTimer <= 0) {
        transitionOut = true;
        transitionWait = false;
        initWorld();
      }
    }
    if (transitionOut) {
      transitionAlpha -= .05;
      if (transitionAlpha <= 0) {
        transitionOut = false;
        inTransition = false;
        world.paused = false;
      }
      
    }
    transitionCanvas.style.opacity = transitionAlpha;
    transitionRenderer.fillStyle = 'black';
    transitionRenderer.fillRect(0,0,1200,800);
    transitionRenderer.fillStyle = 'white';
    transitionRenderer.font = "bold 50px Arial";
    transitionRenderer.fillText('Endings Found:', 395, 260);
    for (let i = 0; i < 12; i++) {
      transitionRenderer.fillStyle = 'white';
      transitionRenderer.font = "20px Arial";
      if (i === lastLevel) {
        transitionRenderer.font = "bold 20px Arial";
        transitionRenderer.fillStyle = '#00bb00';
      }
      transitionRenderer.fillText((i+1) + ":   " + (found[i] ? levels[i] : '?'), 495, 360 + i*25);
    }
  }


  if (world.player.reset) {
    //TODO clean up old world assets
    world.player.reset = false;
    world.paused = true;
    inTransition = true;
    transitionIn = true;
    found[world.player.winLevel] = true;
    lastLevel = world.player.winLevel;
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
world.paused = true;
render();
