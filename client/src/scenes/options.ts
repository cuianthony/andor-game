import { game } from "../api/game";
import { BasicWindowManager } from "../utils/BasicWindowManager";
import { StoryWindow } from "../basicwindows/storywindow";

export default class Options extends Phaser.Scene {
    private posX: number;
    private posY: number;
    private w: number;
    private h: number;
    private gameController: game

    public constructor(data) {
        super({ key: 'Options' });
        console.log(data.x, data.y)
        this.posX = data.x;
        this.posY = data.y;
        this.w = data.w;
        this.h = data.h;
        this.gameController = data.gameController;
    }

    public create() {
        var bg = this.add.image(this.posX, this.posY, 'scrollbg').setDisplaySize(this.w, this.h).setOrigin(0);

        if (!this.game.sound.get('music'))
            this.game.sound.add('music');
        let music = this.game.sound.get('music');

        let title = this.add.text(this.posX+this.w/2, this.posY+30, "Options").setOrigin(0.5);
        // Images for toggling sound on and off
        let soundOn = this.add.image(this.posX+this.w/2-141, this.posY+100, 'sound_on').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        let soundOff = this.add.image(this.posX+this.w/2-141, this.posY+100, 'sound_off').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});

        if (music.isPlaying) {
            soundOff.visible = false;
        } else {
            soundOn.visible = false;
        }
        
        soundOn.on('pointerdown', () => {
            music.stop();
            soundOff.visible = true;
            soundOn.visible = false;
        }, this);

        soundOff.on('pointerdown', () => {
            music.play({
                loop: true,
                volume: 0.5
            });
            soundOff.visible = false;
            soundOn.visible = true;
        }, this);

        let infoOn = this.add.image(this.posX+this.w/2-47, this.posY+100, 'info_on').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        let infoOff = this.add.image(this.posX+this.w/2-47, this.posY+100, 'info_off').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        infoOff.on('pointerdown', () => {
            infoOff.visible = false;
            BasicWindowManager.createWindow(this, 'story', StoryWindow,
                { 
                    x: this.posX + this.w/2 - 300,
                    y: this.posY + this.h/2 - 195,
                    w: 600,
                    h: 390,
                    id: -2
                }
            );
        }, this)
        infoOn.on('pointerup', () => {
            infoOff.visible = true;
        })

        let saveOn = this.add.image(this.posX+this.w/2+47, this.posY+100, 'save_on').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        let saveOff = this.add.image(this.posX+this.w/2+47, this.posY+100, 'save_off').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        saveOff.on('pointerdown', () => {
            saveOff.visible = false;
            this.gameController.save()
        }, this)
        saveOn.on('pointerup', () => {
            saveOff.visible = true;
        })

        let homeOn = this.add.image(this.posX+this.w/2+141, this.posY+100, 'home_on').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        let homeOff = this.add.image(this.posX+this.w/2+141, this.posY+100, 'home_off').setOrigin(0.5, 0).setScale(0.3).setInteractive({useHandCursor: true});
        homeOff.on('pointerdown', () => {
            homeOff.visible = false;
            music.stop();
            let gameScene = this.scene.get('Game')
            gameScene.scene.resume();
            gameScene.cameras.main.alpha = 1;
            this.gameController.returnToLobby();
            this.scene.remove();
        }, this)
        homeOn.on('pointerup', () => {
            homeOff.visible = true;
        })

        let closeButton = this.add.image(this.posX+this.w-26, this.posY+26, 'close_button').setOrigin(0.5).setDisplaySize(22, 22);
        closeButton.setInteractive({useHandCursor: true})
        closeButton.on('pointerdown', () => {
            let gameScene = this.scene.get('Game')
            gameScene.scene.resume();
            gameScene.cameras.main.alpha = 1;
            let overlayScene = this.scene.get('BoardOverlay')
            overlayScene.scene.resume();
            overlayScene.cameras.main.alpha = 1;
            this.scene.remove();
        }, this);
    }
}