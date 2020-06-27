export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload', active: true });
    }

    public preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/2-160, 270, 320, 50);
        
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        console.log(Phaser.Math.RoundTo(100.5, 0))
        this.load.on('progress', function (value: number) {
            percentText.setText(Phaser.Math.RoundTo(value*100, 0) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width/2-150, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // this.load.on('complete', function () {
        //     progressBar.destroy();
        //     progressBox.destroy();
        //     loadingText.destroy();
        //     percentText.destroy();
        //     assetText.destroy();
        // });
        
        // ASSETS
        // Lobby assets
        this.load.image('desert', './assets/pregame-components/fantasydesert.jpg')
        this.load.image('mountains', './assets/pregame-components/mountains_bg.jpg')
        this.load.image('andordude', './assets/pregame-components/andordude.jpg')
        this.load.image('main', './assets/pregame-components/mainscreen.png')
        this.load.image('goback', './assets/pregame-components/wizard-goes-back.png')
        this.load.image('entergame', './assets/pregame-components/enter.png')
        this.load.image('fantasyhome', './assets/pregame-components/fantasyhome.jpg')
        this.load.image('gameboard', './assets/board-major/Andor_Board.jpg')
        this.load.image('pointerbtn', './assets/Pass.png')
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

        // Options assets
        this.load.image('settings', './assets/options-menu/settings-screen.png');
        this.load.image('soundon','./assets/options-menu/SongOn.png');
        this.load.image('soundoff','./assets/options-menu/SongOff.png');

        // Create game assets
        this.load.image("createsubmit", "../assets/pregame-components/createsubmitbutton.png")

        // Join game assets
        this.load.image("joinsubmit", "../assets/pregame-components/joinsubmitbutton.png")

        // Load game assets
        this.load.image("submit", "../assets/pregame-components/loadsubmitbutton.png")

        // Ready screen assets
        this.load.html('readyform', './assets/templates/readyscreen.html')
        this.load.html('readytable', './assets/templates/readytable.html')
        this.load.image("archerbanner", "../assets/pregame-components/archerbanner.png");
        this.load.image("dwarfbanner", "./assets/pregame-components/dwarfbanner.png");
        this.load.image("warriorbanner", "./assets/pregame-components/warriorbanner.png");
        this.load.image("magebanner", "./assets/pregame-components/magebanner.png");
        this.load.image("pointerhand", "./assets/pregame-components/pointerhand.png");
        this.load.image('chaticon', './assets/pregame-components/chat.png')

        // Game scene assets
        this.load.image("gor", "../assets/all-creatures/gor.PNG")
        this.load.image("skral", "../assets/all-creatures/skral.PNG")
        this.load.image("wardrak", "../assets/all-creatures/wardrak.PNG")
        this.load.image("fortress", "../assets/all-creatures/fortress.png")

        this.load.image("functional_well", "../assets/board-minor/functional_well.png");
        this.load.image("broken_well", "../assets/board-minor/broken_well.png");
        this.load.image("merchant-trade", "../assets/board-minor/merchant-trade.png");
        this.load.image("farmer", "../assets/board-minor/farmer.png");
        this.load.image("witch", "../assets/board-minor/witch.png");
        this.load.image("pawn", "../assets/board-minor/pawn.png");
        this.load.image('dshield', './assets/board-minor/disabled_cracked_shield.png')
        this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets');

        this.load.image("WillPower2", "../assets/fog-tokens/will2.png");
        this.load.image("WillPower3", "../assets/fog-tokens/will3.png");
        this.load.image("Gold", "../assets/fog-tokens/gold.png");
        this.load.image("EventCard", "../assets/fog-tokens/event.png");
        this.load.image("Gor", "../assets/fog-tokens/gorfog.png");
        this.load.image("WitchFog", "../assets/fog-tokens/witchfog.png");
        this.load.image("WineskinFog", "../assets/fog-tokens/wineskinfog.png");
        this.load.image("eventcard", "../assets/fog-tokens/eventcard.png");
        this.load.image("Strength", "../assets/fog-tokens/strength.png");

        // Items
        this.load.image("menubackground", "../assets/menubackground.png");
        this.load.image("blue_runestone", "../assets/stones/runestone_b.PNG");
        this.load.image("green_runestone", "../assets/stones/runestone_g.PNG");
        this.load.image("yellow_runestone", "../assets/stones/runestone_y.PNG");
        this.load.image("blue_runestone_h", "../assets/stones/runestone_b_hidden.png");
        this.load.image("green_runestone_h", "../assets/stones/runestone_g_hidden.png");
        this.load.image("yellow_runestone_h", "../assets/stones/runestone_y_hidden.png");

        this.load.image("brew", "../assets/items/brew.png");
        this.load.image("wineskin", "../assets/items/wineskin.png");
        this.load.image("bow", "../assets/items/bow.PNG");
        this.load.image("falcon", "../assets/items/falcon.PNG");
        this.load.image("helm", "../assets/items/helm.PNG");
        this.load.image("telescope", "../assets/items/telescope.PNG");
        this.load.image("half_wineskin", "../assets/items/half_wineskin.jpg")
        this.load.image("half_brew", "../assets/items/half_brew.jpg")
        this.load.image("herb", "../assets/items/herb.png");
        this.load.image("shield", "../assets/items/shield.png")
        this.load.image("damaged_shield", "../assets/items/brokenshield.PNG")

        this.load.image("prince", "../assets/board-minor/prince.png");
        this.load.image("gold", "../assets/fog-tokens/gold.png")

        this.load.image('okay', './assets/ok.png')
        this.load.image("item_border", "../assets/border.png"); // Colour: hex 4b2504
        this.load.image("hero_border", "../assets/big_border.png");
        this.load.image('close_button', '../assets/close_button.png')

        // Game overlay assets
        this.load.image('hourbar', './assets/board-major/hours.PNG')
        this.load.image('endturnicon', './assets/overlay-components/endturn.png')
        this.load.image('enddayicon', './assets/overlay-components/endday.png')
        this.load.image('chaticon', './assets/overlay-components/chat.png')
        this.load.image('archericon', './assets/overlay-components/archerbtn.png')
        this.load.image('dwarficon', './assets/overlay-components/dwarfbtn.png')
        this.load.image('mageicon', './assets/overlay-components/magebtn.png')
        this.load.image('warrioricon', './assets/overlay-components/warriorbtn.png')
        this.load.image("saveicon", "./assets/overlay-components/save.png")

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
    }

    public create() {
        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.start('Lobby')
        }, this);

        this.cameras.main.fadeOut(2000);
    }
}