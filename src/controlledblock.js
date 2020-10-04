import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const controlledMaterial = new THREE.MeshBasicMaterial({
    color: 0x555555,
    side: THREE.BackSide,
});

export default class ControlledBlock {
    constructor(pos, size, controller, material) {
        this.type = 'controlledblock';
        this.originalPos = pos.clone();
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.sprite = new Sprite(material || controlledMaterial, this.geometry);
        this.collisionSize = size;
        this.controller = controller;
        this.offset = new THREE.Vector2();
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, -3);
        this.offset = this.controller();
        this.pos = this.originalPos.clone().add(this.offset);
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    collide(other, diff) {
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}