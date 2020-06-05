import { lobby } from "../api";
import { reducedWidth, reducedHeight } from '../constants'

export default class LobbyScene extends Phaser.Scene {
    private gameText;
    private optionsIcon;
    private lobbyController;

    constructor() {
        super({
            key: 'Lobby',
            active: true
        });
        this.lobbyController = new lobby();
    }

    public init() { }

    public preload() {
        // Load all game assets in first scene
        this.load.image('desert', './assets/pregame-components/fantasydesert.jpg')
        this.load.image('mountains', './assets/pregame-components/mountains_bg.jpg')
        this.load.image('andordude', './assets/pregame-components/andordude.jpg')
        this.load.image('main', './assets/pregame-components/mainscreen.png')
        this.load.image('goback', './assets/pregame-components/wizard-goes-back.png')
        this.load.image('entergame', './assets/pregame-components/enter.png')
        this.load.image('fantasyhome', './assets/pregame-components/fantasyhome.jpg')

        this.load.image('gameboard', './assets/board-major/Andor_Board.jpg')
        this.load.image('pointerbtn', './assets/Pass.png')
        // this.load.image('playbutton', './assets/Play.png')

        this.load.image("archermale", "../assets/pregame-components/archermale.png");
        this.load.image("dwarfmale", "./assets/pregame-components/dwarfmale.png");
        this.load.image("warriormale", "./assets/pregame-components/warriormale.png");
        this.load.image("magemale", "./assets/pregame-components/magemale.png");
        this.load.image("archer", "../assets/pregame-components/archermale.png");
        this.load.image("dwarf", "./assets/pregame-components/dwarfmale.png");
        this.load.image("warrior", "./assets/pregame-components/warriormale.png");
        this.load.image("mage", "./assets/pregame-components/magemale.png");

        this.load.image('optionsicon', './assets/options-menu/haus.png')
        this.load.image('scrollbg', './assets/windowbg.jpg')
        this.load.image('trademenubg', './assets/menubackground.png')

        this.load.html('chatform', './assets/templates/chat.html');
    }

    public create() {
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
            this.scene.start('Create', { controller: self.lobbyController });
        }, this);

        // Join game
        this.gameText = this.add.text(500, 400, "Join", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', () => {
            this.scene.start('Join', { controller: self.lobbyController });
        }, this);

        // Load game
        this.gameText = this.add.text(500, 500, "Load", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', () => {
            this.scene.start('Load', { controller: self.lobbyController });
        }, this);

        // HEROS' DWELLING
        this.optionsIcon = this.add.image(900, 80, 'optionsicon').setInteractive({useHandCursor: true}).setScale(0.3);
        this.add.text(900, 133, "heroes' dwelling", housetText).setOrigin(0.5)
        this.optionsIcon.on('pointerdown', () => {
            this.scene.bringToTop('Options')
            this.scene.wake('Options')
        }, this);
    }

    public update() { }
}