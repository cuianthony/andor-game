import { Tile } from "./tile";
import { game } from "../api/game";

export class Merchant extends Phaser.GameObjects.Image {
    private tile: Tile;
    private gameController: game;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: Tile, gameController: game) {
        super(scene, x, y, texture);
        this.tile = tile;
        this.gameController = gameController;

        this.setInteractive({useHandCursor: true})
    }

    public getTileID() {
        return this.tile.getID();
    }

    public toggleInteractive(flag: boolean) {
        if (flag) {
            this.setInteractive({useHandCursor: true});
        } else {
            this.disableInteractive();
        }
    }
}