import * as Phaser from 'phaser';

export abstract class ContainerWindow {
    protected key: string;
    protected contents: Phaser.GameObjects.Container;
    protected parentScene: Phaser.Scene;

    protected posX: number;
    protected posY: number;
    protected w: number;
    protected h: number;

    constructor(parentScene: Phaser.Scene, key: string, data) {
        this.parentScene = parentScene;
        this.key = key;
        this.posX = data.x;
        this.posY = data.y;
        this.w = data.w;
        this.h = data.h;

        this.contents = this.parentScene.add.container(this.posX+this.w/2, this.posY+this.h/2);
        this.contents.setSize(this.w, this.h);
        this.contents.setInteractive();

        this.parentScene.input.setDraggable(this.contents);
        this.parentScene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }

    protected abstract initialize(): void;

    abstract disconnectListeners(): void;
    
    public destroyWindow() {
        this.contents.destroy();
    }

    protected addElements(elements: Phaser.GameObjects.GameObject[]) {
        this.contents.add(elements);
    }
}