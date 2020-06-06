import { ChatWindow } from '../basicwindows/chatwindow';
import { HeroWindow, TradeWindow } from '../containerwindows/containerwindows';
import { BasicWindowManager } from '../utils/BasicWindowManager';
import { ContainerWindowManager } from '../utils/ContainerWindowManager';
import { game } from '../api/game';
import { Tile, Monster, HourTracker, Well, HeroKind, Hero } from '../objects';
import { reducedWidth, reducedHeight, mOffset } from '../constants';
// UI plugin
import { ScrollablePanel, RoundRectangle, FixWidthSizer } 
    from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export default class BoardOverlay extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    private heroButtons: Map<string, Phaser.GameObjects.Image> = new Map();
    private gameController: game;
    private saveButton: Phaser.GameObjects.Image;
    private endTurnButton: Phaser.GameObjects.Image;
    private chatButton: Phaser.GameObjects.Image;
    private clientHeroObject: Hero;
    private herb;
    private initialCollabDone: boolean;

    // End Day
    private endDayButton: Phaser.GameObjects.Image;
    private tiles: Tile[];
    private monsterNameMap: Map<string, Monster>;
    private hourTracker: HourTracker;
    private wells: Map<string, Well>;
    private hk: HeroKind;

    // Positioning
    private x: number = 0;
    private y: number = 0;
    private width: number = reducedWidth;
    private height: number = reducedHeight;

    // Scrollable panel
    private COLOR_PRIMARY = 0xD9B382;
    private COLOR_LIGHT = 0x7b5e57;
    private COLOR_DARK = 0x4B2504;
    private content; // game log content

    // DEBUG TODO: remove position overlay
    private posInfo;
    private cameraInfo;

    constructor(data) {
        super({
            key: 'BoardOverlay'
        })
        this.gameController = data.gameinstance;
        this.tiles = data.tiles;
        this.monsterNameMap = data.monsterMap;
        this.hourTracker = data.hourTracker;
        this.wells = data.wells;
        this.hk = data.hk
        this.clientHeroObject = data.clientheroobject
        this.herb = data.herb;
        this.initialCollabDone = data.initialCollabDone;
        this.content = this.initialCollabDone ? 
        `View in game updates here:\n > Game loaded.` : `View in game updates here:\n > The legend begins.`;
    }

    public init() { }

    public preload() {
        this.load.image('hourbar', './assets/board-major/hours.PNG')
        this.load.image('endturnicon', './assets/overlay-components/endturn.png')
        this.load.image('enddayicon', './assets/overlay-components/endday.png')
        this.load.image('chaticon', './assets/overlay-components/chat.png')
        this.load.image('archericon', './assets/overlay-components/archerbtn.png')
        this.load.image('dwarficon', './assets/overlay-components/dwarfbtn.png')
        this.load.image('mageicon', './assets/overlay-components/magebtn.png')
        this.load.image('warrioricon', './assets/overlay-components/warriorbtn.png')
        this.load.image("saveicon", "./assets/overlay-components/save.png")
    }

    public create() {
        // Set the overlay as a top bar on the game
        this.parent = this.add.zone(this.x, this.y, this.width, this.height).setOrigin(0);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);
        
        // DEBUG TODO: remove game size debugging
        this.posInfo = this.add.text(5, 75, `posX: 0\nposY: 0`);
        this.cameraInfo = this.add.text(5, 115, `cameraX: 0\ncameraY: 0`);
        this.input.on('pointerdown', (pointer) => {
            this.posInfo.setText(`posX: ${pointer.x}\nposY: ${pointer.y}`)
        });

        var self = this;

        //Options
        var optionsIcon = this.add.image(55, 40, 'optionsicon').setInteractive({useHandCursor: true});
        optionsIcon.setScale(0.2)
        optionsIcon.on('pointerdown', function (pointer) {
            this.scene.bringToTop('Options')
            this.scene.wake('Options')
        }, this);

        // save btn
        this.saveButton = this.add.image(920, 25, 'saveicon').setScale(0.25);
        this.saveButton.on('pointerdown', () => {
            this.gameController.save()
        }, this);

        // chat window
        this.chatButton = this.add.image(775, 565, 'chaticon').setScale(0.3)
        this.chatButton.setInteractive({useHandCursor: true});
        this.chatButton.on('pointerdown', function (pointer) {
            if (BasicWindowManager.hasWindow('chat')) {
                let window = BasicWindowManager.removeWindow(`chat`);
                window.disconnectListeners();
                window.destroyWindow();
            } else {
                this.tweens.add({
                    targets: this.chatButton,
                    alpha: 0.3,
                    duration: 350,
                    ease: 'Power3',
                    yoyo: true
                });
                BasicWindowManager.createWindow(this, "chat", ChatWindow, 
                    { 
                        controller: this.gameController, 
                        x: 707, 
                        y: 410
                    }
                )
            }
        }, this);

        // end turn button
        this.endTurnButton = this.add.image(900, 565, 'endturnicon').setScale(0.3)
        this.endTurnButton.on('pointerdown', function (pointer) {
            this.gameController.endTurn();
            // Todo: Tween will trigger whether or not it is your turn, not sure if we want to change that
            this.tweens.add({
                targets: this.endTurnButton,
                alpha: 0.3,
                duration: 350,
                ease: 'Power3',
                yoyo: true
            });
        }, this)

        this.endDaySetup();

        // TRADE
        this.gameController.receiveTradeInvite(function (host, invitee) {
            ContainerWindowManager.createWindow(self, 'tradewindow', TradeWindow, 
                {
                    x: reducedWidth/2 - 624/2, 
                    y: reducedHeight/2 - 624/2, 
                    w: 624, 
                    h: 624, 
                    gameinstance: self.gameController, 
                    hosthero: host, 
                    inviteehero: invitee, 
                    parentkey: 'None', 
                    clienthero: invitee
                }
            )
        })

        // Add rexUI scrollable panel for game log
        var panelBg = new RoundRectangle(this, 0, 0, 2, 2, 5, this.COLOR_PRIMARY);
        var panelChild = new FixWidthSizer(this, {
            space: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2,
                item: 3,
                line: 3,
            }
        });
        var panelTrack = new RoundRectangle(this, 0, 0, 10, 5, 5, this.COLOR_DARK);
        var panelThumb = new RoundRectangle(this, 0, 0, 0, 0, 8, this.COLOR_LIGHT);
        var panelConfig = {
            x: 215,
            y: 545,
            width: 300,
            height: 70,
            scrollMode: 0,
            background: this.add.existing(panelBg),
            panel: {
                child: this.add.existing(panelChild),
                mask: {
                    padding: 1
                },
            },
            slider: {
                track: this.add.existing(panelTrack),
                thumb: this.add.existing(panelThumb),
            },
            space: {
                left: 3,
                right: 3,
                top: 3,
                bottom: 3,
                panel: 3,
            }
        }
        var panel = new ScrollablePanel(this, panelConfig).layout();
        this.add.existing(panel);
        this.updatePanel(panel, this.content);

        this.gameController.getCurrPlayersTurn(function(hk: string) {
            self.updateContent(panel, `It is the ${hk}'s turn.`)
        })
      
        // Listen for updates to log from server
        this.gameController.updateGameLog(function(update: string) {
            console.log("game log update:", update, "||")
            self.updateContent(panel, update);
        })

        // Indicator of the hero you are playing
        let heroTexture = this.clientHeroObject.getKind();
        this.add.image(10, 512, heroTexture).setScale(0.16).setOrigin(0);

        // TODO DEBUG: Remove, used for narrator testing
        // var advance = this.add.text(400, 560, "ADVANCE NARRATOR", {
        //     fontFamily: '"Roboto Condensed"',
        //     fontSize: "20px",
        //     backgroundColor: '#f00',
        //     "text-transform": "uppercase"
        // }).setInteractive()
        // advance.on('pointerdown', function (pointer) {
        //     this.gameinstance.advanceNarrator();
        // }, this)

        this.gameController.getHeros((heros) => {
            heros.forEach(type => {
                if (type === "mage") {
                    this.addHeroCard(type, 445);
                } else if (type === "archer") {
                    this.addHeroCard(type, 330);
                } else if (type === "warrior") {
                    this.addHeroCard(type, 215);
                } else if (type === "dwarf") {
                    this.addHeroCard(type, 100);
                }
            });

            // DEBUG TODO: remove
            // this.toggleInteractive(true);
            //

            if (this.initialCollabDone) {
                this.toggleInteractive(true);
            }
        })
    }

    private updateContent(panel: ScrollablePanel, update: string) {
        this.content += `\n > ${update}`;
        this.updatePanel(panel, this.content);
        panel.scrollToBottom();
    }

    private updatePanel(panel: ScrollablePanel, content: string) {
        var sizer = panel.getElement('panel');
        var scene = panel.scene;
    
        sizer.clear(true);
        var lines = content.split('\n');
        for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
            var words = lines[li].split(' ');
            for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
                sizer.add(
                    scene.add.text(0, 0, words[wi], {
                        fontSize: 10,
                        color: '#000000'
                    })
                );
            }
            if (li < (lcnt - 1)) {
                sizer.addNewLine();
            }
        }
    
        panel.layout();
        return panel;
    }

    private addHeroCard(type, x) {
        var self = this;
        switch (type) {
            case "archer":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'archericon').setScale(0.25));
                break;
            case "dwarf":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'dwarficon').setScale(0.25));
                break;
            case "mage":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'mageicon').setScale(0.25));
                break;
            case "warrior":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'warrioricon').setScale(0.25));
                break;
        }
        this.heroButtons.get(type).on('pointerdown', (pointer) => {
            this.gameController.getHeroAttributes(type, (herodata) => {
                const cardID = `${type}Card`;
                if (ContainerWindowManager.hasWindow(cardID)) {
                    let window = ContainerWindowManager.removeWindow(cardID)
                    window.disconnectListeners();
                    window.destroyWindow();
                }
                else { 
                    ContainerWindowManager.createWindow(self, cardID, HeroWindow, 
                        { 
                            controller: this.gameController,
                            icon: `${type}male`,
                            clienthero: this.hk,
                            windowhero: type,
                            ...herodata,
                            clientherotile: this.clientHeroObject.tile.id,
                            x: pointer.x,
                            y: pointer.y + 20,
                            w: 400,
                            h: 400
                        }
                    );
                }
            })
        }, this);
    }

    private endDaySetup() {
        var self = this;

        // end day button
        this.endDayButton = this.add.image(650, 565, 'enddayicon').setScale(0.3)
        this.endDayButton.on('pointerdown', function (pointer) {
            this.tweens.add({
                targets: this.endDayButton,
                alpha: 0.3,
                duration: 350,
                ease: 'Power3',
                yoyo: true
            });
            self.gameController.endDay(function (all: boolean) {
                if (all) {
                    self.gameController.moveMonstersEndDay();
                    self.gameController.resetWells(replenishWellsClient);
                }
            });
        }, this);

        self.gameController.receiveUpdatedMonsters(moveMonstersOnMap);
        function moveMonstersOnMap(updatedMonsters) {
            self.moveMonstersEndDay(updatedMonsters);
        }

        self.gameController.receiveKilledMonsters(deleteKilledMonsters);
        function deleteKilledMonsters(killedMonster) {
            self.removeKilledMonsters(killedMonster)
        }

        self.gameController.fillWells(replenishWellsClient);
        function replenishWellsClient(replenished: number[]) {
            for (let id of replenished) {
                self.wells.get("" + id).fillWell();
            }
        }

        self.gameController.receiveResetHours(resetHeroHours);
        function resetHeroHours(resetHoursHk: string, firstEndDay: boolean) {
            // Note: we don't keep track of hero hours on client, so only need to update 
            // visual hourTracker
            var hk;
            switch (resetHoursHk) {
                case "archer":
                    hk = HeroKind.Archer;
                    break;
                case "dwarf":
                    hk = HeroKind.Dwarf;
                    break;
                case "mage":
                    hk = HeroKind.Mage;
                    break;
                default:
                    hk = HeroKind.Warrior;
            }
            self.hourTracker.reset(hk, firstEndDay);
        }
    }


    private moveMonstersEndDay(updatedMonsters) {
        for (const [mName, newTileID] of Object.entries(updatedMonsters)) {
            let newTile = this.tiles[newTileID as number];
            this.monsterMoveTween(this.monsterNameMap[mName], newTile, newTile.x, newTile.y);
            if (mName == "gor_herb") {
                // Move the herb "with" it's carrying monster
                let tileID = newTileID as number;
                this.gameController.setHerbPos(tileID)
                this.herbMoveTween(this.herb, newTile.x, newTile.y)
            }
        }
    }

    private removeKilledMonsters(m) {
        let monster = this.monsterNameMap[m]
        monster.tile.monster = null
        monster.destroy()
        this.monsterNameMap[m] = null
    }

    public monsterMoveTween(monster: Monster, newTile: Tile, newX, newY) {
        this.tweens.add({
            targets: monster,
            x: newX + mOffset,
            y: newY,
            duration: 1000,
            ease: 'Power2',
            onComplete: function () { monster.moveToTile(newTile) }
        });
    }

    public herbMoveTween(herb: Phaser.GameObjects.Image, newX, newY) {
        this.tweens.add({
            targets: herb,
            x: newX + mOffset + 20,
            y: newY,
            duration: 1000,
            ease: 'Power2',
            completeDelay: 1000,
            onComplete: function () { 
                herb.x = newX + mOffset + 20,
                herb.y = newY
             }
        });
    }

    public setHerb(herb: Phaser.GameObjects.Image) {
        this.herb = herb;
    }

    public toggleInteractive(interactive: boolean) {
        if (interactive) {
            this.saveButton.setInteractive({useHandCursor: true});
            this.endTurnButton.setInteractive({useHandCursor: true});
            this.endDayButton.setInteractive({useHandCursor: true});
            this.heroButtons.forEach(function (button) {
                button.setInteractive({useHandCursor: true});
            })
        } else {
            this.saveButton.setInteractive();
            this.endTurnButton.disableInteractive();
            this.endDayButton.disableInteractive();
            this.heroButtons.forEach(function (button) {
                button.disableInteractive();
            })
        }
    }

    // DEBUG TODO: remove
    public updateCameraPosInfo(xPos, yPos) {
        if (this.cameraInfo)
            this.cameraInfo.setText(`cameraX: ${xPos}\ncameraY: ${yPos}`)
    }
}