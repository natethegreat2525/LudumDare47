import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';
import { spriteMaterials } from './materials';
import { stoneButtonSound } from './sounds';

export default class Particle {
    constructor(pos, vel, acc, size, life, material, onDestroy, fadeStart, opacity) {
        this.type = 'particle';
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;

        this.baseOpacity = opacity || 1;
        this.opacity = opacity || 1;
        this.fadeStart = fadeStart;
        if (isNaN(this.fadeStart)) {
            this.fadeStart = life;
        }
        this.size = size;

        this.geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.physics = false;
        this.dynamic = false;
        this.solid = false;
        this.life = life;
        this.material = material;

        this.deleteFlag = false;

        this.onDestroy = onDestroy;
        
        this.sprite = new Sprite(this.material, this.geometry);
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, 0);
        this.pos.add(this.vel.clone().multiplyScalar(dt));
        this.vel.add(this.acc.clone().multiplyScalar(dt));
        this.life--;

        if (this.life < this.fadeStart) {
            this.opacity = this.life / this.fadeStart;
        }
        this.sprite.mesh.material.opacity = this.opacity;

        if (this.life <= 0) {
            if (this.onDestroy) {
                this.onDestroy();
            }
            this.deleteFlag = true;
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
        this.geometry.dispose();
    }
}