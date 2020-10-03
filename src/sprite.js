import * as THREE from 'three';

//TODO: use standard block width
const planeGeometry = new THREE.PlaneGeometry(32, 32);

export default class Sprite {
    constructor(material, geometry) {
        this.mesh = new THREE.Mesh(geometry || planeGeometry, material);
        this.texture = new THREE.Texture();
    }
}