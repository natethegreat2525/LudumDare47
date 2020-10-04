import * as THREE from 'three';
import { smallMapGrid } from './map';
import Sprite from './sprite';
import Player from './player';
import { Vector2 } from 'three';
import Button from './button';
import ControlledBlock from './controlledblock';
import Vine from './vine';
import CrumbleBlock from './crumbleblock';
import { spriteMaterials } from './materials';
import Foreground from './foregroundlayer';
import { BLOCK_WIDTH, GRAVITY } from './constants';
import { Mouse } from './mouse';
import { forestBackgroundSound } from './sounds';
import Door from './door';

export default class World {
    constructor(cwidth, cheight) {
        this.width = 120;
        this.height = 80;
        this.grid = new Array(this.width*this.height);
        this.grid.fill(' ');
        this.spriteGrid = new Array(this.grid.length);
        this.vineGrow = false;
        this.camera = new THREE.OrthographicCamera(0, cwidth, 0, cheight, -1000, 1000);
        this.cameraWidth = cwidth;
        this.cameraHeight = cheight;
        this.scene = new THREE.Scene();

        this.player = new Player(new THREE.Vector2(100, 100));

        this.entities = [];
        this.entityQueue = [];

        this.addEntity(this.player);

        let l2button = new Button(new THREE.Vector2(BLOCK_WIDTH * 25 , BLOCK_WIDTH*35.5), new THREE.Vector2(BLOCK_WIDTH*2, BLOCK_WIDTH));
        this.addEntity(l2button);
        let l1button = new Button(new THREE.Vector2(BLOCK_WIDTH * 85.5, BLOCK_WIDTH*33.5), new THREE.Vector2(BLOCK_WIDTH*5, BLOCK_WIDTH));
        this.addEntity(l1button);

        // reveals level 1 door
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 92.5, BLOCK_WIDTH*33), new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH*2), () => {
            return new THREE.Vector2(0, l1button.offset * 2+2);
        }));
        // reveals level 2 entrance
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 69.5, BLOCK_WIDTH*33.5), new THREE.Vector2(BLOCK_WIDTH*7, BLOCK_WIDTH*5), () => {
            return new THREE.Vector2(0, l2button.offset > 0 ? 100000 : 0);
        }));

        //dir crumble blocks under first mountain
        for (let i = 0; i < 7; i++) {
            this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (66.5+i), BLOCK_WIDTH*36.5)));
            this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (66.5+i), BLOCK_WIDTH*37.5)));
        }

        //vines for level 3
        for (let i = 0; i < 8; i++) {
            this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * (35.5+i), BLOCK_WIDTH * (39.5))))
        }
        for (let i = 0; i < 4; i++) {
            this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * (43.5+i), BLOCK_WIDTH * (42.5))))
        }

        //grass crumble blocks
        this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (32.5), BLOCK_WIDTH*36.5)));
        this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (33.5), BLOCK_WIDTH*36.5)));

        this.loadMap();

        this.addEntity(new Foreground(this.width, this.height));

        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 27.5, BLOCK_WIDTH*15.5)));


        setTimeout(() => {
            forestBackgroundSound.play();
        }, 1000);
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
                for (let isPositioning = 0; isPositioning < 2; isPositioning++) {
                    if (isPositioning) {
                        entity.grounded = false;
                    }
                    for (let staticEnt of this.entities) {
                        if (staticEnt.dynamic || !staticEnt.physics) {
                            continue;
                        }
                        let diff = this.boxCollide(entity, staticEnt.pos.clone().sub(staticEnt.collisionSize.clone().multiplyScalar(.5)), staticEnt.pos.clone().add(staticEnt.collisionSize.clone().multiplyScalar(.5)), true);
                        if (diff) {
                            if (!isPositioning) {
                                staticEnt.collide(entity, diff.clone().multiplyScalar(-1));
                                entity.collide(staticEnt, diff.clone());
                            } else {
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
                                    entity.pos.y += .01
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
        let camX = 0;
        let camY = 0;
        if (this.player.pos.x > this.cameraWidth/2) {
            camX = this.player.pos.x - this.cameraWidth/2;
        }
        if (this.player.pos.y > this.cameraHeight/2) {
            camY = this.player.pos.y - this.cameraHeight/2;
        }
        if (this.player.pos.x > this.width*BLOCK_WIDTH - this.cameraWidth/2) {
            camX = this.width*BLOCK_WIDTH - this.cameraWidth;
        }
        this.camera.position.set(camX, camY, 0);
    }

    boxCollide(entity, lowCorner, highCorner, debug) {
        const xRad = ((highCorner.x - lowCorner.x) + entity.collisionSize.x) * .5;
        const yRad = ((highCorner.y - lowCorner.y) + entity.collisionSize.y) * .5;

        let xDiff = entity.pos.x - (lowCorner.x + highCorner.x)/2;
        let yDiff = entity.pos.y - (lowCorner.y + highCorner.y)/2;

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
                let value = map2d[y][x];
                if (!isNaN(parseInt(value))) {
                    this.addEntity(new Door(new THREE.Vector2((x+.5)*BLOCK_WIDTH, (y+.28)*BLOCK_WIDTH), parseInt(value)))
                } else if (value === 's') {
                    this.player.pos.x = (x + .5)*BLOCK_WIDTH;
                    this.player.pos.y = (y + .5)*BLOCK_WIDTH;
                } else if (value === '.') {
                    //do nothing
                } else {
                    this.grid[x + y*this.width] = value;
                }
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