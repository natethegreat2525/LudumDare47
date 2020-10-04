import * as THREE from 'three';

export default class TextureAnimation {
    constructor(texture, numberTiles, displayDuration) {
        this.numberTiles = numberTiles;
        this.displayDuration = displayDuration;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set((1 / numberTiles), 1);
        this.currentDisplayTime = 0;
        this.currentTile = 0;
    }

    update(texture, ms, xDirection) {
        this.currentDisplayTime += ms;
        while (this.currentDisplayTime > this.displayDuration)
        {
            this.currentDisplayTime -= this.displayDuration;
            this.currentTile++;
            if (this.currentTile === this.numberTiles)
            {
                this.currentTile = 0;
            }
            let currentColumn = this.currentTile % this.numberTiles;
            texture.offset.x = currentColumn / this.numberTiles;
        }
        texture.repeat.set((xDirection / this.numberTiles), 1);
    }
}