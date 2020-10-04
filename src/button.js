import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';
import { spriteMaterials } from './materials';
import { stoneButtonSound } from './sounds';

export default class Button {
    constructor(pos, size) {
        this.type = 'button';
        this.pos = pos;
        this.physics = true;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(size.x, size.y);
        let uvs = this.geometry.faceVertexUvs[0];
        uvs[0][0].set(0,1);
        uvs[0][1].set(0,0);
        uvs[0][2].set(size.x/(5*BLOCK_WIDTH),1);
        uvs[1][0].set(0,0);
        uvs[1][1].set(size.x/(5*BLOCK_WIDTH),0);
        uvs[1][2].set(size.x/(5*BLOCK_WIDTH),1);
        this.sprite = new Sprite(spriteMaterials.button, this.geometry);
        this.collisionSize = size;
        this.offset = 0;
        this.currentlyCollided = false;
        this.collided = false;
        this.playedOnce = false;
    }

    update(world, dt) {
        this.sprite.mesh.position.set(this.pos.x, this.pos.y, 0);
        if (this.collided && !this.playedOnce) {
            stoneButtonSound.play();
            this.playedOnce = true;
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    collide(other, diff) {
        if (other.type == 'player' && diff.y > 0 && other.vel.y >= 0) {
            this.pos.y += .1;
            this.offset += .1;
            this.collided =  true
        } 
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}