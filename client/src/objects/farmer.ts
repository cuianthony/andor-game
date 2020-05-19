import * as Phaser from 'phaser';

export class Farmer extends Phaser.GameObjects.Sprite {
    private tileID: number

    constructor(tileID: number, xPos: number, yPos: number, scene: Phaser.Scene) {
        super(scene, xPos, yPos, 'farmer');
        this.tileID = tileID;
        this.setDisplaySize(40, 40).setInteractive({ useHandCursor: true });
    }

    public getTileID() : number {
        return this.tileID;
    }

    public toggleInteractive(flag: boolean) {
        if (flag) {
            this.setInteractive({useHandCursor: true});
        } else {
            this.disableInteractive();
        }
    }
}