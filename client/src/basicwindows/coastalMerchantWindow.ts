import { game } from '../api/game';
import { BasicWindow } from "./basicwindow";
import { BasicWindowManager } from '../utils/BasicWindowManager';

export class CoastalMerchantWindow extends BasicWindow {
    private gameController: game;
    private buyStrengthButton: Phaser.GameObjects.Text;
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
        var title = this.parentScene.add.text(this.posX+5, this.posY+5, ` The trade ships\n offer 2 strength\n for 2 gold`, { fontSize: 10, backgroundColor: '#f00' });

        var self = this;

        // Strength icons
        var b1 = this.parentScene.add.image(this.posX+5, this.posY+47, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        var b2 = this.parentScene.add.image(this.posX+45, this.posY+47, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        this.buyStrengthButton = this.parentScene.add.text(this.posX+90, this.posY+72, "Buy", { fontSize: 10, backgroundColor: '#f00' }).setOrigin(0);
        this.buyStrengthButton.setInteractive({useHandCursor: true});
        this.buyStrengthButton.on("pointerdown", function(pointer) {
            // TODO: add some kind of response as to whether this was successful
            self.gameController.buyFromCoastalTrader();
            
            BasicWindowManager.removeWindow("temp_merchant");
            self.disconnectListeners()
            self.destroyWindow();
        }, this)

        let elements = [ bg, title, b1, b2, this.buyStrengthButton ]
        this.addElements(elements);
    }

    public disconnectListeners() {
        this.buyStrengthButton.removeAllListeners('pointerdown');
    }
}
