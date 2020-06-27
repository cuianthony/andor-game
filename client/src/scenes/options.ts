import { BasicWindow } from "../basicwindows/basicwindow";
import { game } from "../api/game";

export default class Options extends BasicWindow {
    private posX: number;
    private posY: number;
    private w: number;
    private h: number;
    private gameController: game

    public constructor(parentScene: Phaser.Scene, data) {
        super(parentScene);
        this.posX = data.x;
        this.posY = data.y;
        this.w = data.w;
        this.h = data.h;
        this.gameController = data.gameController;

        this.initialize();
    }

    protected initialize() {
        var bg = this.parentScene.add.image(this.posX, this.posY, 'scrollbg').setDisplaySize(this.w, this.h).setOrigin(0);

        if (!this.parentScene.game.sound.get('music'))
            this.parentScene.game.sound.add('music');
        let music = this.parentScene.game.sound.get('music');

        let title = this.parentScene.add.text(this.posX+this.w/2, this.posX+15, "Options").setOrigin(0.5);
        // Images for toggling sound on and off
        let soundOn = this.parentScene.add.image(this.posX+this.w/2-200, this.posX+50, 'sound_on').setOrigin(0.5).setScale(0.2).setInteractive({useHandCursor: true});
        let soundOff = this.parentScene.add.image(this.posX+this.w/2-200, this.posX+50, 'sound_off').setOrigin(0.5).setScale(0.2).setInteractive({useHandCursor: true});

        if (music.isPlaying) {
            soundOn.visible = false;
        } else {
            soundOff.visible = false;
        }
        
        soundOn.on('pointerdown', () => {
            music.stop();
            soundOff.visible = true;
        }, this);

        soundOff.on('pointerdown', () => {
            music.play({
                loop: true,
                volume: 0.5
            });
            soundOff.visible = false;
        }, this);

        let elements = [ bg, title, soundOn, soundOff ];
        this.addElements(elements);
    }

    public disconnectListeners() { }
}