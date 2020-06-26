import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';
import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { reducedWidth, reducedHeight } from "../constants";
import { lobby } from '../api/lobby';

export default class LoadGameScene extends Phaser.Scene {
    private lobbyController: lobby;
    
    constructor() {
        super({ key: 'Load' });
    }

    public init(data) {
        this.lobbyController = data.controller;
    }

    public preload() {
        this.load.image("submit", "../assets/pregame-components/loadsubmitbutton.png")
    }

    public create() {
        var self = this;

        // TODO: part of ongoing fix, not working
        this.input.keyboard.resetKeys();

        this.add.image(500, 300, 'mountains').setDisplaySize(1000, 600)
        var textStyle = {
            fontSize: "20px",
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

        this.add.text(reducedWidth/2, reducedHeight/2-75, 'Enter the name of the game to load:', textStyle).setOrigin(0.5);
        // Rex plugin edittext for name input
        var nameErrorBg = new RoundRectangle(this, reducedWidth/2, reducedHeight/2-15, 410, 70, 2, 0xff0000);
        this.add.existing(nameErrorBg);
        nameErrorBg.alpha = 0;
        var nameText = new BBCodeText(this, reducedWidth/2, reducedHeight/2-15, 'load_legend', {
            color: '#00DBFF',
            fontSize: '35px',
            fixedWidth: 400,
            fixedHeight: 60,
            backgroundColor: '#333333',
            valign: 'center',
            halign: 'center'
        })
        this.add.existing(nameText);
        var editNameText = new TextEdit(nameText);
        nameText.setOrigin(0.5).setInteractive().on('pointerdown', () => {
            editNameText.open();
        })

        var submitButton = this.add.image(reducedWidth/2, reducedHeight/2+55, 'submit').setOrigin(0.5).setScale(0.3);
        this.add.existing(submitButton);
        submitButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
            let gameName = nameText.text;
            self.lobbyController.loadGame(gameName, (success: boolean) => {
                if (success) {
                    console.log('Loading game:', gameName);
    
                    self.scene.sleep('Load');
                    self.scene.start('Ready', {name: gameName});
                } else {
                    nameText.setText('Game not found');
                    self.tweens.add({
                        targets: nameErrorBg,
                        alpha: 1,
                        duration: 500,
                        ease: 'Power3',
                        yoyo: true
                    });
                    return;
                }
            })
        })

        var backButton = this.add.sprite(80, 475, 'goback').setInteractive({useHandCursor: true}).setScale(0.5)
        backButton.on('pointerdown', () => {
            this.scene.start('Lobby');
        }, this);
    }

}