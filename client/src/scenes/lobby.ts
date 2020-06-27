import { lobby } from "../api";
import { reducedWidth, reducedHeight } from '../constants'
import { TransitionScene } from "./TransitionScene";

export default class LobbyScene extends TransitionScene {
    private gameText;
    private optionsIcon;
    private lobbyController;

    constructor() {
        super({ key: 'Lobby' });
        this.lobbyController = new lobby();
    }

    public create() {
        super.create();

        this.add.image(0, 0, 'main').setOrigin(0).setDisplaySize(reducedWidth, reducedHeight);
        this.makeMenuButtons()

        // DEBUG TODO: remove, for game size debugging
        // var info = this.add.text(5, 5, `xpos: 0\nypos: 0`);
        // this.input.on('pointerdown', (pointer) => {
        //     info.setText(`xpos: ${pointer.x}\nypos: ${pointer.y}`)
        // });

        this.lobbyController.addNewPlayerToLobby()
    }

    private makeMenuButtons() {
        var menuText = {
            fontFamily: "Roboto Condensed",
            fontSize: "40px",
            fontStyle: "italic"
        }
        var housetText = {
            fontFamily: "Roboto Condensed",
            fontSize: "20px",
            fontStyle: "italic",
            color: "gray"
        }

        var self = this;
        // New game
        this.gameText = this.add.text(500, 300, "New", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', () => {
            super.fadeOut(() => {
                this.scene.start('Create', { controller: self.lobbyController })
            });
        }, this);

        // Join game
        this.gameText = this.add.text(500, 400, "Join", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', () => {
            super.fadeOut(() => {
                this.scene.start('Join', { controller: self.lobbyController })
            });
        }, this);

        // Load game
        this.gameText = this.add.text(500, 500, "Load", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', () => {
            super.fadeOut(() => {
                this.scene.start('Load', { controller: self.lobbyController })
            });
        }, this);

        // HEROS' DWELLING
        // this.optionsIcon = this.add.image(900, 80, 'optionsicon').setInteractive({useHandCursor: true}).setScale(0.3);
        // this.add.text(900, 133, "heroes' dwelling", housetText).setOrigin(0.5)
        // this.optionsIcon.on('pointerdown', () => {
        //     this.scene.bringToTop('Options')
        //     this.scene.wake('Options')
        // }, this);
    }
}