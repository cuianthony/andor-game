import * as Phaser from 'phaser';
import { Hero } from './hero';
import { Farmer } from './farmer';

/* 
On the client, Tiles should definitely know what they have on them so that
those things can be displayed: Heroes, Monsters, Items, Farmers.
Not sure if Tiles need to know adjacencies on the client side. 
Tiles don't need to be sprites? Because they themselves aren't represented
by a
*/
export class Tile extends Phaser.GameObjects.Sprite {
    public adjacent: Tile[] = [];
    public id: number;
    public heroexist: boolean = false;
    public farmerexist: boolean = false;
    public x: number;
    public y: number;
    private graphic;
    // Should support multiple heroes
    public hero: Hero;
    public farmer: Array<Farmer>;
    public heroCoords;
    public farmerCoords;

    constructor(id, scene, x, y, texture) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.hero = null;
        this.farmer = new Array(2);
        this.on('pointerdown', function (pointer) { this.printstuff() });
        this.on('pointerdown', function (pointer) { this.moveRequest() })

        // Set coordinates for hero representations as 2d array
        this.heroCoords = [
            [this.x-30, this.y-30],
            [this.x+30, this.y-30],
            [this.x-30, this.y+30],
            [this.x+30, this.y+30]
        ]

        this.farmerCoords = [
            [this.x-30, this.y-30],
            [this.x+30, this.y-30]
        ]
    }

    public printHerodata() {
        if (this.heroexist) {
            console.log("Tile id: " + this.id + " has a hero with id: " + this.hero.id + ".");
        }
        else {
            console.log("Tile id: " + this.id + " does not have a hero.");
        }
    }

    public printstuff() {
        console.log("Tile's id: " + this.id);
        this.adjacent.forEach(element => {
            try {
                console.log(element.id)
            }
            catch (e) { }
        });
        console.log(this.id + ' tile has hero? ' + this.heroexist)
    }

    public moveRequest() {
        console.log("New request.");
        this.adjacent.forEach(element => {
            try {
                console.log(element.id);
                if (element.heroexist == true) {
                    this.hero = element.hero.move(this);
                    if (this.hero.tile === this) {
                        this.heroexist = true;
                        element.hero = null;
                        element.heroexist = false;
                    }

                }
            }
            catch (e) { console.log("Tile: " + element.id + " threw an error.") }
        });

    }
}