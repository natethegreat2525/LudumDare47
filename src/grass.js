import { BLOCK_WIDTH } from "./constants";
import Sprite from "./sprite";
import * as THREE from 'three';
import { spriteMaterials } from "./materials";

export default class Grass {
    constructor(x, y, flower) {
        this.geometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);
        this.sprite = new Sprite(spriteMaterials.grassEnt, this.geometry);
        this.sprite.mesh.position.set(x * BLOCK_WIDTH + BLOCK_WIDTH/2, y * BLOCK_WIDTH + BLOCK_WIDTH/2, 1);
        this.disturbed = 0;
        this.drag = 0;


        if (flower) {
            this.crushed = 0;
            this.flowerGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);
            this.flowerType = flower;
            if (flower === 'r') {
                this.flower = new Sprite(spriteMaterials.redFlower, this.flowerGeometry);
            } else if (flower === 'b') {
                this.flower = new Sprite(spriteMaterials.blueFlower, this.flowerGeometry);
            } else if (flower === 'y') {
                this.flower = new Sprite(spriteMaterials.yellowFlower, this.flowerGeometry);
            }
            this.flower.mesh.position.set(x * BLOCK_WIDTH + BLOCK_WIDTH/2, y * BLOCK_WIDTH + BLOCK_WIDTH/2, 2);
        }
    }

    initDisturb(drag) {
        this.disturbed = 1000;
        this.drag += drag;
        this.drag = Math.max(Math.min(this.drag, 20), -20);
    }

    disturb(world) {
        this.disturbed--;
        this.drag *= .99;
        this.geometry.vertices[2].set(-BLOCK_WIDTH/2+this.drag, -BLOCK_WIDTH/2, 1);
        this.geometry.vertices[3].set(BLOCK_WIDTH/2+this.drag, -BLOCK_WIDTH/2, 1);
        this.geometry.verticesNeedUpdate = true;

        if (this.flower) {
            this.crushed += Math.abs(this.drag)*.001;
            this.crushed = Math.min(1.5, this.crushed);
            if (this.crushed > 1) {
                if (this.flowerType === 'r' && !world.redCrushed) {
                    world.redCrushed = world.ticks;
                }
                if (this.flowerType === 'b' && !world.blueCrushed) {
                    world.blueCrushed = world.ticks;
                }
                if (this.flowerType === 'y' && !world.yellowCrushed) {
                    world.yellowCrushed = world.ticks;
                }
            }
            this.flowerGeometry.vertices[2].set(-BLOCK_WIDTH/2+this.drag, (1-this.crushed)*-BLOCK_WIDTH/2, 1);
            this.flowerGeometry.vertices[3].set(BLOCK_WIDTH/2+this.drag, (1-this.crushed)*-BLOCK_WIDTH/2, 1);
            this.flowerGeometry.verticesNeedUpdate = true;
       }
    }
}