import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const dirtTexture = loader.load('./Basic_Ground_Filler_Pixel.png');
dirtTexture.flipY = false;
const dirtCrackedTexture = loader.load('./Basic_Ground_Filler_Cracked.png');
dirtCrackedTexture.flipY = false;
const topTexture = loader.load('./Basic_Ground_Top_Pixel.png');
topTexture.flipY = false;
const buttonTexture = loader.load('./Basic_Ground_Top_Pixel_Button.png');
buttonTexture.flipY = false;
buttonTexture.repeat.set(5, 1);
buttonTexture.wrapS = THREE.RepeatWrapping;
const topCrackedTexture = loader.load('./Basic_Ground_Top_Cracked.png');
topCrackedTexture.flipY = false;
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
const redDoor = loader.load('./red_door.png');
redDoor.flipY = false;
const yellowDoor = loader.load('./yellow_door.png');
yellowDoor.flipY = false;
const vine = loader.load('./vine.png');
vine.flipY = false;

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
        map: dirtCrackedTexture,
        side: THREE.BackSide,
    }),
    grassCracked: new THREE.MeshBasicMaterial({
        map: topCrackedTexture,
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
    vine: new THREE.MeshBasicMaterial({
        transparent: true,
        map: vine,
        side: THREE.BackSide,
    })
};