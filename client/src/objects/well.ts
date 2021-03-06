import { Tile } from "./tile";
import { game } from "../api/game";

export class Well extends Phaser.GameObjects.Image {
    private tile: Tile;
    private gameController: game;
    private used: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: Tile, gameController: game, used: boolean) {
        super(scene, x, y, texture);
        this.tile = tile;
        this.gameController = gameController;
        this.used = used;

        if (this.used) {
            this.setTint(0x404040);
        }

        this.setInteractive({useHandCursor: true})
        var self = this;

        this.on("pointerdown", function (pointer) {
            // Client requests use of the well from the server
            self.gameController.useWell( () => {
                self.used = true;
                self.setTint(0x404040);
            });
        }, this);

        this.gameController.updateWell(function (tileID: number) {
            // Only update if this is the well that was interacted with
            if (tileID != self.tile.getID()) {
                console.log("No interaction on well", self.tile.getID());
                return;
            }
            self.used = true;
            self.setTint(0x404040);
            console.log("Well", tileID, "used by other hero");
        })
    }

    public fillWell() {
        this.clearTint();
        this.used = false;
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