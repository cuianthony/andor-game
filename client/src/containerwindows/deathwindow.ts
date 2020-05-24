import { game } from '../api/game';
import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from '../utils/ContainerWindowManager';

export class DeathWindow extends ContainerWindow {
    private gameinstance: game;

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);

        this.gameinstance = data.controller
        this.initialize();
    }

    protected initialize() {
        let bg = this.parentScene.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        bg.tint = 0xff0000;
        let msg = this.parentScene.add.text(25-this.w/2, 25-this.h/2, 'You died.\nStrength reduced by 1.\nWill reset to 3.')
        let okbutton = this.parentScene.add.text(100-this.w/2, 200-this.h/2, 'Click to confirm').setInteractive()
        okbutton.on('pointerdown', () => {
            ContainerWindowManager.removeWindow(this.key);
            this.disconnectListeners();
            this.destroyWindow();
        }, this)

        this.addElements([ bg, msg, okbutton ]);
    }

    public disconnectListeners() {}
}