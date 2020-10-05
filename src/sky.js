import * as THREE from 'three';
import Sprite from './sprite';
import Key from './key';
import { BLOCK_WIDTH } from './constants';
import { spriteMaterials } from './materials';
import { stoneButtonSound } from './sounds';

export default class Sky {
    constructor() {
        this.type = 'sky';
        this.physics = false;
        this.dynamic = false;
        this.solid = true;
        this.deleteFlag = false;
        this.geometry = new THREE.PlaneGeometry(2000, 2000);
        let topGradient = 0x0055ff;
        let bottomGradient = 0xffffff;
        this.geometry.faces[0].vertexColors.push(new THREE.Color(bottomGradient), new THREE.Color(topGradient), new THREE.Color(bottomGradient));
        this.geometry.faces[1].vertexColors.push(new THREE.Color(topGradient), new THREE.Color(topGradient), new THREE.Color(bottomGradient));
        this.geometry.colorsNeedUpdate = true;
        this.sprite = new Sprite(new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
            vertexColors: THREE.VertexColors,
        }), this.geometry);


        this.fadeGeometry = new THREE.PlaneGeometry(2000, 128);
        this.fadeSprite = new Sprite(spriteMaterials.gradient, this.fadeGeometry);

        this.darkGeometry = new THREE.PlaneGeometry(2000, 2000);
        this.darkSprite = new Sprite(new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide,
        }), this.darkGeometry);

        this.clouds = [];
    }

    update(world, dt) {
        this.sprite.mesh.position.set(world.camera.position.x+600, world.camera.position.y+400, -100);
        this.fadeSprite.mesh.position.set(world.camera.position.x+600,  38*32, -60);
        this.darkSprite.mesh.position.set(world.camera.position.x+600,  40*32+1000, -60);

        for (let cloud of this.clouds) {
            cloud.update(world, dt);
        }
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
        world.scene.add(this.fadeSprite.mesh);
        world.scene.add(this.darkSprite.mesh);

        for (let i = 0; i < 25; i++) {
            let scale = Math.random() * .5 + .5;
            let c = new Cloud(new THREE.Vector3(Math.random() * 1800, Math.random() * 400, -80 + scale*10), new THREE.Vector2((Math.random() - .5) * .1, 0), scale, Math.floor(Math.random() * 3 + 1));
            this.clouds.push(c);
            c.init(world);
        }
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
        world.scene.remove(this.fadeSprite.mesh);
        world.scene.remove(this.darkSprite.mesh);
    }
}

const cloudGeom = new THREE.PlaneGeometry(256, 128);
class Cloud {
    constructor(pos, vel, scale, type) {
        this.pos = pos;
        this.vel = vel;
        this.scale = scale;
        this.type = type;

        this.sprite = new Sprite(spriteMaterials['cloud' + type], cloudGeom);
        this.sprite.mesh.scale.set(scale, scale);
    }

    init(world) {
        world.scene.add(this.sprite.mesh);
    }

    update(world, dt) {
        if (this.pos.x > 1800) {
            this.pos.x = -256;
        }
        if (this.pos.x < -256) {
            this.pos.x = 1800;
        }
        this.pos.add(new THREE.Vector3(this.vel.x * dt, this.vel.y * dt, 0));
        this.sprite.mesh.position.set(world.camera.position.x*(1 - this.scale*.2) + this.pos.x, world.camera.position.y*(1 - this.scale*.2) + this.pos.y, this.pos.z);
    }

    tearDown(world) {
        world.scene.remove(this.sprite.mesh);
    }
}