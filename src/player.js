import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import TextureAnimation from './texture-animation';

const GRAVITY = 0.7;

const loader = new THREE.TextureLoader();
const playerSpriteSheet = loader.load('http://localhost:3000/player-running.png');
playerSpriteSheet.flipY = false;
const playerMaterial = new THREE.MeshBasicMaterial({
    map: playerSpriteSheet,
    side: THREE.BackSide,
    transparent: true,
});
const playerGeometry = new THREE.PlaneGeometry(30, 60);

export default class Player {
    constructor(pos) {
        this.pos = pos;
        this.vel = new THREE.Vector2(0, 2);
        this.forces = new THREE.Vector2(0, 0);
        this.grounded = false;
        this.deleteFlag = false;
        this.texture = playerSpriteSheet;
        this.sprite = new Sprite(playerMaterial, playerGeometry);
        this.spriteAnimation = new TextureAnimation(playerSpriteSheet, 6, 10);
        this.collisionSize = new THREE.Vector2(28, 48);
    }

    update(world, dt) {
        this.spriteAnimation.update(this.texture, dt);
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