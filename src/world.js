import * as THREE from 'three';
import { smallMapGrid } from './map';
import Sprite from './sprite';
import Player from './player';
import { Vector2 } from 'three';
import Button from './button';
import Vine from './vine';
import CrumbleBlock from './crumbleblock';
import { spriteMaterials } from './materials';
import Foreground from './foregroundlayer';
import { BLOCK_WIDTH, GRAVITY } from './constants';
import { Mouse } from './mouse';

export default class World {
    constructor(cwidth, cheight) {
        this.width = 120;
        this.height = 80;
        this.grid = new Array(this.width*this.height);
        this.grid.fill(' ');
        this.spriteGrid = new Array(this.grid.length);
        this.vineGrow = false;
        this.camera = new THREE.OrthographicCamera(0, cwidth, 0, cheight, -1000, 1000);
        this.scene = new THREE.Scene();

        this.player = new Player(new THREE.Vector2(100, 100));

        this.entities = [];
        this.entityQueue = [];

        this.addEntity(this.player);

        this.addEntity(new Button(new THREE.Vector2(BLOCK_WIDTH * 10.5, BLOCK_WIDTH*17.5)));
        for (let i = 0; i < 5; i++) {
            this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (15.5-i), BLOCK_WIDTH*14.5)));
        }
        this.loadMap();

        this.addEntity(new Foreground(this.width, this.height));

        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 27.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 28.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 29.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 26.5, BLOCK_WIDTH*19.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 25.5, BLOCK_WIDTH*20.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 7.5, BLOCK_WIDTH*4.5)));


    }

    addEntity(entity) {
        this.entityQueue.push(entity);
        entity.init(this);
    }

    update(dt) {
        for (let ent of this.entityQueue) {
            this.entities.push(ent);
        }
        this.entityQueue = [];

        this.vineGrow = false;
        if (Mouse.leftHit()) {
            this.vineGrow = true;
        }
        for (let entity of this.entities) {
            entity.update(this, dt);

            if (entity.dynamic && entity.physics) {
                entity.forces.y += GRAVITY;
                entity.pos.add(entity.vel.clone().multiplyScalar(dt));
                entity.vel.add(entity.forces.multiplyScalar(dt));
                entity.forces = new THREE.Vector2(0, 0);

                entity.grounded = false;

                for (let staticEnt of this.entities) {
                    if (staticEnt.dynamic || !staticEnt.physics) {
                        continue;
                    }
                    let diff = this.boxCollide(entity, staticEnt.pos.clone().sub(staticEnt.collisionSize.clone().multiplyScalar(.5)), staticEnt.pos.clone().add(staticEnt.collisionSize.clone().multiplyScalar(.5)), true);
                    if (diff) {
                        staticEnt.collide(entity, diff.clone().multiplyScalar(-1));
                        entity.collide(staticEnt, diff.clone());
                        if (staticEnt.solid) {
                            entity.pos.add(diff);
                            if (diff.y < 0) {
                                entity.vel.y = Math.min(0, entity.vel.y);
                                entity.grounded = true;
                            }
                            if (diff.y > 0) {
                                entity.vel.y = Math.max(0, entity.vel.y);
                            }
                            if (diff.x < 0) {
                                entity.vel.x = Math.min(0, entity.vel.x);
                            }
                            if (diff.x > 0) {
                                entity.vel.x = Math.max(0, entity.vel.x);
                            }
                        }
                    }
                }

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
                
                for (let x = startX; x != endX; x += stepX) {
                    for (let y = startY; y != endY; y += stepY) {
                        if (this.grid[x + y*this.width] !== ' ') {
                            let diff = this.boxCollide(entity, new Vector2(x*BLOCK_WIDTH, y*BLOCK_WIDTH), new Vector2((x+1)*BLOCK_WIDTH, (y+1)*BLOCK_WIDTH));
                            if (diff) {
                                entity.pos.add(diff);
                                if (diff.y < 0) {
                                    entity.vel.y = Math.min(0, entity.vel.y);
                                    entity.grounded = true;
                                }
                                if (diff.y > 0) {
                                    entity.vel.y = Math.max(0, entity.vel.y);
                                }
                                if (diff.x < 0) {
                                    entity.vel.x = Math.min(0, entity.vel.x);
                                }
                                if (diff.x > 0) {
                                    entity.vel.x = Math.max(0, entity.vel.x);
                                }
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].deleteFlag) {
                this.entities[i].tearDown(this);
                this.entities.splice(i, 1);
                i--;
            }
        }
    }

    boxCollide(entity, lowCorner, highCorner, debug) {
        const xRad = (BLOCK_WIDTH + entity.collisionSize.x) * .5;
        const yRad = (BLOCK_WIDTH + entity.collisionSize.y) * .5;

        let xDiff = entity.pos.x - (lowCorner.x + highCorner.x)/2;
        let yDiff = entity.pos.y - (lowCorner.y + highCorner.y)/2;
        if (debug) {
            //console.log(entity.pos, lowCorner);
        }
        if (Math.abs(xDiff) < xRad && Math.abs(yDiff) < yRad) {
            if (Math.abs(xDiff) - xRad > Math.abs(yDiff) - yRad) {
                yDiff = yRad;
            } else {
                xDiff = xRad;
            }
            
            
            if (Math.abs(xDiff) < xRad) {
                if (xDiff > 0) {
                    return new THREE.Vector2(xRad - xDiff, 0)
                    entity.pos.x -= xDiff - xRad;
                    entity.vel.x = Math.max(0, entity.vel.x);
                } else {
                    return new THREE.Vector2(-xRad - xDiff, 0)
                    entity.pos.x -= xDiff + xRad;
                    entity.vel.x = Math.min(0, entity.vel.x);
                }
            }
            
            if (Math.abs(yDiff) < yRad) {
                if (yDiff > 0) {
                    return new THREE.Vector2(0, yRad - yDiff);
                    entity.pos.y -= yDiff - yRad;
                    entity.vel.y = Math.max(0, entity.vel.y);
                } else {
                    return new THREE.Vector2(0, -yRad - yDiff);
                    entity.grounded = true;
                    entity.pos.y -= yDiff + yRad;
                    entity.vel.y = Math.min(0, entity.vel.y);
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
        sprite.mesh.position.set(x * BLOCK_WIDTH + BLOCK_WIDTH/2, y * BLOCK_WIDTH + BLOCK_WIDTH/2, -1);
        this.scene.add(sprite.mesh);
    }

    render(renderer) {
        renderer.render(this.scene, this.camera);
    }
}