
import { Region, Hero } from '.';
//import { HourTracker } from './hourTracker';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Farmer{
    public tile: Region;
    //public x: number;
    //public y: number;
    public carriedBy!: Hero;

    constructor(tile) {
        //this.x = x;
        //this.y = y;
        this.tile = tile;
    }

}