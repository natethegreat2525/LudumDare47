import * as THREE from 'three';
import Sprite from './sprite';
import { spriteMaterials } from './materials';
import { Mouse } from './mouse';
import { BLOCK_WIDTH } from './constants';

export default class Turtle {
    constructor(pos) {
        this.type = 'turtle';
        this.pos = pos;
        this.vel = new THREE.Vector2();
        this.forces = new THREE.Vector2();
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(32, 32);
        
        this.sprite = new Sprite(spriteMaterials.turtle, this.geometry);
        this.collisionSize = new THREE.Vector2(32, 32);
        this.ticks = 0;
    }

    update(world, dt) {
        this.ticks += .01
        this.sprite.mesh.position.set(this.pos.x, this.pos.y-8, 0);
        this.pos.add(this.vel.clone().multiplyScalar(dt));
        this.vel = new THREE.Vector2();
        this.vel.x = Mouse.vx/50;
        this.pos.y += .01*Math.sin(this.ticks);
        if (this.vel.x > 0) {
            this.sprite.mesh.scale.set(-1, 1);
        } else {
            this.sprite.mesh.scale.set(1, 1);
        }
        this.pos.x = Math.min(Math.max(64.5*BLOCK_WIDTH, this.pos.x), 76.5*BLOCK_WIDTH);
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