import { Window } from "./window";
import { game } from '../api/game';
import { Farmer } from "../objects/farmer";

export class HeroWindow extends Window {

    public icon
    public gold: number
    public will: number
    public str: number
    public farmers: number
    private goldtext
    private willtext
    private nametext
    private strtext
    private farmtext
    private name
    private gameinstance: game;
    private clienthero;
    private windowhero;

    //items
    private largeItem;
    private smallItem1;
    private smallItem2;
    private smallItem3;

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 400 }) {
        super(key, windowData);
        this.icon = data.icon
        this.name = data.name
        this.gameinstance = data.controller
        this.gold = data.gold
        this.will = data.will
        this.str = data.strength
        this.farmers = data.farmers
        this.clienthero = data.clienthero
        this.windowhero = data.windowhero
        this.largeItem = data.largeItem
    }

    protected initialize() { 
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        var weed = this.add.sprite(50, 50, this.icon);
        this.goldtext = this.add.text(25, 100, 'Gold: ' + this.gold, { backgroundColor: 'fx00' })
        this.willtext = this.add.text(25, 120, 'Willpower: ' + this.will, { backgroundColor: 'fx00' })
        this.strtext = this.add.text(25, 140, 'Strength: ' + this.str, { backgroundColor: 'fx00' })
        this.farmtext = this.add.text(25, 160, 'Farmers: ' + this.farmers, { backgroundColor: 'fx00' })
        this.gameinstance.getHeroItems(self.windowhero, function(itemdict) {
            if (itemdict['largeItem'] != 'empty') {
                self.add.text(25,180,'Large item: ' + itemdict['largeItem'])
            }
            if (itemdict['helm'] != 'false') {
                self.add.text(25,200,'Helm equipped.')
            }
            if (itemdict['smallItems'].length > 0) {
                var smallItemList = itemdict['smallItems']
                for (var i = 0; i < smallItemList.length; i++) {
                    self.setSmallItemText(i, smallItemList[i])
                }
            }
            //todo add other items as theyre added
        })
        this.add.text(25, 240, 'Special ability text ....', { backgroundColor: 'fx00' })

        bg.setInteractive()
        this.input.setDraggable(bg)
        //This drag is pretty f'd up.
        bg.on('drag', function (pointer, dragX, dragY) {
            if (dragX < this.scene.parent.x - 10 && dragY < this.scene.parent.y - 10) {
                this.scene.parent.x = this.scene.parent.x - 10;
                this.scene.parent.y = this.scene.parent.y - 10;
                this.scene.refresh()
            }
            else {
                this.scene.parent.x = dragX;
                this.scene.parent.y = dragY;
                this.scene.refresh()
            }
        });

        var self = this
        if (this.clienthero == this.windowhero){
            this.farmtext.setInteractive()
        }
        this.farmtext.on('pointerdown', function (pointer) {
            self.gameinstance.dropFarmer(function (tilenum) {
                if(self.farmers > 0){
                    self.farmers--;
                    self.farmtext = self.add.text(25, 160, 'Farmers: ' + self.farmers, { backgroundColor: 'fx00' })
                }
            })

        }, this);

        if (this.clienthero == this.windowhero){ 
            this.goldtext.setInteractive()
        }
        var that = this
        this.goldtext.on('pointerdown', function () {            
            console.log("we droppin the gold")
            console.log(that.gold)
            if (that.gold > 0 ) {
                that.gold -= 1
                that.refreshText()
                console.log(that.gold)
                that.gameinstance.dropGold(function () {
                    //create a token on the tile 
                    //indicate the amount of gold on tile

                })
            }           
        });


        this.gameinstance.updateDropGold(function () {
            console.log("here4")// is printed
            that.gold -= 1
            that.refreshText()
            //same code as above to show gold being dropped
        })



    }

    private setSmallItemText(slot:number, item) {
        var self = this

        function defineOnclick(itemText:Phaser.GameObjects.Text, itemtype) {
            itemText.setInteractive()
            switch(itemtype) {
                case 'wineskin':
                    itemText.on('pointerdown', function(pointer) {
                        //TODO: give free move and replace item with a half_wineskin
                        self.gameinstance.useWineskin('full', function() {
                            itemText.setText('half wineskin')
                            itemText.removeAllListeners('pointerdown')
                            defineOnclick(itemText,'half_wineskin')
                        })
                    })
                    break;
                case 'half_wineskin':
                    itemText.on('pointerdown', function(pointer) {
                        self.gameinstance.useWineskin('half', function() {
                            console.log('dont get drunk')
                        })
                    })
                    break;
                case 'telescope':
                    itemText.on('pointerdown', function(pointer) {
                        //TODO: @omar?
                    })
                    break;
                case 'herb':
                    itemText.on('pointerdown', function(pointer) {
                        //TODO: nothing i think
                    })
                    break;
                default:
                    console.log(itemtype, 'does nothing from herowindow.')
                    

            }
        }

        switch (slot) {
            case 0:
                self.smallItem1 = self.add.text(25,220,item)
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem1, item)
                }
                break;
            case 1:
                self.smallItem2 = self.add.text(60,220,item)
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem2, item)
                }
                break;
            case 2:
                self.smallItem3 = self.add.text(95,220,item)
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem3, item)
                }
                break;
        }
    }

    public setGold(amt: number) {
        this.gold = amt
        this.refreshText()
    }

    public setStr(amt: number) {
        this.str = amt
        this.refreshText()
    }

    public setWill(amt: number) {
        this.will = amt
        this.refreshText()
    }

    public setName(name: string) {
        this.name = name
        this.refreshText()
    }

    private refreshText() {
        console.log('refeshing')
        this.goldtext.setText('Gold: ' + this.gold)
        this.willtext.setText('Willpower: ' + this.will)
        
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameinstance.disconnectUpdateDropGold()
    }
}