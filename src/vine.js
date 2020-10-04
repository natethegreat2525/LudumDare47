import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const vineMaterial = new THREE.MeshBasicMaterial({
    color: 0x005500,
    side: THREE.BackSide,
});

const vineGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);

export default class Vine {
    constructor(pos) {
        this.type = 'vine';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = false;
        this.deleteFlag = false;
        this.sprite = new Sprite(vineMaterial, vineGeometry);
        this.collisionSize = new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH);
        this.grown = false;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, -2);

        if (world.vineGrow && !this.grown) {
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