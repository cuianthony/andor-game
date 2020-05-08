import * as Phaser from 'phaser';

export abstract class BasicWindow {
    protected key: string;
    protected contents: Phaser.GameObjects.Group;
    protected parentScene: Phaser.Scene;

    constructor(parentScene: Phaser.Scene) {
        this.parentScene = parentScene;
        this.contents = parentScene.add.group();
    }

    protected abstract initialize(): void;

    abstract disconnectListeners(): void;
    
    public destroyWindow() {
        // removes all children from the group, the scene, and destroys them
        // console.log('clear children from window', this.contents.getChildren())
        this.contents.clear(true, true);
        this.contents.destroy();
    }

    protected addElements(elements: Phaser.GameObjects.GameObject[]) {
        // console.log('addElements:', elements)
        this.contents = this.parentScene.add.group();
        this.contents.addMultiple(elements);
        // console.log('current window children', this.contents.getChildren())
    }

    protected removeElement(element: Phaser.GameObjects.GameObject) {
        this.contents.remove(element, true, true);
    }
}