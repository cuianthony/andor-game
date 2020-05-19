import * as Phaser from 'phaser';
import { Farmer } from './farmer';

export class Tile extends Phaser.GameObjects.Sprite {
    public id: number;
    public x: number;
    public y: number;
    private farmers: Array<Farmer>;
    private fog: Phaser.GameObjects.Sprite;

    constructor(id, scene, x: number, y: number) {
        super(scene, x, y, 'tiles', 'pipo-map001-3.png');
        this.id = id;
        this.x = x;
        this.y = y;
        this.farmers = new Array();
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

    public pushFarmer(farmer: Farmer) {
        this.farmers.push(farmer);
    }

    public popFarmer() : Farmer {
        return this.farmers.pop();
    }

    public toggleInteractive(flag: boolean) {
        if (flag) {
            this.setInteractive({useHandCursor: true});
        } else {
            this.disableInteractive();
        }
    }
}