import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const dirtTexture = loader.load('./Basic_Ground_Filler_Pixel.png');
dirtTexture.flipY = false;
const dirtCrackedTexture = loader.load('./Basic_Ground_Filler_Cracked.png');
dirtCrackedTexture.flipY = false;
const dirtCrackedTexture2 = loader.load('./Basic_Ground_Filler_Cracked2.png');
dirtCrackedTexture2.flipY = false;
const topTexture = loader.load('./Basic_Ground_Top_Pixel.png');
topTexture.flipY = false;
const buttonTexture = loader.load('./Basic_Ground_Top_Pixel_Button.png');
buttonTexture.flipY = false;
buttonTexture.repeat.set(5, 1);
buttonTexture.wrapS = THREE.RepeatWrapping;
const topCrackedTexture = loader.load('./Basic_Ground_Top_Cracked.png');
topCrackedTexture.flipY = false;
const topCrackedTexture2 = loader.load('./Basic_Ground_Top_Cracked2.png');
topCrackedTexture2.flipY = false;
const grassTexture = loader.load('./grass.png');
grassTexture.flipY = false;
const blueFlower = loader.load('./blue_flower.png');
blueFlower.flipY = false;
const redFlower = loader.load('./red_flower.png');
redFlower.flipY = false;
const yellowFlower = loader.load('./yellow_flower.png');
yellowFlower.flipY = false;
const blueDoor = loader.load('./blue_door.png');
blueDoor.flipY = false;
const antiBlueDoor = loader.load('./anti_blue_door.png');
antiBlueDoor.flipY = false;
const redDoor = loader.load('./red_door.png');
redDoor.flipY = false;
const yellowDoor = loader.load('./yellow_door.png');
yellowDoor.flipY = false;
const vine = loader.load('./vine.png');
vine.flipY = false;
const defaultDoor = loader.load('./door.png');
defaultDoor.flipY = false;
const dirt5Tall = loader.load('./dirt_5.png');
dirt5Tall.flipY = false;
dirt5Tall.repeat.set(7,1);
dirt5Tall.wrapS = THREE.RepeatWrapping;
const clickText = loader.load('./click_text.png');
clickText.flipY = false;
const bigTree = loader.load('./tree.png');
bigTree.flipY = false;

const cloud1 = loader.load('./cloud1.png');
cloud1.flipY = false;
const cloud2 = loader.load('./cloud2.png');
cloud2.flipY = false;
const cloud3 = loader.load('./cloud3.png');
cloud3.flipY = false;
const bird = loader.load('./bird.png');
bird.flipY = false;
const note1 = loader.load('./note1.png');
note1.flipY = false;
const note2 = loader.load('./note2.png');
note2.flipY = false;
const turtle = loader.load('./turtle.png');
turtle.flipY = false;

const reset = loader.load('./reset.png');
reset.flipY = false;

const gradient = loader.load('./gradient_black.png');
gradient.flipY = false;
export const spriteMaterials = {
    dirt: new THREE.MeshBasicMaterial({
        map: dirtTexture,
        side: THREE.BackSide,
    }),
    grass: new THREE.MeshBasicMaterial({
        map: topTexture,
        side: THREE.BackSide,
    }),
    button: new THREE.MeshBasicMaterial({
        map: buttonTexture,
        side: THREE.BackSide,
    }),
    dirtCracked: new THREE.MeshBasicMaterial({
        transparent: true,
        map: dirtCrackedTexture,
        side: THREE.BackSide,
    }),
    dirtCracked2: new THREE.MeshBasicMaterial({
        map: dirtCrackedTexture2,
        transparent: true,
        side: THREE.BackSide,
    }),
    grassCracked: new THREE.MeshBasicMaterial({
        map: topCrackedTexture,
        side: THREE.BackSide,
    }),
    grassCracked2: new THREE.MeshBasicMaterial({
        map: topCrackedTexture2,
        side: THREE.BackSide,
    }),
    grassEnt: new THREE.MeshBasicMaterial({
        transparent: true,
        map: grassTexture,
        side: THREE.BackSide,
    }),
    yellowFlower: new THREE.MeshBasicMaterial({
        transparent: true,
        map: yellowFlower,
        side: THREE.BackSide,
    }),
    redFlower: new THREE.MeshBasicMaterial({
        transparent: true,
        map: redFlower,
        side: THREE.BackSide,
    }),
    blueFlower: new THREE.MeshBasicMaterial({
        transparent: true,
        map: blueFlower,
        side: THREE.BackSide,
    }),
    yellowDoor: new THREE.MeshBasicMaterial({
        transparent: true,
        map: yellowDoor,
        side: THREE.BackSide,
    }),
    redDoor: new THREE.MeshBasicMaterial({
        transparent: true,
        map: redDoor,
        side: THREE.BackSide,
    }),
    blueDoor: new THREE.MeshBasicMaterial({
        transparent: true,
        map: blueDoor,
        side: THREE.BackSide,
    }),
    antiBlueDoor: new THREE.MeshBasicMaterial({
        transparent: true,
        map: antiBlueDoor,
        side: THREE.BackSide,
    }),
    vine: new THREE.MeshBasicMaterial({
        transparent: true,
        map: vine,
        side: THREE.BackSide,
    }),
    defaultDoor: new THREE.MeshBasicMaterial({
        transparent: true,
        map: defaultDoor,
        side: THREE.BackSide,
    }),
    dirt5Tall: new THREE.MeshBasicMaterial({
        transparent: true,
        map: dirt5Tall,
        side: THREE.BackSide,
    }),
    waterDrop: new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        side: THREE.BackSide,
    }),
    clickText: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: clickText,
        side: THREE.BackSide,
    }),
    bigTree: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: bigTree,
        side: THREE.BackSide,
    }),
    waterBlock: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: .4,
        color: 0x0066ff,
        side: THREE.BackSide,
    }),
    cloud1: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: .8,
        map: cloud1,
        side: THREE.BackSide,
    }),
    cloud2: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: .8,
        map: cloud2,
        side: THREE.BackSide,
    }),
    cloud3: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: .8,
        map: cloud3,
        side: THREE.BackSide,
    }),
    note1: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: note1,
        side: THREE.BackSide,
    }),
    note2: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: note2,
        side: THREE.BackSide,
    }),
    turtle: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: turtle,
        side: THREE.BackSide,
    }),
    bird: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: bird,
        side: THREE.BackSide,
    }),
    gradient: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        map: gradient,
        side: THREE.BackSide,
    }),
    reset: new THREE.MeshBasicMaterial({
        map: reset,
        side: THREE.BackSide,
    }),
};