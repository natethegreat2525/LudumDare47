import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';


const playerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.BackSide,
});

const playerGeometry = new THREE.PlaneGeometry(28, 48);

export default class Player {
    constructor(pos) {
        this.type = 'player';
        this.pos = pos;
        this.physics = true;
        this.dynamic = true;
        this.vel = new THREE.Vector2(0, 2);
        this.forces = new THREE.Vector2(0, 0);
        this.grounded = false;
        this.deleteFlag = false;
        this.sprite = new Sprite(playerMaterial, playerGeometry);
        this.collisionSize = new THREE.Vector2(28, 48);

        this.climbing = false;
        this.isOnVine = false;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, 0);

        this.vel.x = 0;
        if (Key.isDown(Key.RIGHT)) {
            this.vel.x = 4;
        }
        if (Key.isDown(Key.LEFT)) {
            this.vel.x = -4;
        }
        
        if (!this.isOnVine) {
            this.climbing = false;
        }
        
        if (this.climbing) {
            this.vel.y = 0;
        }
        if (Key.isDown(Key.DOWN) && this.climbing) {
            this.vel.y = 2;
        }
        if (Key.isDown(Key.UP)) {
            if (this.isOnVine) {
                this.climbing = true;
                this.vel.y = -2;
            }
            if (!this.climbing && this.grounded && this.vel.y >= 0) {
                this.vel.y = -15;
            }
        }
        this.isOnVine = false;
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    collide(other) {
        if (other.type === 'vine') {
            this.isOnVine = true;
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}