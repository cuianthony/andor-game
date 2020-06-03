import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from "../utils/ContainerWindowManager";

export class ContinueFightWindow extends ContainerWindow {
    private gameinstance;
    private hero;

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);
        this.gameinstance = data.controller
        this.hero = data.hero

        this.initialize();
    }

    protected initialize() {
        var self = this
        var bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h);
        bg.tint = 0xff0000

        var descText = this.parentScene.add.text(10-this.w/2, 10-this.h/2, "Want to continue the fight as leader?").setOrigin(0);

        var yestext = this.parentScene.add.text(10-this.w/2, 50-this.h/2, 'yes').setInteractive({useHandCursor: true}).setOrigin(0);
        yestext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('yes', self.hero.getKind())
            ContainerWindowManager.removeWindow(self.key);
            self.disconnectListeners();
            self.destroyWindow();
        })
        var notext = this.parentScene.add.text(10-this.w/2, 90-this.h/2, 'no').setInteractive({useHandCursor: true}).setOrigin(0);
        notext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('no', self.hero.getKind())
            ContainerWindowManager.removeWindow(self.key);
            self.disconnectListeners();
            self.destroyWindow();
        })

        this.addElements([ bg, descText, yestext, notext ]);
    }

    public disconnectListeners() {}
}