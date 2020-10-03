import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { foregroundMap } from './map';
import { spriteMaterials } from './materials';
import { BLOCK_WIDTH } from './constants';

export default class Foreground {
    constructor(width, height) {
        this.type = 'foreground';
        this.physics = false;
        this.dynamic = false;
        this.solid = false;
        this.deleteFlag = false;
        this.width = width;
        this.height = height;

        this.grid = new Array(width * height);
        this.sprites = [];
        this.loadMap();
    }

    loadMap() {
        let map2d = foregroundMap.split('\n').map(x => x.split(''));
        for (let y = 0; y < map2d.length; y++) {
            for (let x = 0; x < map2d[y].length; x++) {
                switch (map2d[y][x]) {
                    case '#':
                        this.grid[x + y*this.width] = new Sprite(spriteMaterials.dirt.clone());
                        break;
                    case '-':
                        this.grid[x + y*this.width] = new Sprite(spriteMaterials.grass.clone());
                        break;
                    default:
                        break;
                }
                let sprite = this.grid[x + y*this.width];
                if (sprite) {
                    this.sprites.push(sprite);
                    sprite.mesh.position.set((x+.5)*BLOCK_WIDTH, (y+.5)*BLOCK_WIDTH, 2);
                }
            }
        }
    }

    update(world, dt) {
        for (let sprite of this.sprites) {
            if (sprite.mesh.material.opacity < 1) {
                sprite.mesh.material.opacity += .01;
                sprite.mesh.material.needsUpdate = true;
            }
        }
        let gridPos = world.player.pos.clone().divideScalar(BLOCK_WIDTH).floor();
        this.hideSprite(gridPos.x, gridPos.y, -1);
    }

    hideSprite(x, y, op) {
        let sprite = this.grid[x + y * this.width];
        if (op === -1 && sprite) {
            op = sprite.mesh.material.opacity;
        }
        if (sprite && sprite.mesh.material.opacity >= op) {
            sprite.mesh.material.transparent = true;
            sprite.mesh.material.opacity = Math.max(0, op - .02);
            sprite.mesh.material.needsUpdate = true;
            this.hideSprite(x-1, y, op);
            this.hideSprite(x+1, y, op);
            this.hideSprite(x, y+1, op);
            this.hideSprite(x, y-1, op);
        }
    }

    init(world) {
        for (let sprite of this.grid) {
            if (sprite) {
                world.scene.add(sprite.mesh);
            }
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}