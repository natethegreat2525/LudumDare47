import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const dirtTexture = loader.load('http://localhost:3000/Basic_Ground_Filler_Pixel.png');
dirtTexture.flipY = false;
const topTexture = loader.load('http://localhost:3000/Basic_Ground_Top_Pixel.png');
topTexture.flipY = false;
 
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
        color: 0x0000ff,
        side: THREE.BackSide,
    }),
};

/*
export const spriteMaterials = {
    dirt: new THREE.MeshBasicMaterial({
        color: 0x543210,
        side: THREE.BackSide,
    }),
    grass: new THREE.MeshBasicMaterial({
        color: 0x228822,
        side: THREE.BackSide,
    }),
    button: new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.BackSide,
    }),
};
*/