import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';
import { spriteMaterials } from './materials';
import { Mouse } from './mouse';

export default class Vine {
    constructor(pos) {
        this.type = 'vine';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = false;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);
        this.sprite = new Sprite(spriteMaterials.vine, this.geometry);
        this.collisionSize = new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH);
        this.grown = false;
        this.dt = 0;
        this.ticks = 0;
    }

    update(world, dt) {
        if (Math.random() > .5) {
            this.ticks++;
        }
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, -2);
        let size = BLOCK_WIDTH/2;
        let theta = Math.cos(this.dt * 0.1 + this.pos.x);
        this.dt += dt;
        this.geometry.vertices[0].set(-size+theta, size, 0);
        this.geometry.vertices[1].set(size+theta, size, 0);
        this.geometry.vertices[2].set(-size, -size, 0);
        this.geometry.vertices[3].set(size, -size, 0);
        this.geometry.verticesNeedUpdate = true;
        if (Mouse.leftDown && (world.vineGrow || this.ticks % 300 === 0) && !this.grown) {
            let playerX = Math.floor(world.player.pos.x / BLOCK_WIDTH);
            let vineX = Math.floor(this.pos.x / BLOCK_WIDTH);
            let probExtraVine = 1/Math.pow(Math.abs(vineX - playerX) + 1, 2)
            if (Math.random() < probExtraVine) {
                vineX = playerX;
            }
            if ( vineX === playerX  && world.player.pos.y > this.pos.y) {
                this.grown = true;
                let newPos = this.pos.clone().add(new THREE.Vector2(0, BLOCK_WIDTH));
                let blockNewPos = newPos.clone().divideScalar(BLOCK_WIDTH).floor();
                if (world.grid[blockNewPos.x + world.width * blockNewPos.y] === ' ') {
                    world.addEntity(new Vine(newPos));
                }
            }
        }
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