import { lobby } from "../api/lobby";
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { TransitionScene } from "./TransitionScene";

export default class JoinGameScene extends TransitionScene {
    private lobbyController: lobby;
    private gameNames: string[] = [];
    private gameButtonsMap: Map<string, RoundRectangle> = new Map();
    private gameChoice: string = "";

    constructor() {
        super({ key: 'Join' });
    }

    public init(data){
        this.lobbyController = data.controller;
    }

    //create the join screen
    public create() {
        super.create();

        var self = this;
        this.add.image(500,300,'fantasyhome').setDisplaySize(1000,600)
        
        var textStyle = {
            fontSize: "25px",
            color: '#4ee44e',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }

        this.add.text(150, 190, 'Choose an existing game to join:', textStyle);
        let mainColour = 0x4ee44e
        let backColour = 0x333333
        var numTextStyle = {
            color: '#4ee44e',
            fontSize: '30px'
        }

        this.lobbyController.getGames( function(games) {
            console.log(games);
            self.gameNames = games;

            let currY = 250;
            let currX = 150;
            self.gameNames.forEach( name => {
                var nameButton = new Phaser.GameObjects.Text(self, currX, currY, name, numTextStyle).setOrigin(0);
                nameButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                    // toggle function
                    toggleChoice(name)
                })
                let textWidth = nameButton.displayWidth;
                let centreX = currX + textWidth/2;
                let centreY = currY + nameButton.displayHeight/2;
                var gamePanelBg = new RoundRectangle(self, centreX, centreY, textWidth+30, 52, 10, mainColour).setOrigin(0.5);
                gamePanelBg.visible = false;
                self.add.existing(gamePanelBg);
                var gamePanel = new RoundRectangle(self, centreX, centreY, textWidth+24, 46, 10, backColour).setOrigin(0.5);
                gamePanel.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                    // toggle function
                    toggleChoice(name)
                })
                self.add.existing(gamePanel);
                self.add.existing(nameButton);
                self.gameButtonsMap.set(name, gamePanelBg);
                currX += textWidth + 50;
                if (currX > 700) {
                    currY += 60;
                    currX = 150;
                }
            })
        })

        function toggleChoice(name: string) {
            self.gameChoice = name;
            self.gameButtonsMap.forEach((bg, bgName) => {
                if (name == bgName) {
                    bg.visible = true;
                } else {
                    bg.visible = false;
                }
            })
        }

        var submitButton = this.add.image(660, 371, 'joinsubmit').setOrigin(0.5).setScale(0.3).setInteractive({useHandCursor: true});
        submitButton.on('pointerdown', () => {
            if (self.gameChoice !== '') {
                self.lobbyController.addPlayerToGame(self.gameChoice, null);
                super.fadeOut(() => {
                    self.scene.start('Ready', {name: self.gameChoice})
                });
            }
        })

        var backButton = this.add.sprite(80, 475, 'goback').setInteractive({useHandCursor: true}).setScale(0.5)
        backButton.on('pointerdown', () => {
            super.fadeOut(() => {
                self.scene.start('Lobby');
            });
        });
    }

    public update() {

    }
}