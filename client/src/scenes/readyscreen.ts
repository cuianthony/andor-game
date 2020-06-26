import { game } from "../api";
import { ChatWindow } from '../basicwindows/chatwindow';
import { GameObjects } from "phaser";
import { reducedWidth } from "../constants";
import { BasicWindowManager } from "../utils/BasicWindowManager";

export default class ReadyScreenScene extends Phaser.Scene {
    public archer: GameObjects.Image;
    public warrior: GameObjects.Image;
    public dwarf: GameObjects.Image;
    public mage: GameObjects.Image;
    public selection: GameObjects.Sprite;
    public ready: boolean = false;
    public playButton: GameObjects.Sprite;
    public readyText: GameObjects.Text;
    public gameController: game;
    private chatButton: GameObjects.Image;
    public name: string;

    constructor() {
        super({ key: 'Ready' });
    }

    public init(data) {
        this.name = data.name;
        this.gameController = new game(this.name);
    }

    public preload() {
        this.load.html('readyform', './assets/templates/readyscreen.html')
        this.load.html('readytable', './assets/templates/readytable.html')
        this.load.image("archerbanner", "../assets/pregame-components/archerbanner.png");
        this.load.image("dwarfbanner", "./assets/pregame-components/dwarfbanner.png");
        this.load.image("warriorbanner", "./assets/pregame-components/warriorbanner.png");
        this.load.image("magebanner", "./assets/pregame-components/magebanner.png");
        this.load.image("pointerhand", "./assets/pregame-components/pointerhand.png");
        this.load.image('chaticon', './assets/pregame-components/chat.png')
    }

    create() {
        const heroSize = {
            x: 160,
            y: 200
        }

        this.add.image(500, 300, 'andordude').setDisplaySize(1000, 600)

        this.gameController.getAvailableHeros((heros) => {
            if (!heros) {
                console.log("Error: No available heros found for game", heros)
                return;
            }
            // console.log(heros)
            heros.forEach((h) => {
                if (h === "archer") {
                    this.archer = this.add.image(200, 200, 'archer').setDisplaySize(heroSize.x, heroSize.y);
                    this.add.image(200, 330, 'archerbanner').setScale(0.25);
                    this.archer.name = "archer";
                    this.attachHeroBinding(this.archer);
                } else if (h === "dwarf") {
                    this.dwarf = this.add.image(410, 200, 'dwarf').setDisplaySize(heroSize.x, heroSize.y);
                    this.add.image(410, 330, 'dwarfbanner').setScale(0.25);
                    this.dwarf.name = "dwarf";
                    this.attachHeroBinding(this.dwarf);
                } else if (h === "warrior") {
                    this.warrior = this.add.image(620, 200, 'warrior').setDisplaySize(heroSize.x, heroSize.y);
                    this.add.image(620, 330, 'warriorbanner').setScale(0.25);
                    this.warrior.name = "warrior";
                    this.attachHeroBinding(this.warrior);
                } else {
                    this.mage = this.add.image(830, 200, 'mage').setDisplaySize(heroSize.x, heroSize.y);
                    this.add.image(830, 330, 'magebanner').setScale(0.25);
                    this.mage.name = "mage";
                    this.attachHeroBinding(this.mage);
                }
            })
        });

        this.selection = this.add.sprite(200, 70, 'pointerhand').setDisplaySize(55, 55)
        this.selection.angle = 90
        this.selection.setVisible(false);
        this.readyText = this.add.text(200, 450, 'Ready?', { fontFamily: '"Roboto Condensed"', fontSize: "40px", color: "#E42168" })

        var textStyle = {
            fontSize: "27px",
            color: '#00DBFF',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }
        this.add.text(reducedWidth/2, 410, 'Choose the hero you wish to play.', textStyle).setOrigin(0.5);

        // back button
        var backButton = this.add.sprite(80, 475, 'goback').setInteractive({useHandCursor: true}).setScale(0.5)
        backButton.on('pointerdown', () => {
            this.ready = false;
            this.scene.start('Lobby');
        }, this);

        var self = this;

        //advance to game button.
        this.playButton = this.add.sprite(900, 485, 'entergame').setInteractive({useHandCursor: true}).setScale(0.5)
        this.playButton.on('pointerdown', () => {
            self.gameController.allPlayersReady((ready) => {
                if (this.ready && ready) {
                    if (BasicWindowManager.hasWindow('chat')) {
                        let window = BasicWindowManager.removeWindow(`chat`);
                        window.disconnectListeners();
                        window.destroyWindow();
                    } 
                    this.ready = false; // reset ready status
                    this.gameController.enterGame()
                    this.scene.start('Game', { controller: self.gameController, heroType: self.selection.name });
                }
                else {
                    this.tween()
                }
            })

        }, this);

        // chat window
        this.chatButton = this.add.image(775, 540, 'chaticon').setScale(0.3)
        this.chatButton.setInteractive({useHandCursor: true})
        this.chatButton.on('pointerdown', () => {
            if (BasicWindowManager.hasWindow('chat')) {
                let window = BasicWindowManager.removeWindow(`chat`);
                window.disconnectListeners();
                window.destroyWindow();
            } else {
                BasicWindowManager.createWindow(this, "chat", ChatWindow, 
                    { 
                        controller: self.gameController, 
                        x: 707, 
                        y: 385
                    }
                )
            }
        }, this);

        this.gameController.updateHeroList((hero) => {
            console.log(self[hero])
            if (self[hero]) {
                self[hero].removeListener('pointerdown')
                self[hero].setVisible(false);
            } else
                console.log("Sorry cant find ", hero)
        }); // listener for when other clients select heros

        //callbacks
        function remListener(hero) {
            console.log(hero)
            self[hero].removeListener('pointerdown')
        }

        this.gameController.removeObjListener(remListener)
    }

    private attachHeroBinding(heroSelection) {
        heroSelection.setInteractive({useHandCursor: true});
        var self = this;
        heroSelection.on('pointerdown', () => {
            if (!self.ready) {
                self.gameController.bindHeroForSelf(heroSelection.name, () => {
                    self.selection.x = heroSelection.x;
                    self.selection.setVisible(true);
                    self.ready = true;
                    self.selection.name = heroSelection.name;
                    self[heroSelection.name].setTint(0x404040)
                })
            }
        }, this);
    }

    public tween() {
        //  Flash the prompt
        this.tweens.add({
            targets: this.readyText,
            alpha: 0.2,
            duration: 200,
            ease: 'Power3',
            yoyo: true
        });
    }
}