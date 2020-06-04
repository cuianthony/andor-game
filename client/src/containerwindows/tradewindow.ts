import { game } from '../api/game';
import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from "../utils/ContainerWindowManager";

export class TradeWindow extends ContainerWindow {
    private parentkey: String
    private gameinstance: game
    private windowname
    private hosthero
    private inviteehero
    private clienthero

    private HEADERTEXT_Y = 25
    private HOST_ITEM_X = 60
    private INVITEE_ITEM_X = 564
    private HELM_Y = 440
    private LARGE_Y = 120
    private SMALL_Y = [200, 280, 360]
    private GOLD_Y = 510
    private OFFER_OFFSET = 120

    private host_offers = {'smallItems':[],'largeItem':'None','helm':'None','gold':0}
    private invitee_offers = {'smallItems':[],'largeItem':'None','helm':'None','gold':0}
    private your_offers_ptr
    private their_item_icons = []
    private your_item_icons = []

    private hostconfirmtext
    private inviteeconfirmtext
    private yourconfirmtext_pointer
    private confirmed: boolean = false

    // public constructor(key: string, data, windowData = { x: 350, y: 30, width: 624, height: 624 }, windowZone: Phaser.GameObjects.Zone) {
    //     super(key, windowData, windowZone);
    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);
        this.gameinstance = data.gameinstance
        this.windowname = key
        this.parentkey = data.parentkey
        this.windowname = key
        this.hosthero = data.hosthero
        this.inviteehero = data.inviteehero
        this.clienthero = data.clienthero
        this.your_offers_ptr = (this.clienthero == this.hosthero) ? this.host_offers : this.invitee_offers

        this.initialize();
    }

    protected initialize() {
        var self = this
        var bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'trademenubg').setOrigin(0).setDisplaySize(this.w, this.h);
        this.addElements([ bg ]);
        this.addTexts()

        //set up left hand side (host) item icons
        var offsetcount = 0
        this.gameinstance.getHeroItems(this.hosthero, function(itemdict) {
            if (itemdict['helm'] != 'false') {
                let helm = self.parentScene.add.sprite(self.HOST_ITEM_X - self.w/2, self.HELM_Y - self.h/2, 'helm').setInteractive()
                self.addElements([ helm ]);
                if (self.clienthero == self.hosthero) {
                    self.addOnClick(helm,self.clienthero,'helm',offsetcount)
                    offsetcount++
                }
                else {
                    self.their_item_icons.push(helm)
                }
            }
            if (itemdict['largeItem'] != 'empty') {
                let largeitem = self.parentScene.add.sprite(self.HOST_ITEM_X - self.w/2, self.LARGE_Y - self.h/2, itemdict['largeItem']).setInteractive()
                self.addElements([ largeitem ]);
                if (self.clienthero == self.hosthero) {
                    self.addOnClick(largeitem,self.clienthero,'largeItem',offsetcount)
                    offsetcount++
                }
                else {
                    self.their_item_icons.push(largeitem)
                }
            }
            if (itemdict['smallItems'].length > 0) {
                for (let i = 0; i < itemdict['smallItems'].length; i++) {
                    let smallitem = self.parentScene.add.sprite(self.HOST_ITEM_X - self.w/2, self.SMALL_Y[i] - self.h/2, itemdict['smallItems'][i]).setInteractive()
                    self.addElements([ smallitem ]);
                    if (self.clienthero == self.hosthero) {
                        self.addOnClick(smallitem,self.clienthero,'smallItems', offsetcount)
                        offsetcount++
                    }
                    else {
                        self.their_item_icons.push(smallitem)
                    }
                }
            }
            var host_gold = self.parentScene.add.text(self.HOST_ITEM_X - 20 - self.w/2, self.GOLD_Y - self.h/2, 'Gold: ' + itemdict['gold'],{color: "#4944A4"}).setInteractive()
            var host_offer_gold = self.parentScene.add.text(self.HOST_ITEM_X - 20 + self.OFFER_OFFSET - self.w/2, self.GOLD_Y - self.h/2,'').setInteractive()
            self.addElements([ host_gold, host_offer_gold ])
            var hostgoldcnt = itemdict['gold']
            var hostoffergoldcnt = 0
            if (self.clienthero == self.hosthero) {
                host_gold.on('pointerdown', function(pointer) {
                    console.log('here')
                    if (hostgoldcnt > 0) {
                        hostgoldcnt--
                        hostoffergoldcnt++
                        host_gold.setText('Gold: ' + hostgoldcnt)
                        host_offer_gold.setText('Gold: ' + hostoffergoldcnt)
                        self.host_offers['gold'] = hostoffergoldcnt
                    }
                })
            }
            if (self.clienthero == self.hosthero) {
                host_offer_gold.on('pointerdown', function(pointer) {
                    if (hostoffergoldcnt > 0) {
                        hostgoldcnt++
                        hostoffergoldcnt--
                        host_gold.setText('Gold: ' + hostgoldcnt)
                        host_offer_gold.setText('Gold: ' + hostoffergoldcnt)
                        self.host_offers['gold'] = hostoffergoldcnt
                    }
                })
            }
        })


        //set up right hand side (invitee) item icons
        this.gameinstance.getHeroItems(this.inviteehero, function(itemdict) {
            if (itemdict['helm'] != 'false') {
                let helm = self.parentScene.add.sprite(self.INVITEE_ITEM_X - self.w/2, self.HELM_Y - self.h/2, 'helm').setInteractive()
                self.addElements([ helm ]);
                if (self.clienthero == self.inviteehero) {
                    self.addOnClick(helm,self.inviteehero,'helm', offsetcount)
                    offsetcount++
                }
                else {
                    self.their_item_icons.push(helm)
                }
            }
            if (itemdict['largeItem'] != 'empty') {
                let largeitem = self.parentScene.add.sprite(self.INVITEE_ITEM_X - self.w/2, self.LARGE_Y - self.h/2, itemdict['largeItem']).setInteractive()
                self.addElements([ largeitem ]);
                if (self.clienthero == self.inviteehero) {
                    self.addOnClick(largeitem,self.inviteehero,'largeItem', offsetcount)
                    offsetcount++
                }
                else {
                    self.their_item_icons.push(largeitem)
                }
            }
            if (itemdict['smallItems'].length > 0) {
                for (let i = 0; i < itemdict['smallItems'].length; i++) {
                    let smallitem = self.parentScene.add.sprite(self.INVITEE_ITEM_X - self.w/2, self.SMALL_Y[i] - self.h/2, itemdict['smallItems'][i]).setInteractive()
                    self.addElements([ smallitem ]);
                    if (self.clienthero == self.inviteehero) {
                        self.addOnClick(smallitem,self.inviteehero,'smallItems', offsetcount)
                        offsetcount++
                    }
                    else {
                        self.their_item_icons.push(smallitem)
                    }
                }
            }
            var inv_gold = self.parentScene.add.text(self.INVITEE_ITEM_X - 20 - self.w/2, self.GOLD_Y - self.h/2, 'Gold: ' + itemdict['gold'], {color: "#4944A4"}).setInteractive()
            var inv_offer_gold = self.parentScene.add.text(self.INVITEE_ITEM_X - 20 - self.OFFER_OFFSET - self.w/2, self.GOLD_Y - self.h/2,'').setInteractive()
            self.addElements([ inv_gold, inv_offer_gold ])
            var invgoldcnt = itemdict['gold']
            var invoffergoldcnt = 0
            if (self.clienthero == self.inviteehero) {
                inv_gold.on('pointerdown', function(pointer) {
                    if (invgoldcnt > 0) {
                        invgoldcnt--
                        invoffergoldcnt++
                        inv_gold.setText('Gold: ' + invgoldcnt)
                        inv_offer_gold.setText('Gold: ' + invoffergoldcnt)
                        self.invitee_offers['gold'] = invoffergoldcnt
                    }
                })
            }
            if (self.clienthero == self.inviteehero) {
                inv_offer_gold.on('pointerdown', function(pointer) {
                    if (invoffergoldcnt > 0) {
                        invgoldcnt++
                        invoffergoldcnt--
                        inv_gold.setText('Gold: ' + invgoldcnt)
                        inv_offer_gold.setText('Gold: ' + invoffergoldcnt)
                        self.invitee_offers['gold'] = invoffergoldcnt
                    }
                })
            }
        })

        this.gameinstance.receiveTradeOfferChanged(function(their_item_index) {
            self.unconfirm()
            if (self.clienthero == self.hosthero) {
                if (self.their_item_icons[their_item_index].x == self.INVITEE_ITEM_X) {
                    self.their_item_icons[their_item_index].x -= self.OFFER_OFFSET
                }
                else {
                    self.their_item_icons[their_item_index].x = self.INVITEE_ITEM_X
                }
            }
            else {
                if (self.their_item_icons[their_item_index].x == self.HOST_ITEM_X) {
                    self.their_item_icons[their_item_index].x += self.OFFER_OFFSET
                }
                else {
                    self.their_item_icons[their_item_index].x = self.HOST_ITEM_X
                }
            }
        })

        this.hostconfirmtext = this.parentScene.add.text(this.HOST_ITEM_X - 20 - this.w/2, this.GOLD_Y + 20 - this.h/2, 'UNCONFIRMED', {color:"#BC2B2B"})
        this.inviteeconfirmtext = this.parentScene.add.text(this.INVITEE_ITEM_X - 45 - this.w/2, this.GOLD_Y + 20 - this.h/2, 'UNCONFIRMED', {color:"#BC2B2B"})
        this.addElements([ this.hostconfirmtext, this.inviteeconfirmtext ])
        this.yourconfirmtext_pointer = (this.clienthero == this.hosthero) ? this.hostconfirmtext : this.inviteeconfirmtext
        this.yourconfirmtext_pointer.setInteractive()
        this.yourconfirmtext_pointer.on('pointerdown', function(pointer){
            if (self.confirmed == false) {
                this.setText('CONFIRMED')
                this.setColor("#3FC936")
                self.gameinstance.submitOffer(self.your_offers_ptr)
                self.confirmed = true
            }
            else {
                self.unconfirm()
                self.gameinstance.submitOffer('unconfirm')
            }
        })
        this.gameinstance.receiveOffer(function(theiroffers) {
            console.log('offer received: ', theiroffers)
            var theirconfirmtext = (self.clienthero == self.hosthero) ? self.inviteeconfirmtext : self.hostconfirmtext
            if (self.clienthero == self.hosthero ) {
                self.invitee_offers = theiroffers
            }
            else {
                self.host_offers = theiroffers
            }
            theirconfirmtext.setText("CONFIRMED")
            theirconfirmtext.setColor("#3FC936")
            if (self.confirmed == true) {
                //do logic to actually give the items to the heros on backend TODO
                //TODO close the trade windows
                console.log('done', self.host_offers, self.invitee_offers)
                self.gameinstance.validateTrade(self.hosthero, self.inviteehero, self.invitee_offers, self.host_offers, function(result) {
                    if (result == 'pass') {
                        self.gameinstance.executeTrade(self.hosthero,self.host_offers, self.invitee_offers)
                        self.gameinstance.executeTrade(self.inviteehero, self.invitee_offers, self.host_offers)
                        self.closeWindow()
                    }
                    else {
                        //alert em
                    }
                })

            }
            //no else its the first window to confirm that will execute the trade for both heros
        }) 

        let exit = this.parentScene.add.text(this.INVITEE_ITEM_X / 2 + this.HOST_ITEM_X - this.w/2, this.GOLD_Y + 20 - this.h/2, 'EXIT', {color:"#BC2B2B"})
        .setInteractive().on('pointerdown', function(pointer) {
            self.closeWindow()
        })
        this.addElements([ exit ])

        this.gameinstance.endTradeListener(function() {
            self.closeWindow()
        })

    }



    private addOnClick(icon, hero, itemtype, offsetcount) {
        var self = this
        icon.on('pointerdown', function(pointer) {
            if (self.clienthero == self.hosthero) {
                self.inviteeconfirmtext.setText("UNCONFIRMED")
                self.inviteeconfirmtext.setColor("#BC2B2B")
            } else {
                self.hostconfirmtext.setText("UNCONFIRMED")
                self.hostconfirmtext.setColor("#BC2B2B")
            }
            if (self.clienthero == hero) {
                var itemname = icon.texture.key

                if (hero == self.hosthero ) {
                    if (icon.x == self.HOST_ITEM_X - self.w/2) {
                        icon.x = icon.x + self.OFFER_OFFSET
                        if (itemtype == 'smallItems') {
                            self.host_offers['smallItems'].push(itemname)
                        }
                        else{
                            self.host_offers[itemtype] = itemname
                        }
                    }
                    else {
                        icon.x = self.HOST_ITEM_X - self.w/2
                        if (itemtype == 'smallItems') {
                            const index = self.host_offers['smallItems'].indexOf(itemname);
                            if (index > -1) {
                            self.host_offers['smallItems'].splice(index, 1);
                            }
                        }
                        else{
                            self.host_offers[itemtype] = 'None'
                        }
                    }
                    self.gameinstance.sendTradeOfferChanged(self.inviteehero, offsetcount)
                }

                else {
                    if (icon.x == self.INVITEE_ITEM_X - self.w/2) {
                        icon.x = icon.x - self.OFFER_OFFSET
                        if (itemtype == 'smallItems') {
                            self.invitee_offers['smallItems'].push(itemname)
                        }
                        else{
                            self.invitee_offers[itemtype] = itemname
                        }
                    }
                    else {
                        icon.x = self.INVITEE_ITEM_X - self.w/2
                        if (itemtype == 'smallItems') {
                            const index = self.invitee_offers['smallItems'].indexOf(itemname);
                            if (index > -1) {
                            self.invitee_offers['smallItems'].splice(index, 1);
                            }
                        }
                        else{
                            self.invitee_offers[itemtype] = 'None'
                        }
                    }
                    self.gameinstance.sendTradeOfferChanged(self.hosthero, offsetcount)
                }
            }
        })
    }

    private addTexts() {
        let t1 = this.parentScene.add.text(this.HOST_ITEM_X - 15 - this.w/2, this.HEADERTEXT_Y - this.h/2, 'Host items:', {color: "#4944A4"})
        let t2 = this.parentScene.add.text(this.HOST_ITEM_X + this.OFFER_OFFSET - 15 - this.w/2, this.HEADERTEXT_Y - this.h/2, 'Host offers:',{color: "#4944A4"})
        let t3 = this.parentScene.add.text(this.INVITEE_ITEM_X - this.OFFER_OFFSET -100 - this.w/2, this.HEADERTEXT_Y - this.h/2, 'Invitee offers:', {color: "#4944A4"})
        let t4 = this.parentScene.add.text(this.INVITEE_ITEM_X - 70 - this.w/2, this.HEADERTEXT_Y - this.h/2, 'Invitee items:',{color: "#4944A4"})
        this.addElements([ t1, t2, t3, t4 ]);
    }

    private unconfirm() {
        this.confirmed = false;
        this.yourconfirmtext_pointer.setText("UNCONFIRMED")
        this.yourconfirmtext_pointer.setColor("#BC2B2B")
    }

    private closeWindow() {
        this.gameinstance.tradeDone()
        ContainerWindowManager.removeWindow(this.key)
        this.disconnectListeners();
        this.destroyWindow();
    }

    public disconnectListeners() {
        this.gameinstance.unsubscribeTradeListeners();
    }
}