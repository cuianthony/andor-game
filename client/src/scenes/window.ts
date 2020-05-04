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
        // this.parent = this.add.zone(this.windowData.x, this.windowData.y, this.windowData.width, this.windowData.height).setOrigin(0);
        // this.parent.setInteractive()
        // this.input.setDraggable(this.parent);
        console.log('window create()', this.parent.x, this.parent.y, this.windowData.width, this.windowData.height)
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.windowData.width, this.windowData.height);
        this.initialize();
    }

    //press ESC to close windows
    //doesnt work, unused
    kill()
    {
        try {
            this.scene.stop()
        } catch(e) {
            console.log('something went wrong')
        }
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