import * as THREE from 'three';

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