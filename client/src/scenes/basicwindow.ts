import * as Phaser from 'phaser';

export abstract class BasicWindow {
    protected key: string;
    protected contents: Phaser.GameObjects.Group;

    constructor(parentScene: Phaser.Scene) {
        this.contents = parentScene.add.group();
        this.initialize();
    }

    protected abstract initialize(): void;
    
    public destroy() {
        // removes all children from the group, the scene, and destroys them
        this.contents.clear(true, true);
        this.contents.destroy();
    }

    protected addToContents(elements: Phaser.GameObjects.GameObject[]) {
        this.contents.addMultiple(elements);
    }
}