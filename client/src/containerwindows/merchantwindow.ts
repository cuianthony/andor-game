import { game } from '../api/game';
import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from "../utils/ContainerWindowManager";

export class MerchantWindow extends ContainerWindow {
    private gameinstance: game;
    private elements: Phaser.GameObjects.GameObject[]

    private buyButtonStyle = {
        color: '#FFFFFF',
        backgroundColor: '#D9B382',
        fontSize: 12
    }

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);

        this.gameinstance = data.controller
        this.elements = [];
        this.initialize();
    }

    protected initialize() { 
        this.elements.push(this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h))
        this.elements.push(this.parentScene.add.image(20-this.w/2, 20-this.h/2, 'hero_border').setOrigin(0));
        this.elements.push(this.parentScene.add.image(24-this.w/2, 24-this.h/2, 'merchant-trade').setDisplaySize(72, 72).setOrigin(0));

        this.elements.push(this.parentScene.add.text(110-this.w/2, 20-this.h/2, 'Merchant', { color: 'fx00', fontSize: 35 }));
        this.elements.push(this.parentScene.add.text(110-this.w/2, 65-this.h/2, "Hello there, weary traveller.\nLookin' to buy some goods eh?", { color: '#4B2504', fontSize: 14 }));
        this.elements.push(this.parentScene.add.text(20-this.w/2, 110-this.h/2, "All wares cost 2 gold each.", { color: '#4B2504', fontSize: 12 }));

        let closeButton = this.parentScene.add.image(338-this.w/2, 20-this.h/2, 'close_button').setOrigin(0).setDisplaySize(22, 22);
        closeButton.setInteractive({useHandCursor: true})
        closeButton.on('pointerdown', function (pointer) {
            ContainerWindowManager.removeWindow(this.key);
            this.disconnectListeners();
            this.destroyWindow();
        }, this);
        this.elements.push(closeButton);

        this.populateItem('Bow:', 'bow', 20, 135);
        this.populateItem('Falcon:', 'falcon', 150, 135);
        this.populateItem('Shield:', 'shield', 270, 135);
        this.populateItem('Wineskin:', 'wineskin', 20, 210);
        this.populateItem('Telescope:', 'telescope', 150, 210);
        this.populateItem('Helm:', 'helm', 270, 210);
        this.populateItem('Strength:', 'Strength', 20, 285);

        this.addElements(this.elements);
    }

    private populateItem(displayName: string, texture: string, x: number, y: number) {
        let nameText = this.parentScene.add.text(x-this.w/2, y-this.h/2, displayName, { color: 'fx00' });
        let borderImage = this.parentScene.add.image(x-this.w/2, y+20-this.h/2, 'item_border').setOrigin(0);
        let itemImage = this.parentScene.add.image(x+5-this.w/2, y+25-this.h/2, texture).setOrigin(0).setDisplaySize(35,35);
        let buyButton = this.parentScene.add.text(x+50-this.w/2, y+20-this.h/2, 'BUY', this.buyButtonStyle)
        
        buyButton.setInteractive({useHandCursor: true})
        let self = this;
        buyButton.on('pointerdown', function (pointer) {
            this.gameinstance.merchant(texture, function(){
                ContainerWindowManager.removeWindow(self.key);
                self.disconnectListeners();
                self.destroyWindow();
            });
        }, this);

        this.elements = this.elements.concat(nameText, borderImage, itemImage, buyButton);
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
    }
}