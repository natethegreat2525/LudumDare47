import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import TextureAnimation from './texture-animation';
import { BLOCK_WIDTH } from './constants';
import { footstepSound } from './sounds';

const loader = new THREE.TextureLoader();

const playerIdleSprite = loader.load('http://localhost:3000/player-idle.png');
playerIdleSprite.flipY = false;
const playerIdleMaterial = new THREE.MeshBasicMaterial({
    map: playerIdleSprite,
    side: THREE.BackSide,
    transparent: true,
});

const playerRunSprite = loader.load('http://localhost:3000/player-running.png');
playerRunSprite.flipY = false;
const playerRunMaterial = new THREE.MeshBasicMaterial({
    map: playerRunSprite,
    side: THREE.BackSide,
    transparent: true,
});

const IDLE_STATE    = 0; 
const RUN_STATE     = 1;
const CLIMB_STATE   = 2;

const playerGeometry = new THREE.PlaneGeometry(30, 60);

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
        this.xDirection = 1;
        this.textures = [
            playerIdleSprite,
            playerRunSprite
        ];
        this.sprites = [
            new Sprite(playerIdleMaterial, playerGeometry),
            new Sprite(playerRunMaterial, playerGeometry)
        ];
        this.currentState = IDLE_STATE;
        this.spriteAnimations = [
            new TextureAnimation(playerIdleSprite, 1, 100),
            new TextureAnimation(playerRunSprite, 6, 10)
        ];
        this.collisionSize = new THREE.Vector2(28, 48);

        this.climbing = false;
        this.isOnVine = false;

        this.wasGrounded = false;
        this.reset = false;
    }

    update(world, dt) {
        world.scene.remove(this.sprites[this.currentState].mesh);
        this.sprites[this.currentState].mesh.position.set(this.pos.x, this.pos.y, 0);
        this.currentState = IDLE_STATE;
        if ((this.vel.x !== 0 && this.grounded) || (!this.wasGrounded && this.grounded)) {
            if (footstepSound.paused) {
                footstepSound.play();
            }
        }
        this.vel.x = 0;
        if (Key.isDown(Key.RIGHT)) {
            this.vel.x = 4;
            this.xDirection = 1;
            this.currentState = RUN_STATE;
        }
        if (Key.isDown(Key.LEFT)) {
            this.vel.x = -4;
            this.xDirection = -1;
            this.currentState = RUN_STATE;
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
        this.wasGrounded = this.grounded;
        this.isOnVine = false;
        this.spriteAnimations[this.currentState].update(this.textures[this.currentState], dt, this.xDirection);
        world.scene.add(this.sprites[this.currentState].mesh);
    }

    init(world) {
        for (let i = 0; i < this.sprites.length; i++) {
            world.scene.add(this.sprites[i].mesh);
        }
    }

    collide(other) {
        if (other.type === 'vine') {
            this.isOnVine = true;
        }
        if (other.type === 'door') {
            if (this.grounded) {
                
                console.log('You win level', other.level);
                this.reset = true;
            }
        }
    }

    tearDown(world) {
        for (let i = 0; i < this.sprites.length; i++) {
            world.scene.remove(this.sprites[i].mesh);
        }
    }
}