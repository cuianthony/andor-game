import * as Phaser from 'phaser';

export class Tile extends Phaser.GameObjects.Sprite{
    public adjacent: Tile[] = [];
    public id: number;
    public heroexist: boolean = false;
    public x: number;
    public y: number;
    private graphic;
    public hero: Phaser.GameObjects.Sprite;
    constructor(id, scene, x, y,texture) {
        super(scene, x, y,'tiles',texture);
        this.id = id;
        this.x = x;
        this.y = y;
    
    }
    public printstuff() {
        console.log("Tile's id: " + this.id);
        this.adjacent.forEach(element => {
            try{
                console.log(element.id)
            }
            catch(e){}
        });
        console.log(this.id + ' tile has hero? ' + this.heroexist)
    }

    public moveTo() {
        this.adjacent.forEach(element => {
            try{
                if (element.heroexist == true) {
                    this.hero = element.hero;
                    element.hero = null;
                    element.heroexist = false;
                    this.heroexist = true;
                    this.hero.x = this.x;
                    this.hero.y = this.y;
                }
            }
            catch(e) {}
        });
    }
}