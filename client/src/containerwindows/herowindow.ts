import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
import { TradeWindow } from '../windows/tradewindow';
import { heroCardInfo } from '../constants';
import { ContainerWindow } from "./containerwindow";

export class HeroWindow extends ContainerWindow {
    public icon
    public gold: number
    public will: number
    public str: number
    public farmers: number
    private goldtext
    private willtext
    private strtext
    private farmtext
    private dice
    private gameinstance: game;
    private clienthero;
    private windowhero;
    private windowherotile
    private clientherotile

    //items
    private largeItem: Phaser.GameObjects.Image;
    private helm: Phaser.GameObjects.Image;
    private smallItem1: Phaser.GameObjects.Image;
    private smallItem2: Phaser.GameObjects.Image;
    private smallItem3: Phaser.GameObjects.Image;
    private smallItem1key: string = "none";
    private smallItem2key: string = "none";
    private smallItem3key: string = "none";

    // drop buttons
    private goldDrop;
    private farmerDrop;
    private largeItemDrop;
    private helmDrop;
    private smallItem1Drop;
    private smallItem2Drop;
    private smallItem3Drop;

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);
        this.key = key
        this.icon = data.icon
        this.gameinstance = data.controller
        this.gold = data.gold
        this.will = data.will
        this.str = data.strength
        this.farmers = data.farmers
        this.clienthero = data.clienthero
        this.windowhero = data.windowhero
        this.largeItem = data.largeItem
        this.windowherotile = data.currtileid
        this.clientherotile  = data.clientherotile
        this.dice = data.dice

        this.initialize();
    }

    protected initialize() { 
        var self = this;
        var bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h);
        var hBorder = this.parentScene.add.sprite(20-this.w/2, 20-this.h/2, 'hero_border').setOrigin(0); // TODO: why are sprites being used here
        var hIcon = this.parentScene.add.sprite(24-this.w/2, 24-this.h/2, this.icon).setDisplaySize(72, 72).setOrigin(0);

        var buttonStyle = { 
            color: '#000000',
            backgroundColor: '#D9B382'
        }

        var dropButtonStyle = {
            color: '#FFFFFF',
            backgroundColor: '#D9B382',
            fontSize: 12
        }

        let name = this.parentScene.add.text(110-this.w/2, 20-this.h/2, heroCardInfo[`${this.windowhero}Name`], { color: 'fx00', fontSize: 35 });
        let desc = this.parentScene.add.text(110-this.w/2, 65-this.h/2, heroCardInfo[`${this.windowhero}Desc`], { color: '#4B2504', fontSize: 14 });

        this.goldtext = this.parentScene.add.text(190-this.w/2, 110-this.h/2, 'Gold: ' + this.gold, buttonStyle)
        this.goldDrop = this.parentScene.add.text(300-this.w/2, 110-this.h/2, 'DROP', dropButtonStyle)
        this.farmtext = this.parentScene.add.text(190-this.w/2, 130-this.h/2, 'Farmers: ' + this.farmers, buttonStyle)
        this.farmerDrop = this.parentScene.add.text(300-this.w/2, 130-this.h/2, 'DROP', dropButtonStyle)
        this.willtext = this.parentScene.add.text(20-this.w/2, 110-this.h/2, 'Willpower: ' + this.will, buttonStyle)
        this.strtext = this.parentScene.add.text(20-this.w/2, 130-this.h/2, 'Strength: ' + this.str, buttonStyle)
        
        let l1 = this.parentScene.add.text(20-this.w/2, 155-this.h/2,'Large item:', { color: 'fx00' });
        let l2 = this.parentScene.add.image(20-this.w/2, 175-this.h/2, 'item_border').setOrigin(0);
        let l3 = this.largeItemDrop = this.parentScene.add.text(70-this.w/2, 175-this.h/2, 'DROP', dropButtonStyle)
        let l4 = this.parentScene.add.text(190-this.w/2, 155-this.h/2, 'Helm:', { color: 'fx00' })
        let l5 = this.parentScene.add.image(190-this.w/2, 175-this.h/2, 'item_border').setOrigin(0);
        let l6 = this.helmDrop = this.parentScene.add.text(240-this.w/2, 175-this.h/2, 'DROP', dropButtonStyle)

        let s1 = this.parentScene.add.text(20-this.w/2, 230-this.h/2, 'Small items:', { color: 'fx00' })
        // 3 slots
        let s2 = this.parentScene.add.image(20-this.w/2, 250-this.h/2, 'item_border').setOrigin(0);
        let s3 = this.smallItem1Drop = this.parentScene.add.text(70-this.w/2, 250-this.h/2, 'DROP', dropButtonStyle)
        let s4 = this.parentScene.add.image(120-this.w/2, 250-this.h/2, 'item_border').setOrigin(0);
        let s5 = this.smallItem2Drop = this.parentScene.add.text(170-this.w/2, 250-this.h/2, 'DROP', dropButtonStyle)
        let s6 = this.parentScene.add.image(220-this.w/2, 250-this.h/2, 'item_border').setOrigin(0);
        let s7 = this.smallItem3Drop = this.parentScene.add.text(270-this.w/2, 250-this.h/2, 'DROP', dropButtonStyle)

        this.addElements([
            bg, hBorder, hIcon, name, desc, 
            this.goldtext, this.goldDrop, this.farmtext, this.farmerDrop, this.willtext, this.strtext,
            l1, l2, l3, l4, l5, l6,
            s1, s2, s3, s4, s5, s6, s7
        ])

        this.gameinstance.getHeroItems(self.windowhero, function(itemdict) {
            if (itemdict['largeItem'] != 'empty') {
                self.largeItem = self.parentScene.add.image(25-self.w/2, 180-self.h/2, itemdict['largeItem']).setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.largeItem ]);
            }
            if (itemdict['helm'] != 'false') {
                self.helm = self.parentScene.add.image(195-self.w/2, 180-self.h/2, 'helm').setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.helm ]);
            }
            if (itemdict['smallItems'].length > 0) {
                var smallItemList = itemdict['smallItems']
                for (var i = 0; i < smallItemList.length; i++) {
                    self.setSmallItemText(i, smallItemList[i])
                }
            }
        })

        let infoText = this.parentScene.add.text(20-this.w/2, 305-this.h/2, heroCardInfo[`${this.windowhero}Ability`], { color: '#4B2504', fontSize: 12 })
        let yPos = infoText.y + infoText.displayHeight + 10;
        let diceText = this.parentScene.add.text(20-this.w/2, yPos, this.dice, { color: 'red', fontSize: 12, wordWrap: { width: 350, useAdvancedWrap: true }})
        yPos += diceText.displayHeight + 20;
        // bg.setDisplaySize(400, yPos); // Not sure why this doesn't work after conversion to ContainerWindow
        this.addElements([ infoText, diceText ]);

        var self = this
        if (this.clienthero == this.windowhero){
            this.goldDrop.setInteractive({useHandCursor: true})
            this.farmerDrop.setInteractive({useHandCursor: true})
            this.largeItemDrop.setInteractive({useHandCursor: true})
            this.helmDrop.setInteractive({useHandCursor: true})
            this.smallItem1Drop.setInteractive({useHandCursor: true})
            this.smallItem2Drop.setInteractive({useHandCursor: true})
            this.smallItem3Drop.setInteractive({useHandCursor: true})
        }
        
        // Drop farmer button
        this.farmerDrop.on('pointerdown', function (pointer) {
            self.gameinstance.dropFarmer(() => {
                self.farmers--;
                self.refreshText();
            })
        });

        // Drop gold button
        this.goldDrop.on('pointerdown', function () {            
            self.gameinstance.dropGold();
        });

        // While window is active, respond to updates in gold amount
        function updateGold(hk: string, goldDelta: number) {
            if (hk != self.windowhero) return;
            self.gold += goldDelta;
            self.refreshText();
        }
        this.gameinstance.updateDropGold(updateGold);
        this.gameinstance.updatePickupGold(updateGold);

        // Drop item button
        // itemName is only used for smallItems, defaults to "" otherwise and is unused
        function callDropItem(itemType: string, itemName: string = "") {
            self.gameinstance.dropItem(itemName, itemType);
        }
        this.largeItemDrop.on('pointerdown', function() { callDropItem("largeItem") });
        this.helmDrop.on('pointerdown', function() { callDropItem("helm") });
        this.smallItem1Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem1key) });
        this.smallItem2Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem2key) });
        this.smallItem3Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem3key) });

        function dropItem(hk: string, itemName: string, itemType: string) {
            if (hk != self.windowhero) return;
            // remove the item image from the hero card depending on its type and name
            if (itemType == "largeItem") {
                self.largeItem.removeAllListeners('pointerdown')
                self.removeElements([ self.largeItem ]);
                self.largeItem.destroy();
            } else if (itemType == "helm") {
                self.helm.removeAllListeners('pointerdown')
                self.removeElements([ self.helm ]);
                self.helm.destroy();
            } else if (itemType == "smallItem") {
                if (self.smallItem1key == itemName) {
                    self.smallItem1.removeAllListeners('pointerdown')
                    self.removeElements([ self.smallItem1 ]);
                    self.smallItem1.destroy();
                    self.smallItem1key = "none";
                } else if (self.smallItem2key == itemName) {
                    self.smallItem2.removeAllListeners('pointerdown')
                    self.removeElements([ self.smallItem2 ]);
                    self.smallItem2.destroy();
                    self.smallItem2key = "none";
                } else if (self.smallItem3key == itemName) {
                    self.smallItem3.removeAllListeners('pointerdown')
                    self.removeElements([ self.smallItem3 ]);
                    self.smallItem3.destroy();
                    self.smallItem3key = "none";
                }
            }
        }
        this.gameinstance.updateDropItemHero(dropItem);
        function pickupItem(hk: string, itemName: string, itemType: string) {
            if (hk != self.windowhero) return;
            // add the item image from the hero card depending on its type and name
            if (itemType == "largeItem") {
                self.largeItem = self.parentScene.add.image(25-self.w/2, 180-self.h/2, itemName).setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.largeItem ]);
            } else if (itemType == "helm") {
                self.helm = self.parentScene.add.image(195-self.w/2, 180-self.h/2, 'helm').setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.helm ]);
            } else if (itemType == "smallItem") {
                // find first empty slot to add image to
                let slot = 2;
                if (self.smallItem1key == "none") {
                    slot = 0;
                } else if (self.smallItem2key == "none") {
                    slot = 1;
                }
                self.setSmallItemText(slot, itemName);
            }
        }
        this.gameinstance.updatePickupItemHero(pickupItem);

        // Updating other hero use of wineskin when viewing their HeroWindow
        // TODO: Will need to extend this to other consumable items
        this.gameinstance.receiveUseWineskin(function(hk: string, halforfull: string) {
            if (hk != self.windowhero) return;
            if (halforfull == 'full') {
                dropItem(hk, 'wineskin', 'smallItem');
                pickupItem(hk, "half_wineskin", "smallItem");
            } else {
                dropItem(hk, "half_wineskin", "smallItem");
            }
        })

        this.gameinstance.updatePickupFarmer( (hk: string) => {
            if (hk != self.windowhero) return;
            self.farmers ++;
            self.refreshText();
        })

        this.gameinstance.killHeroFarmers(() => {
            self.farmers = 0;
            self.refreshText();
        })

        this.gameinstance.updateWP( (hk: string, wpDelta: number) => {
            if (hk != self.windowhero) return;
            self.will += wpDelta;
            self.refreshText();
        })

        // TODO WELL: Listen for well use (WP inc) and farmer pickups/drops

        //todo account for falcon
        // console.log('ids:xxxxxxxxxxx', this.windowherotile, this.clientherotile)
        this.gameinstance.getHeroItems(this.clienthero, function(dict) {
            if (self.clienthero != self.windowhero && (self.windowherotile == self.clientherotile ) || self.clienthero != self.windowhero && dict['largeItem'] == 'falcon') {
                let tradeButton = self.parentScene.add.text(320-self.w/2, 20-self.h/2, 'TRADE', {color: "#4944A4"}).setInteractive({useHandCursor: true}).on('pointerdown', function(pointer) {
                    self.gameinstance.sendTradeInvite(self.clienthero, self.windowhero)
                    WindowManager.createWindow(self.parentScene, 'tradewindow', TradeWindow, {gameinstance:self.gameinstance, hosthero:self.clienthero, inviteehero:self.windowhero, parentkey:self.key, clienthero:self.clienthero})
                }, self)
                self.addElements([ tradeButton ]);
            }
        })

    }

    private setSmallItemText(slot:number, item) {
        var self = this

        function defineOnclick(itemIcon:Phaser.GameObjects.Image, itemtype, slot) {
            itemIcon.setInteractive({useHandCursor: true})
            switch(itemtype) {
                case 'wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        //TODO: give free move and replace item with a half_wineskin
                        self.gameinstance.useWineskin('full', function() {
                            itemIcon.setTexture('half_wineskin').setDisplaySize(35, 35);
                            itemIcon.removeAllListeners('pointerdown')
                            defineOnclick(itemIcon,'half_wineskin', slot)
                            switch (slot) {
                                case 0: self.smallItem1key = "half_wineskin"; break;
                                case 1: self.smallItem2key = "half_wineskin"; break;
                                case 2: self.smallItem3key = "half_wineskin"; break;
                            }
                        })
                    })
                    break;
                case 'half_wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        self.gameinstance.useWineskin('half', function() {
                            // console.log('dont get drunk')
                            itemIcon.removeAllListeners('pointerdown')
                            self.removeElements([ itemIcon ]);
                            itemIcon.destroy();
                            switch (slot) {
                                case 0: self.smallItem1key = "none"; break;
                                case 1: self.smallItem2key = "none"; break;
                                case 2: self.smallItem3key = "none"; break;
                            }
                        })
                    })
                    break;
                case 'herb':
                    itemIcon.on('pointerdown', function(pointer) {
                        //TODO: nothing i think
                    })
                    break;
                default:
                    // console.log(itemtype, 'does nothing from herowindow.')
            }
        }

        switch (slot) {
            case 0:
                // console.log("load image into slot 0", item);
                self.smallItem1 = self.parentScene.add.image(25-self.w/2, 255-self.h/2, item).setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.smallItem1 ]);
                self.smallItem1key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem1, item, slot)
                }
                break;
            case 1:
                // console.log("load image into slot 1", item);
                self.smallItem2 = self.parentScene.add.image(125-self.w/2, 255-self.h/2, item).setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.smallItem2 ]);
                self.smallItem2key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem2, item, slot)
                }
                break;
            case 2:
                // console.log("load image into slot 2", item);
                self.smallItem3 = self.parentScene.add.image(225-self.w/2, 255-self.h/2,item).setDisplaySize(35,35).setOrigin(0);
                self.addElements([ self.smallItem3 ]);
                self.smallItem3key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem3, item, slot)
                }
                break;
        }
    }

    public setGold(amt: number) {
        this.gold = amt
        this.goldtext.setText('Gold: ' + this.gold)
        // this.refreshText()
    }

    public setStr(amt: number) {
        this.str = amt
        this.strtext.setText('Strength: ' + this.str)
        // this.refreshText()
    }

    public setWill(amt: number) {
        this.will = amt
        this.willtext.setText('Willpower: ' + this.will)
        // this.refreshText()
    }

    private refreshText() {
        this.goldtext.setText('Gold: ' + this.gold)
        this.willtext.setText('Willpower: ' + this.will)
        this.farmtext.setText('Farmers: ' + this.farmers)
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameinstance.disconnectUpdateDropGold();
        this.gameinstance.disconnectUpdatePickupGold();
        this.gameinstance.disconnectUpdateDropItemHero();
        this.gameinstance.disconnectUpdatePickupItemHero();
        this.gameinstance.disconnectReceiveUseWineskin();
        this.gameinstance.disconnectKillHeroFarmers();
        this.gameinstance.disconnectUpdatePickupFarmer();
        this.gameinstance.disconnectUpdateWP();
    }
}