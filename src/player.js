import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import TextureAnimation from './texture-animation';
import { BLOCK_WIDTH } from './constants';
import { footstepSound } from './sounds';
import { Mouse } from './mouse';
import Particle from './particle';
import { spriteMaterials } from './materials';

const loader = new THREE.TextureLoader();

const playerIdleSprite = loader.load('./player-idle.png');
playerIdleSprite.flipY = false;
const playerIdleMaterial = new THREE.MeshBasicMaterial({
    map: playerIdleSprite,
    side: THREE.BackSide,
    transparent: true,
});

const playerRunSprite = loader.load('./player-running.png');
playerRunSprite.flipY = false;
const playerRunMaterial = new THREE.MeshBasicMaterial({
    map: playerRunSprite,
    side: THREE.BackSide,
    transparent: true,
});

const playerClimbSprite = loader.load('./player-climbing.png');
playerClimbSprite.flipY = false;
const playerClimbMaterial = new THREE.MeshBasicMaterial({
    map: playerClimbSprite,
    side: THREE.BackSide,
    transparent: true,
});

const playerJumpSprite = loader.load('./player-jump.png');
playerJumpSprite.flipY = false;
const playerJumpMaterial = new THREE.MeshBasicMaterial({
    map: playerJumpSprite,
    side: THREE.BackSide,
    transparent: true,
});

const IDLE_STATE    = 0; 
const RUN_STATE     = 1;
const JUMP_STATE    = 2;
const CLIMB_STATE   = 3;

const playerGeometry = new THREE.PlaneGeometry(30, 60);

const noteColors = [
    0xff0000, 0xff00ff, 0xffff00,
    0x00ff00, 0x0000ff,
]

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
            playerRunSprite,
            playerJumpSprite,
            playerClimbSprite,
        ];
        this.sprites = [
            new Sprite(playerIdleMaterial, playerGeometry),
            new Sprite(playerRunMaterial, playerGeometry),
            new Sprite(playerJumpMaterial, playerGeometry),
            new Sprite(playerClimbMaterial, playerGeometry),
        ];
        this.currentState = IDLE_STATE;
        this.spriteAnimations = [
            new TextureAnimation(playerIdleSprite, 1, 100),
            new TextureAnimation(playerRunSprite, 6, 6),
            new TextureAnimation(playerJumpSprite, 6, 4),
            new TextureAnimation(playerClimbSprite, 5, 10),
        ];
        this.collisionSize = new THREE.Vector2(28, 48);

        this.climbing = false;
        this.isOnVine = false;

        this.wasGrounded = false;
        this.reset = false;
        this.swimming = false;

        this.noteTimer = 0;
    }

    update(world, dt) {
        world.scene.remove(this.sprites[this.currentState].mesh);
        this.currentState = IDLE_STATE;
        let blockPos = this.pos.clone().divideScalar(BLOCK_WIDTH).floor();
        if (Math.random() > .997) {
            console.log(blockPos);
        }
        this.swimming = world.grid[blockPos.x + blockPos.y * world.width] === 'w';

        if ((this.vel.x !== 0 && this.grounded) || (!this.wasGrounded && this.grounded)) {
            if (footstepSound.paused) {
                footstepSound.play();
            }
        }
        this.vel.x = 0;
        if (this.swimming) {
            this.forces.y = -1;
            this.vel.y *= .98;
        }
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) {
            this.vel.x = this.swimming ? 2 : 4;
            this.xDirection = 1;
            if (this.currentState != JUMP_STATE) {
                this.currentState = RUN_STATE;
            }
        }
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.A)) {
            this.vel.x = this.swimming ? -2 : -4;
            this.xDirection = -1;
            if (this.currentState != JUMP_STATE) {
                this.currentState = RUN_STATE;
            }
        }
        if (!this.isOnVine) {
            this.climbing = false;
        }
        if (this.climbing) {
            this.vel.y = 0;
            this.currentState = CLIMB_STATE;
        }
        if ((Key.isDown(Key.DOWN) || Key.isDown(Key.S)) && this.climbing) {
            this.vel.y = 2;
        }
        if ((Key.isDown(Key.DOWN) || Key.isDown(Key.S)) && this.swimming) {
            this.vel.y = 2;
        }
        if (Key.isDown(Key.UP) || Key.isDown(Key.W)) {
            if (this.isOnVine) {
                this.climbing = true;
                this.vel.y = -2;
            }
            if (!this.climbing) {
                this.currentState = JUMP_STATE;
                if (this.grounded && this.vel.y >= 0) {
                    this.vel.y = -14;
                }
            }
            if (this.swimming) {
                this.vel.y = -10;
            }
        }
        this.wasGrounded = this.grounded;
        this.isOnVine = false;
        this.sprites[this.currentState].mesh.position.set(this.pos.x, this.pos.y, 0);
        this.spriteAnimations[this.currentState].update(this.textures[this.currentState], dt, this.xDirection);
        world.scene.add(this.sprites[this.currentState].mesh);

        if (Mouse.leftDown) {
            this.noteTimer++;
            if (this.noteTimer > 200) {
                this.noteTimer = 0;
                
                let mat = spriteMaterials.note1.clone();
                mat.color.set(noteColors[Math.floor(Math.random() * noteColors.length)]);
                world.addEntity(new Particle(this.pos.clone().add(new THREE.Vector2(this.xDirection*10, -16)), new THREE.Vector2(this.xDirection, Math.random() * -.5), new THREE.Vector2(0, -.05), new THREE.Vector2(16, 16), 250, mat, null, 50, 1));
            }
        }
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