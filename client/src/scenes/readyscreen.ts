import { game } from "../api/game";
import {bindhero} from "../api/readyscreen"
export default class ReadyScreenScene extends Phaser.Scene {
        public archerportrait;
        public warriorportrait;
        public dwarfportrait;
        public mageportrait;
        public selection;
        public ready: boolean = false
        public playbutton
        public readytext
        public selectionmap = {'Archer':200,'Dwarf':410,'Warrior':620,'Mage':830}
        public name: string;
        public gameController;

        public revselectionmap = {200:'Archer', 410:'Dwarf', 620:'Warrior', 830:'Mage'}
    constructor() {
        super({key: 'Ready'});
    }

    public init(data){
        this.name = data.name
        this.gameController = new game(this.name);
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
        console.log(this.gameController)

    }

    public preload() {
        this.load.html('readyform', './assets/readyscreen.html')
        this.load.html('readytable','./assets/readytable.html')
    }

    create() {
        this.add.image(500,300,'andordude').setDisplaySize(1000,600)
        this.archerportrait = this.add.image(200,200,'archermale').setDisplaySize(160,200)
        this.dwarfportrait = this.add.image(410,200,'dwarfmale').setDisplaySize(160,200)
        this.warriorportrait = this.add.image(620,200,'warriormale').setDisplaySize(160,200)
        this.mageportrait = this.add.image(830,200,'magemale').setDisplaySize(160,200)
        this.selection = this.add.sprite(200,70,'backbutton').setDisplaySize(48,48)
        this.selection.angle = 90
        this.readytext = this.add.text(200,450,'Ready?',{ fontFamily: '"Roboto Condensed"',fontSize: "40px",color:"#E42168"})

        var heroselect = this.add.dom(400, 400).createFromCache('readyform')
        var readytable = this.add.dom(690,420).createFromCache('readytable')

        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');

        }, this);

        var self = this;
        this.playbutton = this.add.sprite(950,550,'playbutton').setInteractive()
        this.playbutton.on('pointerdown', function (pointer) {
            if (this.ready){
                console.log(this.selection, ' xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                let heroselectedx = this.selection.x
                var hero = this.revselectionmap[heroselectedx]
                //bind that herotype to the player's hero instance
                //TODO
                bindhero(hero)
                this.scene.start('Game',{gameinstance:self.gameController});
            }
            else {
                console.log('here2' + this.ready)
                this.tween()
            }
        }, this);

        heroselect.addListener('click');
        this.ready = false
        //this is how we can interact with the html dom element
        heroselect.on('click', function (event) {
            let name = event.target.name
            if (name === 'Archer' ||name === 'Mage' ||name === 'Dwarf' ||name === 'Warrior')
            {
                console.log('here 1 boio' + name)
                this.scene.selection.x = this.scene.selectionmap[name]

            }
            if (name === 'readyswitch'){
                console.log('here3' + this.ready)
                this.scene.ready = !(this.scene.ready)
            }
            else {
            }

        });

        //Options: issue - DOM elements render above all scenes so looks finicky
        // var optionsIcon = this.add.image(930, 80, 'optionsIcon').setInteractive();
        // optionsIcon.on('pointerdown', function (pointer) {
        //     this.sys.game.scene.bringToTop('Options')
        //     this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
        //     this.sys.game.scene.resume('Options')
        // }, this);

    }

    public tween() {
                                            //  Flash the prompt
                                            this.tweens.add({
                                                targets: this.readytext,
                                                alpha: 0.2,
                                                duration: 200,
                                                ease: 'Power3',
                                                yoyo: true
                                            });
    }

}