import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from '../utils/ContainerWindowManager';

// Note: this is only used for *allied* deaths. The death of the hero leading the fight is handled
// in FightWindow
export class DeathWindow extends ContainerWindow {
    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);

        this.initialize();
    }

    protected initialize() {
        let bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h);
        bg.tint = 0xff0000;
        let msg = this.parentScene.add.text(10-this.w/2, 10-this.h/2, 'You died.\nYour strength is reduced by 1.\nYour willpower is reset to 3.').setOrigin(0);
        let okbutton = this.parentScene.add.text(10-this.w/2, 90-this.h/2, 'Click to confirm').setInteractive({useHandCursor: true}).setOrigin(0);
        okbutton.on('pointerdown', () => {
            ContainerWindowManager.removeWindow(this.key);
            this.disconnectListeners();
            this.destroyWindow();
        }, this)

        this.addElements([ bg, msg, okbutton ]);
    }

    public disconnectListeners() {}
}