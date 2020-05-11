import * as Phaser from 'phaser';

export abstract class Window extends Phaser.Scene {
    protected parent: Phaser.GameObjects.Zone
    protected key: string;
    protected windowData;

    public constructor (key: string, windowData = {}, windowZone: Phaser.GameObjects.Zone){
        super(key);
        this.key = key;
        this.parent = windowZone;
        this.windowData = windowData;
    } 
 
    create () {
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.windowData.width, this.windowData.height);
        this.initialize();
    }

    refresh() {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }

    protected abstract initialize(): void;
    
    public destroy() : void {
        this.parent.destroy()
        this.scene.stop()
        this.scene.remove()
    }
}