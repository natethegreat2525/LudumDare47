import * as THREE from 'three';
import { BLOCK_WIDTH } from './constants';

//TODO: use standard block width
const planeGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);

export default class Sprite {
    constructor(material, geometry) {
        this.mesh = new THREE.Mesh(geometry || planeGeometry, material);
    }
}