import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';

const crumbleBlockMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    side: THREE.BackSide,
});

const crumbleBlockMaterialCracked = new THREE.MeshBasicMaterial({
    color: 0x880088,
    side: THREE.BackSide,
});

const crumbleBlockGeometry = new THREE.PlaneGeometry(BLOCK_WIDTH, BLOCK_WIDTH);

export default class CrumbleBlock {
    constructor(pos, material, material2) {
        this.type = 'crumbleblock';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.material2 = material2 || crumbleBlockMaterialCracked;
        this.sprite = new Sprite(material || crumbleBlockMaterial, crumbleBlockGeometry);
        this.collisionSize = new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH);
        this.crumbleState = 0;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, 0);
        if (this.crumbleState == 1) {
            this.crumbleState++;
            this.sprite.mesh.material = this.material2;
        }
        if (this.crumbleState == 3) {
            this.deleteFlag = true;
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    collide(other, diff) {
        if (other.type == 'player' && other.vel.y > 10 && diff.y > 0) {
            this.crumbleState++;
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}