import { game } from '../api/game';
import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from "../utils/ContainerWindowManager";

export class MerchantWindow extends ContainerWindow {
    private gameinstance: game;

    // buy buttons
    private bowBuy
    private helmBuy;
    private shieldBuy;
    private falconBuy;
    private telescopeBuy;
    private wineBuy;
    private strengthBuy;

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);

        this.gameinstance = data.controller
        this.initialize();
    }

    protected initialize() { 
        var self = this
        let elements = [];
        elements.push(this.parentScene.add.image(0-200, 0-200, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h))
        elements.push(this.parentScene.add.sprite(20-200, 20-200, 'hero_border').setOrigin(0));
        elements.push(this.parentScene.add.sprite(24-200, 24-200, 'merchant-trade').setDisplaySize(72, 72).setOrigin(0));

        var buyButtonStyle = {
            color: '#FFFFFF',
            backgroundColor: '#D9B382',
            fontSize: 12
        }

        elements.push(this.parentScene.add.text(110-200, 20-200, 'Merchant', { color: 'fx00', fontSize: 35 }));
        elements.push(this.parentScene.add.text(110-200, 65-200, "Strength points and all items here \ncan be purchased for 2 gold each.", { color: '#4B2504', fontSize: 14 }));
        elements.push(this.parentScene.add.text(20-200, 110-200, "Hello there, weary traveller.\nLookin' to buy some goods eh?", { color: '#4B2504', fontSize: 14 }));

        elements.push(this.parentScene.add.text(20-200,150-200,'Strength:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(20-200, 175-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(25-200, 180-200, 'Strength').setOrigin(0).setDisplaySize(35,35));
        this.strengthBuy = this.parentScene.add.text(80-200, 175-200, 'BUY', buyButtonStyle)
        this.strengthBuy.setInteractive({useHandCursor: true});

        var self = this
        this.strengthBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("strength", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);
        
        elements.push(this.parentScene.add.text(20-200, 225-200,'Bow:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(20-200, 245-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(25-200, 250-200, 'bow').setOrigin(0).setDisplaySize(35,35));
        this.bowBuy = this.parentScene.add.text(70-200, 245-200, 'BUY', buyButtonStyle)
        this.bowBuy.setInteractive({useHandCursor: true})
        this.bowBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("bow", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements.push(this.parentScene.add.text(150-200, 225-200,'Helm:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(150-200, 245-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(155-200, 250-200, 'helm').setOrigin(0).setDisplaySize(35,35));
        this.helmBuy = this.parentScene.add.text(200-200, 245-200, 'BUY', buyButtonStyle)
        this.helmBuy.setInteractive({useHandCursor: true})

        this.helmBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("helm", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements.push(this.parentScene.add.text(270-200, 225-200,'Wineskin:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(270-200, 245-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(275-200, 250-200, 'wineskin').setOrigin(0).setDisplaySize(35,35));
        this.wineBuy = this.parentScene.add.text(320-200, 245-200, 'BUY', buyButtonStyle)
        this.wineBuy.setInteractive({useHandCursor: true})

        this.wineBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("wine", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements.push(this.parentScene.add.text(20-200, 300-200,'Falcon:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(20-200, 320-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(25-200, 325-200, 'falcon').setOrigin(0).setDisplaySize(35,35));
        this.falconBuy= this.parentScene.add.text(70-200, 320-200, 'BUY', buyButtonStyle)
        this.falconBuy.setInteractive({useHandCursor: true})

        this.falconBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("falcon", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements.push(this.parentScene.add.text(150-200, 300-200,'Telescope:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(150-200, 320-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(155-200, 325-200, 'telescope').setOrigin(0).setDisplaySize(35,35));
        this.telescopeBuy = this.parentScene.add.text(200-200, 320-200, 'BUY', buyButtonStyle)
        this.telescopeBuy.setInteractive({useHandCursor: true})

        this.telescopeBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("telescope", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements.push(this.parentScene.add.text(270-200, 300-200,'Shield:', { color: 'fx00' }));
        elements.push(this.parentScene.add.image(270-200, 320-200, 'item_border').setOrigin(0));
        elements.push(this.parentScene.add.image(275-200, 325-200, 'shield').setOrigin(0).setDisplaySize(35,35));
        this.shieldBuy = this.parentScene.add.text(320-200, 320-200, 'BUY', buyButtonStyle)
        this.shieldBuy.setOrigin(0).setInteractive({useHandCursor: true})

        this.shieldBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("shield", function(){
                ContainerWindowManager.removeWindow(self.key);
                self.destroyWindow();
            });

        }, this);

        elements = elements.concat([this.helmBuy, this.strengthBuy, this.telescopeBuy, this.wineBuy, this.bowBuy, this.falconBuy, this.shieldBuy])
        this.addElements(elements);
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
    }
}