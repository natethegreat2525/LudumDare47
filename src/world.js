import * as THREE from 'three';
import { smallMapGrid } from './map';
import Sprite from './sprite';
import Player from './player';

const BLOCK_WIDTH = 32;
export default class World {
    constructor(cwidth, cheight) {
        this.width = 120;
        this.height = 80;
        this.grid = new Array(this.width*this.height);
        this.grid.fill(' ');
        this.spriteGrid = new Array(this.grid.length);

        this.camera = new THREE.OrthographicCamera(0, cwidth, 0, cheight, -1000, 1000);
        this.scene = new THREE.Scene();

        this.player = new Player(new THREE.Vector2(100, 100));

        this.entities = [];

        this.addEntity(this.player);

        this.loadMap();
    }

    addEntity(entity) {
        this.entities.push(entity);
        entity.init(this);
    }

    update(dt) {
        for (let entity of this.entities) {
            entity.update(this, dt);

            // collide with grid
            let upCorner = entity.pos.clone().add(entity.collisionSize.clone().multiplyScalar(.5)).divideScalar(BLOCK_WIDTH).floor();
            let lowCorner = entity.pos.clone().sub(entity.collisionSize.clone().multiplyScalar(.5)).divideScalar(BLOCK_WIDTH).floor();
            let startX = lowCorner.x;
            let startY = lowCorner.y;
            let endX = upCorner.x;
            let endY = upCorner.y;
            let stepX = 1;
            let stepY = 1;
            if (entity.vel.x < 0) {
                let tmp = startX;
                startX = endX;
                endX = tmp;
                stepX = -1;
                endX--;
            } else {
                endX++;
            }
            if (entity.vel.y < 0) {
                let tmp = startY;
                startY = endY;
                endY = tmp;
                stepY = -1;
                endY--;
            } else {
                endY++;
            }
            const xRad = (BLOCK_WIDTH + entity.collisionSize.x) * .5;
            const yRad = (BLOCK_WIDTH + entity.collisionSize.y) * .5;
            entity.grounded = false;
            for (let x = startX; x != endX; x += stepX) {
                for (let y = startY; y != endY; y += stepY) {
                    if (this.grid[x + y*this.width] !== ' ') {
                        let xDiff = entity.pos.x - (x*BLOCK_WIDTH + BLOCK_WIDTH/2);
                        let yDiff = entity.pos.y - (y*BLOCK_WIDTH + BLOCK_WIDTH/2);
                        if (Math.abs(xDiff) < xRad && Math.abs(yDiff) < yRad) {
                            if (Math.abs(xDiff) - xRad > Math.abs(yDiff) - yRad) {
                                yDiff = yRad;
                            } else {
                                xDiff = xRad;
                            }
                            
                            
                            if (Math.abs(xDiff) < xRad) {
                                if (xDiff > 0) {
                                    entity.pos.x -= xDiff - xRad;
                                    entity.vel.x = Math.max(0, entity.vel.x);
                                } else {
                                    entity.pos.x -= xDiff + xRad;
                                    entity.vel.x = Math.min(0, entity.vel.x);
                                }
                            }
                            
                            if (Math.abs(yDiff) < yRad) {
                                if (yDiff > 0) {
                                    entity.pos.y -= yDiff - yRad;
                                    entity.vel.y = Math.max(0, entity.vel.y);
                                } else {
                                    entity.grounded = true;
                                    entity.pos.y -= yDiff + yRad;
                                    entity.vel.y = Math.min(0, entity.vel.y);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    loadMap() {
        let map2d = smallMapGrid.split('\n').map(x => x.split(''));
        for (let y = 0; y < map2d.length; y++) {
            for (let x = 0; x < map2d[y].length; x++) {
                this.grid[x + y*this.width] = map2d[y][x];
            }
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                switch (this.grid[x + y * this.width]) {
                    case '#':
                        this.addSpriteToGrid(new Sprite(spriteMaterials.dirt), x, y);
                        break;
                    case '-':
                        this.addSpriteToGrid(new Sprite(spriteMaterials.grass), x, y);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    addSpriteToGrid(sprite, x, y) {
        this.spriteGrid[x + y*this.width] = sprite;
        sprite.mesh.position.set(x * BLOCK_WIDTH + BLOCK_WIDTH/2, y * BLOCK_WIDTH + BLOCK_WIDTH/2, 0);
        this.scene.add(sprite.mesh);
    }

    render(renderer) {
        renderer.render(this.scene, this.camera);
    }
}

const spriteMaterials = {
    dirt: new THREE.MeshBasicMaterial({
        color: 0x543210,
        side: THREE.BackSide,
    }),
    grass: new THREE.MeshBasicMaterial({
        color: 0x228822,
        side: THREE.BackSide,
    }),
};

function genDirtSprite() {

}