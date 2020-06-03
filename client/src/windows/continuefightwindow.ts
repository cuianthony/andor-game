import { Window } from "./window";

export class ContinueFightWindow extends Window {
    private gameinstance
    private windowname
    private hero

    public constructor(key, data, windowZone: Phaser.GameObjects.Zone) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h }, windowZone);
        this.gameinstance = data.controller
        this.windowname = key
        this.hero = data.hero
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000

        this.add.text(50,20,"Want to continue the fight as leader?")

        var yestext = this.add.text(50,50, 'yes').setInteractive({useHandCursor: true})
        yestext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('yes', self.hero.getKind())
            self.scene.remove(self.windowname)
        })
        var notext = this.add.text(50,100, 'no').setInteractive({useHandCursor: true})
        notext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('no', self.hero.getKind())
            self.scene.remove(self.windowname)
        })
    }

    public disconnectListeners() {}
}