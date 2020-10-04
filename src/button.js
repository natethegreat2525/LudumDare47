import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const buttonMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.BackSide,
});

const buttonGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);

export default class Button {
    constructor(pos) {
        this.type = 'button';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.sprite = new Sprite(buttonMaterial, buttonGeometry);
        this.collisionSize = new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH);
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
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}