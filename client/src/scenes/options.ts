
export default class Options extends Phaser.Scene {
    private musicStarted: boolean;

    constructor() {
        super({
            key: 'Options',
            active: true
        });
    }

    public preload() {
        this.load.image('settings', './assets/options-menu/settings-screen.png');
        this.load.image('soundon','./assets/options-menu/SongOn.png');
        this.load.image('soundoff','./assets/options-menu/SongOff.png');

        this.load.audio('music', 'assets/options-menu/doxent_-_Arcane.mp3');
    }

    public create() {
        // Initially sleep the scene
        this.scene.sleep('Options');

        let music = this.game.sound.add('music');
        this.add.image(500, 300, 'settings').setDisplaySize(1000,600);
        var style1 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "70px",
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000',
                blur: 10,
                stroke: true,
                fill: true
            },
            color: "#4944A4"
        };
        this.add.text(500, 200, "Options", style1).setOrigin(0.5);
        // Images for toggling sound on and off
        let soundOn = this.add.image(500, 300, 'soundon').setOrigin(0.5).setInteractive({useHandCursor: true});
        let soundOff = this.add.image(500, 300, 'soundoff').setOrigin(0.5).setInteractive({useHandCursor: true});

        soundOn.on('pointerdown', () => {
            music.pause();
            soundOff.visible = true;
        }, this);

        soundOff.on('pointerdown', () => {
            if (!this.musicStarted) {
                music.play({
                    loop: true,
                    volume: 0.5
                });
                this.musicStarted = true;
            } else { //music started already
                music.resume();
            }        

            soundOff.visible = false;
        }, this);

        let backButton = this.add.text(500, 400, "Back", style1).setOrigin(0.5).setInteractive({useHandCursor: true});
        backButton.on('pointerdown', () => {
            this.scene.sleep('Options');
        }, this);
    }
}