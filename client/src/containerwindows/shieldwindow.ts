import { game } from '../api/game';
import { ContainerWindow } from './containerwindow';
import { ContainerWindowManager } from '../utils/ContainerWindowManager';

export class ShieldWindow extends ContainerWindow {
    private gameController: game;
    private potentialDamage: number = 0;
    private hero;
    private damaged: boolean;

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);
        this.gameController = data.controller;
        this.potentialDamage = data.potentialDamage;
        this.hero = data.hero;
        this.damaged = data.damagedShield;

        this.initialize();
    }

    protected initialize() {
        var self = this;
        var bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h);
        bg.tint = 0xff0000;
        var desc = this.parentScene.add.text(25-this.w/2, 25-this.h/2, 'You are about to take '+this.potentialDamage+' damage.\nUse shield to prevent?').setOrigin(0);
        var yesButton = this.parentScene.add.text(100-this.w/2, 200-this.h/2, 'Yes').setInteractive({useHandCursor: true}).setOrigin(0);
        var noButton = this.parentScene.add.text(150-this.w/2, 200-this.h/2, 'No').setInteractive({useHandCursor: true}).setOrigin(0);
        yesButton.on('pointerdown', function(pointer) {
            if (self.damaged) {
                self.gameController.consumeItem('damaged_shield')
            }
            else {
                self.gameController.consumeItem('shield')
            }
            self.gameController.sendShieldResp(self.hero.getKind(),'yes');
            ContainerWindowManager.removeWindow(self.key);
            self.disconnectListeners();
            self.destroyWindow();
        })
        noButton.on('pointerdown', function(pointer) {
            //self.gameinstance.doDamageToHero(self.hero.getKind(), self.potentialdamage)
            self.gameController.sendShieldResp(self.hero.getKind(),'no');
            ContainerWindowManager.removeWindow(self.key);
            self.disconnectListeners();
            self.destroyWindow();
        })

        this.addElements([ bg, desc, yesButton, noButton ])
    }

    public disconnectListeners() {}
}