import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';
import { spriteMaterials } from './materials';
import { stoneButtonSound, chirpLow, chirpHigh } from './sounds';
import Particle from './particle';

const geometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);

const noteColors = [
    0xff0000, 0xff00ff, 0xffff00,
    0x00ff00, 0x0000ff,
]
export default class Bird {
    constructor(pos, code) {
        this.type = 'bird';
        this.pos = pos;
        this.physics = false;
        this.dynamic = false;
        this.solid = false;
        this.deleteFlag = false;
        this.code = code;
        this.codePos = 0;
        this.codeTimer = 0;
        this.codeStart = 0;
        this.sprite = new Sprite(spriteMaterials.bird, geometry);
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y+3, 0);
        let inRange = world.player.pos.clone().sub(this.pos).length() < 32*10;
        if (this.codeStart < 3000 || !inRange) {
            this.codeStart++;
            return;
        }
        if (this.codeTimer < 600) {
            this.codeTimer++;
            return;
        }
        let mat = spriteMaterials.note1.clone();
        mat.color.set(noteColors[Math.floor(Math.random() * noteColors.length)]);
        if (this.code[this.codePos]) {
            chirpLow.volume = 0.2;
            chirpLow.play();
            world.addEntity(new Particle(this.pos.clone().add(new THREE.Vector2(-20, 0)), new THREE.Vector2(-1, .1), new THREE.Vector2(), new THREE.Vector2(16, 16), 250, mat, null, 50, 1))
        } else {
            chirpHigh.volume = 0.2;
            chirpHigh.play();
            world.addEntity(new Particle(this.pos.clone().add(new THREE.Vector2(-20, -5)), new THREE.Vector2(-1, -.5), new THREE.Vector2(), new THREE.Vector2(16, 16), 250, mat, null, 50, 1))
        }
        this.codeTimer = 0;
        this.codePos++;
        if (this.codePos === 6) {
            this.codeStart = 0;
            this.codePos = 0;
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}