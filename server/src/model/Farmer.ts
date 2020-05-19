export class Farmer{
    private tileID: number;

    constructor(tileID) {
        this.tileID = tileID;
    }

    public getTileID(){
        return this.tileID;
    }

    public setTileID(tid: number){
        this.tileID = tid;
    }
}