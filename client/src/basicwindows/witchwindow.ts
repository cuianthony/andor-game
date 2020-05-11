import { game } from '../api/game';
import { BasicWindow } from './basicwindow';

export class WitchWindow extends BasicWindow {
    private gameController: game;
    private buyBrewButton: Phaser.GameObjects.Text;
    private posX: number;
    private posY: number;
    private w: number;
    private h: number;

    public constructor(parentScene: Phaser.Scene, data) {
        super(parentScene);
        this.posX = data.x;
        this.posY = data.y;
        this.w = data.w;
        this.h = data.h;
        this.gameController = data.controller;
        this.initialize();
    }

    protected initialize() { 
        var bg = this.parentScene.add.image(this.posX, this.posY, 'scrollbg').setDisplaySize(this.w, this.h).setOrigin(0);
        var title = this.parentScene.add.text(this.posX+5, this.posY+5, `The witch sells\nher magic brew:`, { fontSize: 10, backgroundColor: '#f00' });

        var self = this;

        // Brew icon
        var brewImage = this.parentScene.add.image(this.posX+5, this.posY+35, 'brew').setDisplaySize(30, 30).setOrigin(0);
        // Get the tile's gold amount from server
        this.buyBrewButton = self.parentScene.add.text(self.posX+33, self.posY+33, "", { fontSize: 10, backgroundColor: '#f00' });
        this.gameController.getNumBrews(function(numBrews: number) {
            self.buyBrewButton.setText(""+numBrews);
            self.buyBrewButton.setInteractive({useHandCursor: true})
            self.buyBrewButton.on("pointerdown", function(pointer) {
                self.gameController.purchaseBrew();
            }, this)
        });

        // While window is active, listen for updates to the number of brews and
        // update the GUI of the window accordingly.
        this.gameController.updateNumBrews(function(newNumBrews) {
            if (newNumBrews) {
                self.buyBrewButton.setText(""+newNumBrews);
            }
        });

        let elements = [ bg, title, brewImage, this.buyBrewButton ]
        this.addElements(elements);
    }

    public disconnectListeners() {
        this.gameController.disconnectUpdateNumBrews();
    }
}
