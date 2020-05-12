import * as Phaser from 'phaser';
import { Farmer } from './farmer';

export class Tile extends Phaser.GameObjects.Sprite {
    public id: number;
    public x: number;
    public y: number;
    public farmers: Array<Farmer>;
    private fog: Phaser.GameObjects.Sprite;

    constructor(id, scene, x: number, y: number, texture: string, adj: Array<number>) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.farmers = new Array(2);
        this.fog = null;
    }

    public setFog(fog: Phaser.GameObjects.Sprite) {
        this.fog = fog;
    }

    public getFog(): Phaser.GameObjects.Sprite {
        return this.fog;
    }

    public getID() {
        return this.id;
    }

    public toggleInteractive(flag: boolean) {
        if (flag) {
            this.setInteractive({useHandCursor: true});
        } else {
            this.disableInteractive();
        }
    }
}