import { Window } from "./window";
import { game } from "../api/game";

export class Fight extends Window {
    private gameinstance: game;
    private monstertexture;

    private herostr;
    private herowill;

    private fighttext;
    private monstername;
    private theirroll;
    private notificationtext
    private yourroll;

    private monstericon
    private monsterstr
    private monsterwill
    private monstergold
    private monstertype
    private monsterstrtxt
    private monsterwilltxt
    private monstergoldtxt
    private monstertypetxt

    public constructor(key, data, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        console.log(data)
        this.gameinstance = data.controller
        this.monstertexture = data.monstertexture
        this.monstername = data.monstername
        this.herostr = data.hero.getStrength()
        this.herowill = data.hero.getWillPower()
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        this.monstericon = this.add.image(40,40,this.monstertexture)

        this.gameinstance.getMonsterStats(this.monstername, function(data) {
            self.monsterstr = data.str;
            self.monsterwill = data.will;
            self.monstergold = data.reward;
            self.monstertype = data.type;
            self.monstertypetxt = self.add.text(3,80,self.monstertype)
            self.monsterstrtxt = self.add.text(3,95,"Str: " + self.monsterstr)
            self.monsterwilltxt = self.add.text(3,110,"Will: " + self.monsterwill)
            self.monstergoldtxt = self.add.text(3,125,"Reward: " + self.monstergold)
        })

        this.notificationtext = this.add.text(90,170, '', { backgroundColor: '#3b44af' })
        this.fighttext = this.add.text(90, 25, 'Fight!!', { backgroundColor: '#363956' }).setInteractive()
        this.theirroll = this.add.text(90, 75, 'Their roll: ', { backgroundColor: 'fx00' })
        this.yourroll = this.add.text(90, 125, 'Your roll: ', { backgroundColor: 'fx00' })

        this.fighttext.on('pointerdown', function (pointer) {
            console.log('fighting!!')
            self.gameinstance.rollMonsterDice(self.monstername, function (monsterroll, heroroll, winner) {
                if (monsterroll == 'outofrange'){
                    self.notificationtext.setText('Out of range!!!!!!')
                }
                else if (monsterroll == 'notime'){
                    self.notificationtext.setText('Get some sleep!!!!')
                }
                else if (winner == 'monster'){
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('OUCH!! You take \n' + (monsterroll - heroroll) + ' damage!')
                }
                else if (winner == 'hero') {
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('WHAM!! You hit them for \n' + (heroroll - monsterroll) + ' damage!')
                    self.tween()
                    self.monsterwill = self.monsterwill - (heroroll - monsterroll)
                    self.monsterwilltxt.setText('Will: ' + self.monsterwill)
                }
                else {
                    //tie
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('Tie! You are \nevenly matched...')
                }
            })
        })
    }

    public tween() {
        //  Flash the prompt
        this.monstericon.setTint('#000000')
        this.tweens.add({
            targets: this.monstericon,
            alpha: 0.2,
            duration: 200,
            ease: 'Power3',
            yoyo: true
        });
        this.monstericon.clearTint()
    }


}