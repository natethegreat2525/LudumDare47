import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';

const GRAVITY = 0.7;

const playerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.BackSide,
});

const playerGeometry = new THREE.PlaneGeometry(28, 48);

export default class Player {
    constructor(pos) {
        this.pos = pos;
        this.vel = new THREE.Vector2(0, 2);
        this.forces = new THREE.Vector2(0, 0);
        this.grounded = false;
        this.deleteFlag = false;
        this.sprite = new Sprite(playerMaterial, playerGeometry);
        this.collisionSize = new THREE.Vector2(28, 48);
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, 0);

        this.forces.y += GRAVITY;
        this.pos.add(this.vel.clone().multiplyScalar(dt));
        this.vel.add(this.forces.multiplyScalar(dt));
        this.forces = new THREE.Vector2(0, 0);

        this.vel.x = 0;
        if (Key.isDown(Key.RIGHT)) {
            this.vel.x = 5;
        }
        if (Key.isDown(Key.LEFT)) {
            this.vel.x = -5;
        }
        if (Key.isDown(Key.UP) && this.grounded && this.vel.y > 0) {
            this.vel.y = -15;
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}