import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const doorMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.BackSide,
});

const doorGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH*.66, BLOCK_WIDTH*1.5);

export default class Door {
    constructor(pos, level) {
        this.type = 'door';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = false;
        this.deleteFlag = false;
        this.sprite = new Sprite(doorMaterial, doorGeometry);
        this.collisionSize = new THREE.Vector2(BLOCK_WIDTH*.66, BLOCK_WIDTH*1.5);
        this.level = level;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y-1, -.1);
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