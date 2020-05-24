import { BasicWindow } from "./basicwindow";
import { BasicWindowManager } from "../utils/BasicWindowManager";

export class EventWindow extends BasicWindow {
    private id;
    private okButton: Phaser.GameObjects.Image;
    private flavorText;
    private descText;

    private posX: number;
    private posY: number;
    private w: number;
    private h: number;

    public constructor(parentScene: Phaser.Scene, data) {
        super(parentScene);
        this.id = data.id;
        this.posX = data.x;
        this.posY = data.y;
        this.w = data.w;
        this.h = data.h;
        this.flavorText = data.flavorText;
        this.descText = data.descText;

        this.initialize();
    }

    protected initialize() {
        var self = this

        var titleStyle = {
            color: '#000000',
            backgroundColor: '#D9B382',
            fontSize: 16,
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        var flavorTextStyle = {
            color: '#4B2504',
            fontSize: 12,
            fontStyle: 'italic',
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        var descTextStyle = {
            color: '#4B2504',
            fontSize: 10,
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        
        let currY = 10
        var bg = this.parentScene.add.image(this.posX, this.posY, 'scrollbg').setOrigin(0);
        var title = this.parentScene.add.text(this.posX+this.w/2, this.posY+currY, `Event Card ${this.id}`, titleStyle).setOrigin(0.5, 0);
        currY = currY + title.displayHeight + 20;
        var flavor = this.parentScene.add.text(this.posX+this.w/2, this.posY+currY, this.flavorText, flavorTextStyle).setOrigin(0.5, 0);
        currY = currY + flavor.displayHeight + 10;
        var desc = this.parentScene.add.text(this.posX+this.w/2, this.posY+currY, this.descText, descTextStyle).setOrigin(0.5, 0);
        currY = currY + desc.displayHeight + 50;
        bg.setDisplaySize(this.w, currY);
        
        this.okButton = this.parentScene.add.image(this.posX+this.w - 35, this.posY+bg.displayHeight - 35, 'okay');
        this.okButton.setInteractive({useHandCursor: true}).setDisplaySize(30, 30).setOrigin(0);
        let windowName = `eventWindow${this.id}`;
        this.okButton.on('pointerdown', function (pointer) {
            if (this.parentScene.scene.get('collab')) {
                this.parentScene.scene.bringToTop('collab')
                this.parentScene.scene.wake('collab')
            }
            BasicWindowManager.removeWindow(windowName);
            this.destroyWindow();
        }, this);

        // Animate the "scene" in. Can't target the scene but can add everything to a container
        let elements = [bg, title, flavor, desc, this.okButton];
        this.addElements(elements);
        this.contents.setAlpha(0);
        this.parentScene.tweens.add({
            targets: this.contents.getChildren(),
            duration: 500,
            alpha: 1
        })
    }

    public disconnectListeners() {
    }
}