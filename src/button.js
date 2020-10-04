import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const buttonMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.BackSide,
});

export default class Button {
    constructor(pos, size) {
        this.type = 'button';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.sprite = new Sprite(buttonMaterial, this.geometry);
        this.collisionSize = size;
        this.offset = 0;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y-1, 0);
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    collide(other, diff) {
        if (other.type == 'player' && diff.y > 0) {
            this.pos.y += .1;
            this.offset += .1;
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}