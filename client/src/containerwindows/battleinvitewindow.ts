import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from '../windows/collabwindow';
import { collabColWidth, collabHeaderHeight, collabRowHeight, collabFooterHeight, reducedWidth, reducedHeight } from "../constants";
import GameScene from "../scenes/game";
import BoardOverlay from "../scenes/boardoverlay";
import { ContainerWindow } from "./containerwindow";
import { ContainerWindowManager } from "../utils/ContainerWindowManager";

export class BattleInviteWindow extends ContainerWindow {
    private gameinstance: game;
    private windowname
    private herokind
    private rolltext;
    private abilitytext;
    private abilitybutton;
    private confirmbutton;
    //for helm
    private helmtext;
    private otherdicetext;
    //for brew
    private brewtext;

    private roll = -1;
    private str = -1;
    private hero
    private gameSceneRef: GameScene
    private monstertileid;
    private overlayRef: BoardOverlay;

    private elements: Phaser.GameObjects.GameObject[]

    public constructor(parentScene: Phaser.Scene, key: string, data) {
        super(parentScene, key, data);
        this.elements = [];
    // public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }, windowZone: Phaser.GameObjects.Zone) {
    //     super(key, windowData, windowZone);
        this.gameinstance = data.controller
        this.windowname = key
        this.herokind = data.hero.getKind()
        this.hero = data.hero
        this.gameSceneRef = data.gamescene
        this.monstertileid = data.monstertileid
        this.overlayRef = data.overlayRef;

        this.initialize();
    }

    protected initialize() {
        var bg = this.parentScene.add.image(0-this.w/2, 0-this.h/2, 'scrollbg').setOrigin(0).setDisplaySize(this.w, this.h);
        bg.tint = 0xff0000

        var headertext = this.parentScene.add.text(10-this.w/2, 10-this.h/2, 'Do you want to join\nthe battle?').setOrigin(0);
        var yesbutton = this.parentScene.add.text(10-this.w/2, 50-this.h/2, 'YES').setInteractive({useHandCursor: true}).setOrigin(0);
        var nobutton = this.parentScene.add.text(50-this.w/2, 50-this.h/2, 'NO').setInteractive({useHandCursor: true}).setOrigin(0);
        this.addElements([ bg, headertext, yesbutton, nobutton ]);

        var self = this

        yesbutton.on('pointerdown', function(pointer) {
            self.hero.incrementHour()
            self.gameinstance.updateHourTracker(self.herokind)
            self.gameinstance.sendBattleInviteResponse('yes', self.herokind)

            bg.setDisplaySize(self.w+120, self.h+20);
            headertext.setPosition(10-this.w/2, 10-this.h/2)
            self.removeElements([ yesbutton, nobutton ]);
            yesbutton.destroy()
            nobutton.destroy()

            headertext.setText('In battle.')
            self.rolltext = self.parentScene.add.text(10-self.w/2, 25-self.h/2, 'Your roll: ' + self.roll + ' Your str: ' + self.str)
            self.addElements([ self.rolltext ]);
            //determine if we are a non-archer hero using the bow from adjacent space
            var bow = false 
            if (self.herokind != 'archer' && self.hero.tile.id != self.monstertileid) {
                bow = true
            }

            self.gameinstance.heroRoll(bow, function(data) {
                self.str = data.strength
                var alldice = data.alldice
                //the case of either an archer or non archer attacking with bow from adjacent space
                if (self.herokind == 'archer' || bow) {
                    var count = 0
                    self.roll = data.rolls[count]
                    self.abilitytext = self.parentScene.add.text(50-self.w/2, 40-self.h/2, 'You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                    self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                    if (count < data.rolls.length - 1) {
                        self.abilitybutton = self.parentScene.add.text(50-self.w/2, 55-self.h/2, 'Click to use ability.').setInteractive({useHandCursor: true})
                        self.abilitybutton.on('pointerdown', function(pointer) {
                            count++
                            self.abilitytext.setText('You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                            self.roll = data.rolls[count]
                            self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                            if (count >= data.rolls.length - 1) {
                                self.abilitybutton.disableInteractive()
                                self.abilitybutton.destroy()
                            }
                        }) 
                    }    
                    self.addElements([ self.abilitytext, self.abilitybutton ]);            
                }
                else {
                    //handle non archer heros
                    self.rolltext.setText('Your roll: ' + data.roll + 'Your str:' + data.strength)
                    self.roll = data.roll
                    //handle mage ability
                    if (self.hero.getKind() == 'mage') {
                        self.abilitytext = self.parentScene.add.text(50-self.w/2, 40-self.h/2, 'You may flip the die to: ' + (7-data.roll))
                        var oppositeside = 7 - data.roll
                        self.abilitybutton = self.parentScene.add.text(50-self.w/2, 55-self.h/2, 'Click to use ability.').setInteractive({useHandCursor: true})
                        self.abilitybutton.on('pointerdown', function(pointer){
                            self.abilitytext.setText('Mage ability used.')
                            self.abilitybutton.disableInteractive()
                            self.roll = oppositeside
                            self.rolltext.setText('Your roll: ' + oppositeside + 'Your str:' + data.strength)
                        })
                        self.addElements([ self.abilitytext, self.abilitybutton ]);
                    }
                    else {
                        self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                            if (itemdict['helm'] == 'true') {
                                self.doHelm(alldice, self.str)
                            }
                            //TODO handle brew, herb, shield
                        })
                    }
                }
                //handle brew here:
                self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                    if (itemdict['smallItems'].includes('half_brew') || itemdict['smallItems'].includes('brew')) {
                        self.brewtext = self.parentScene.add.text(260-self.w/2, 190-self.h/2, 'Click to use\n witch\'s brew.').setInteractive({useHandCursor: true});
                        self.addElements([ self.brewtext ]);
                        self.brewtext.on('pointerdown', function(pointer) {
                            var doubled_roll = self.roll * 2
                            self.rolltext.setText('Your roll: ' + doubled_roll + 'Your str: ' + data.strength)
                            self.roll = doubled_roll
                            self.brewtext.destroy()
                            try {
                                self.helmtext.destroy()
                                self.otherdicetext.destroy()
                            }
                            catch {
                                //its fine
                            }
                            //prioritize consuming a half_brew
                            if (itemdict['smallItems'].includes('half_brew')) {
                                self.gameinstance.consumeItem('half_brew')
                            }
                            else {
                                self.gameinstance.consumeItem('brew')
                            }
                        })

                    }
                })
                
                self.confirmbutton = self.parentScene.add.text(50-self.w/2, 70-self.h/2 ,'Click to confirm your attack.').setInteractive({useHandCursor: true})
                self.addElements([ self.confirmbutton ]);
                self.confirmbutton.on('pointerdown', function(pointer) {
                    //send the roll to battle host and destroy the window.
                    self.gameinstance.confirmroll(self.herokind, self.roll, self.str)
                    //maybe display results first?
                    self.gameinstance.unsubscribeBattleRewardsPopup()
                    // Listen for end of fight rewards distribution
                    self.gameinstance.battleRewardsPopup(function(windowname, involvedHeros, res){
                        let resSize = Object.keys(res).length
                        var width = resSize > 1 ? (resSize + 1) * collabColWidth : 3*collabColWidth;
                        var height = collabHeaderHeight + involvedHeros.length * collabRowHeight + collabFooterHeight;
                        // Convert res object into a map
                        let resMap = new Map<string, number>();
                        Object.keys(res).forEach( resName => {
                            resMap.set(resName, res[resName]);
                        })
                        var collabWindowData = {
                            controller: self.gameinstance,
                            isOwner: true,
                            involvedHeroes: involvedHeros,
                            resources: resMap,
                            x: reducedWidth / 2 - width / 2,
                            y: reducedHeight / 2 - height / 2,
                            w: width,
                            h: height,
                            infight:false,
                            overlayRef: self.overlayRef,
                            gameSceneRef: self.gameSceneRef,
                            ownHeroKind: self.hero.getKind(),
                            type: 'distribute'
                          }
                          WindowManager.createWindow(self.gameSceneRef, windowname, CollabWindow, collabWindowData);
                    })
                    // Close battleinv window
                    ContainerWindowManager.removeWindow(self.key);
                    self.disconnectListeners();
                    self.destroyWindow();
                })   
            })
        })

        nobutton.on('pointerdown', function(pointer) {
            self.gameinstance.sendBattleInviteResponse('no', self.herokind)
            // Close battleinv window
            ContainerWindowManager.removeWindow(self.key);
            self.disconnectListeners();
            self.destroyWindow();
        })

    }

    private doHelm(alldice, str) {
        var self = this
        //hero is either warrior or dwarf: display option to use helmet.
        //we don't display it for other classes because its useless: they roll 1 die
        self.otherdicetext = self.parentScene.add.text(200-this.w/2, 150-this.h/2, 'All your dice: ')
        self.helmtext = self.parentScene.add.text(200-this.w/2, 165-this.h/2, 'Click to use helm.').setInteractive()
        self.addElements([ self.otherdicetext, self.helmtext ]);
        for (let die of alldice) {
            self.otherdicetext.setText(self.otherdicetext.getWrappedText() + ' ' + die)
        }
        self.helmtext.on('pointerdown', function(pointer) {
            try {
                self.brewtext.disableInteractive()
                self.brewtext.setText('')
            }
            catch {}
            self.gameinstance.consumeItem('helm')
            self.helmtext.disableInteractive()
            self.otherdicetext.destroy()
            self.helmtext.destroy()
            var newroll = 0
            var used = []
            for (var i = 0; i < alldice.length; i++) {
                var count = 0
                for (var j = 0; j< alldice.length; j++) {
                    if (alldice[i] == alldice[j]) {
                        count++
                    }
                }
                if (count > 1 && !used.includes(alldice[i])) {
                    newroll += count * alldice[i]
                    used.push(alldice[i])
                }
            }
            self.rolltext.setText('Your roll: ' + newroll + 'Your str: ' + str) 
            self.roll = newroll
        })
    }

    public disconnectListeners() {
        this.gameinstance.unsubscribeBattleRewardsPopup();
    }
}