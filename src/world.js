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
import { forestBackgroundSound, whistleSound, mouseSound, stoneButtonSound } from './sounds';
import Door from './door';
import Grass from './grass';
import Particle from './particle';
import Bird from './bird';
import Sky from './sky';

export default class World {
    constructor(cwidth, cheight) {
        this.width = 120;
        this.height = 80;
        this.grid = new Array(this.width*this.height);
        this.grid.fill(' ');
        this.flowerGrid = new Array(this.width*this.height);
        this.spriteGrid = new Array(this.grid.length);
        this.vineGrow = false;
        this.camera = new THREE.OrthographicCamera(0, cwidth, 0, cheight, -1000, 1000);
        this.cameraWidth = cwidth;
        this.cameraHeight = cheight;
        this.scene = new THREE.Scene();

        this.blueCrushed = false;
        this.redCrushed = false;
        this.yellowCrushed = false;

        this.ticks = 0;

        this.player = new Player(new THREE.Vector2(100, 100));

        this.entities = [];
        this.entityQueue = [];
        this.disturbedGrass = [];

        this.addEntity(this.player);

        let l2button = new Button(new THREE.Vector2(BLOCK_WIDTH * 25 , BLOCK_WIDTH*35.5), new THREE.Vector2(BLOCK_WIDTH*2, BLOCK_WIDTH));
        this.addEntity(l2button);
        let l1button = new Button(new THREE.Vector2(BLOCK_WIDTH * 85.5, BLOCK_WIDTH*33.5), new THREE.Vector2(BLOCK_WIDTH*5, BLOCK_WIDTH));
        this.addEntity(l1button);

        let codeButtons = []
        for (let i = 0; i < 6; i++) {
            codeButtons.push(new Button(new THREE.Vector2(BLOCK_WIDTH * (72 + i*6), BLOCK_WIDTH*5.5+2), new THREE.Vector2(BLOCK_WIDTH*2, BLOCK_WIDTH)));
            this.addEntity(codeButtons[codeButtons.length-1]);
        }
        this.code = new Array(6);
        this.code.fill(false);
        for (let i = 0; i < 5; i++) {
            let idx = Math.floor(Math.random()*6)
            this.code[idx] = true;
        }
        console.log(this.code);
        let codeSlider = 0;
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 118, BLOCK_WIDTH*5.5), new THREE.Vector2(BLOCK_WIDTH*2, BLOCK_WIDTH*1), () => {
            for (let i = 0; i < 6; i++) {
                if ((codeButtons[i].offset > 16) !== (this.code[i])) {
                    return new THREE.Vector2();
                }
            }
            if (codeSlider < 64) {
                if (codeSlider === 0) {
                    //TODO maybe better sound here
                    stoneButtonSound.play();
                }
                codeSlider+=.1
            }
            return new THREE.Vector2(codeSlider, 0);
        }));

        // reveals level 1 door
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 92.5, BLOCK_WIDTH*33), new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH*2), () => {
            return new THREE.Vector2(0, l1button.offset * 2+2);
        }));
        // reveals level 2 entrance
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 69.5, BLOCK_WIDTH*33.5), new THREE.Vector2(BLOCK_WIDTH*7, BLOCK_WIDTH*5), () => {
            return new THREE.Vector2(0, l2button.offset > 0 ? 100000 : 0);
        }, spriteMaterials.dirt5Tall));

        //dir crumble blocks under first mountain
        for (let i = 0; i < 7; i++) {
            this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (66.5+i), BLOCK_WIDTH*36.5), spriteMaterials.dirtCracked, spriteMaterials.dirtCracked2));
            this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (66.5+i), BLOCK_WIDTH*37.5), spriteMaterials.dirtCracked, spriteMaterials.dirtCracked2));
        }

        //vines for level 3
        for (let i = 0; i < 8; i++) {
            this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * (35.5+i), BLOCK_WIDTH * (39.5))))
        }
        for (let i = 0; i < 4; i++) {
            this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * (43.5+i), BLOCK_WIDTH * (42.5))))
        }

        //level 3 tree vines
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * (68.5), BLOCK_WIDTH * (19.5))))


        //grass crumble blocks
        this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (32.5), BLOCK_WIDTH*36.5), spriteMaterials.dirtCracked, spriteMaterials.dirtCracked2));
        this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (33.5), BLOCK_WIDTH*36.5), spriteMaterials.dirtCracked, spriteMaterials.dirtCracked2));

        // behind level 4?
        this.addEntity(new CrumbleBlock(new THREE.Vector2(BLOCK_WIDTH * (82.5), BLOCK_WIDTH*47.5), spriteMaterials.dirtCracked, spriteMaterials.dirtCracked2));

        // blue flower control door
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 113.5, BLOCK_WIDTH*23), new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH*2), () => {
            return new THREE.Vector2(0, this.blueCrushed ? Math.max(0, BLOCK_WIDTH*2 - .1*(this.ticks - this.blueCrushed)) : BLOCK_WIDTH*2);
        }, spriteMaterials.blueDoor));

        // yellow flower control door
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 93.5, BLOCK_WIDTH*29), new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH*2), () => {
            return new THREE.Vector2(0, this.yellowCrushed ? Math.max(0, BLOCK_WIDTH*2 - .1*(this.ticks - this.yellowCrushed)) : BLOCK_WIDTH*2);
        }, spriteMaterials.yellowDoor));

        // red flower control door
        this.addEntity(new ControlledBlock(new THREE.Vector2(BLOCK_WIDTH * 18.5, BLOCK_WIDTH*30), new THREE.Vector2(BLOCK_WIDTH, BLOCK_WIDTH*2), () => {
            return new THREE.Vector2(0, this.redCrushed ? Math.max(0, BLOCK_WIDTH*2 - .1*(this.ticks - this.redCrushed)) : BLOCK_WIDTH*2);
        }, spriteMaterials.redDoor));


        this.loadMap();

        this.addEntity(new Foreground(this.width, this.height));

        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 22.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 23.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 24.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 25.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 26.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 27.5, BLOCK_WIDTH*15.5)));
        this.addEntity(new Vine(new THREE.Vector2(BLOCK_WIDTH * 28.5, BLOCK_WIDTH*15.5)));

        this.addEntity(new Bird(new THREE.Vector2(BLOCK_WIDTH * 74.5, BLOCK_WIDTH*14.5), this.code));

        setInterval(() => {
            this.addEntity(new Particle(new THREE.Vector2(43*32, 42*32), new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(5, 5), 220, spriteMaterials.waterDrop, () => {
                let pdist = this.player.pos.clone().sub(new THREE.Vector2(39*32, 46*32)).length();
                if (pdist < 32*9) {
                    mouseSound.play();
                    this.addEntity(new Particle(new THREE.Vector2(43*32, 48*32), new THREE.Vector2(0, -1), new THREE.Vector2(0, 0), new THREE.Vector2(64, 32), 220, spriteMaterials.clickText, null, 50, 1));
                }
            }));
            setTimeout(() => {
                this.addEntity(new Particle(new THREE.Vector2(45*32, 42*32), new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(5, 5), 220, spriteMaterials.waterDrop, () => {
                }));
            }, 100);
        }, 3000);

        this.addEntity(new Sky());

        setTimeout(() => {
            forestBackgroundSound.play();
        }, 10000);
        let tree = new Sprite(spriteMaterials.bigTree, new THREE.PlaneGeometry(702, 744));
        tree.mesh.position.set(2525, 695, -10);
        this.scene.add(tree.mesh);
    }

    addEntity(entity) {
        this.entityQueue.push(entity);
        entity.init(this);
    }

    update(dt) {
        this.ticks++;
        for (let ent of this.entityQueue) {
            this.entities.push(ent);
        }
        this.entityQueue = [];

        this.vineGrow = false;
        if (Mouse.leftHit()) {
            this.vineGrow = true;
            whistleSound.play();
        }
        if (!Mouse.leftDown) {
            whistleSound.pause();
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
                                        entity.pos.y += .01;
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
                        let gridValue = this.grid[x + y*this.width]
                        if (gridValue !== ' ' && gridValue !== 'w') {
                            if (gridValue === 't') {
                                let diff = this.boxCollide(entity, new Vector2(x*BLOCK_WIDTH, y*BLOCK_WIDTH), new Vector2((x+1)*BLOCK_WIDTH, (y+1)*BLOCK_WIDTH));
                                if (diff && entity.vel.y >= 0) {
                                    if (diff.y < 0) {
                                        entity.pos.y += .01
                                        entity.vel.y = Math.min(0, entity.vel.y);
                                        entity.grounded = true;
                                        entity.pos.add(diff);
                                    }
                                }
                            } else {
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

        let playerPos = this.player.pos.clone().divideScalar(BLOCK_WIDTH).floor();
        let grass = this.flowerGrid[playerPos.x + playerPos.y * this.width];
        if (grass) {
            if(grass.disturbed === 0) {
                this.disturbedGrass.push(grass);
            }
            let disturb = this.player.vel.x;
            if (Math.abs(this.player.vel.y*10) > Math.abs(this.player.vel.x)) {
                disturb = this.player.vel.y*20;
            }
            grass.initDisturb(disturb*.1);
            
        }
        let nextDisturbed = [];
        for (let g of this.disturbedGrass) {
            g.disturb(this);
            if (g.disturbed > 0) {
                nextDisturbed.push(g);
            }
        }
        this.disturbedGrass = nextDisturbed;
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
                } else {
                    return new THREE.Vector2(-xRad - xDiff, 0)
                }
            }
            
            if (Math.abs(yDiff) < yRad) {
                if (yDiff > 0) {
                    return new THREE.Vector2(0, yRad - yDiff);
                } else {
                    return new THREE.Vector2(0, -yRad - yDiff);
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
                } else if (value === 'G') {
                    //grass pseudo entity
                    let grass = new Grass(x, y);
                    this.flowerGrid[x + y*this.width] = grass;
                    this.scene.add(grass.sprite.mesh);
                } else if (value === 'r') {
                    //grass pseudo entity
                    let grass = new Grass(x, y, 'r');
                    this.flowerGrid[x + y*this.width] = grass;
                    this.scene.add(grass.sprite.mesh);
                    this.scene.add(grass.flower.mesh);
                } else if (value === 'b') {
                    //grass pseudo entity
                    let grass = new Grass(x, y, 'b');
                    this.flowerGrid[x + y*this.width] = grass;
                    this.scene.add(grass.sprite.mesh);
                    this.scene.add(grass.flower.mesh);
                } else if (value === 'y') {
                    //grass pseudo entity
                    let grass = new Grass(x, y, 'y');
                    this.flowerGrid[x + y*this.width] = grass;
                    this.scene.add(grass.sprite.mesh);
                    this.scene.add(grass.flower.mesh);
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
                        this.addSpriteToGrid(new Sprite(spriteMaterials.dirt), x, y, -1, Math.floor(Math.random()*4));
                        break;
                    case '-':
                        this.addSpriteToGrid(new Sprite(spriteMaterials.grass), x, y, -1, 0);
                        break;
                    case 'w':
                        this.addSpriteToGrid(new Sprite(spriteMaterials.waterBlock), x, y, 1, 0);
                    default:
                        break;
                }
            }
        }
    }

    addSpriteToGrid(sprite, x, y, layer, rotate) {
        this.spriteGrid[x + y*this.width] = sprite;
        sprite.mesh.position.set(x * BLOCK_WIDTH + BLOCK_WIDTH/2, y * BLOCK_WIDTH + BLOCK_WIDTH/2, layer);
        this.scene.add(sprite.mesh);
        sprite.mesh.rotateZ(rotate * Math.PI/2);
    }

    render(renderer) {
        renderer.render(this.scene, this.camera);
    }
}
