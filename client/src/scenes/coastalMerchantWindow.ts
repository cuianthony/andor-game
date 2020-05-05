import { game } from '../api/game';
import { Window } from "./window";
import {WindowManager} from "../utils/WindowManager";

export class CoastalMerchantWindow extends Window {
    private gameController: game;
    private buyStrengthButton: Phaser.GameObjects.Text;

    public constructor(key: string, data, windowZone: Phaser.GameObjects.Zone) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h }, windowZone);
        this.gameController = data.controller;
    }

    protected initialize() { 
        console.log('initializing tempmerchant window')
        this.add.image(0, 0, 'scrollbg');
        this.add.text(5, 5, ` The trade ships\n offer 2 strength\n for 2 gold`, { fontSize: 12, backgroundColor: '#f00' });

        var self = this;

        // Strength icons
        this.add.image(5, 55, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        this.add.image(45, 55, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        self.buyStrengthButton = self.add.text(35, 120, "Buy", { fontSize: 12, backgroundColor: '#f00' });
        self.buyStrengthButton.setInteractive();
        self.buyStrengthButton.on("pointerdown", function(pointer) {
            self.gameController.buyFromCoastalTrader();
            
            var window = WindowManager.get(this, "temp_merchant")
            window.disconnectListeners() // TODO: check if this call is actually necessary
            window.destroy();
        }, this)
    }

    
}
