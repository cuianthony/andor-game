import { BasicWindow } from "../basicwindows/basicwindow";
import { BasicWindowManager } from "../utils/BasicWindowManager";
import { 
    storyCardWidths, storyCardHeights, storyCardTexts, storyCardStyleText, 
    gameInstructionsText, gameInstrTextStyle, 
    reducedWidth, reducedHeight 
} from '../constants'

export class StoryWindow extends BasicWindow {
    // private key;
    private id;
    private okButton: Phaser.GameObjects.Image;
    private runestoneLocs;
    private gameController;
    private firstNarrAdvance;

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
        this.runestoneLocs = data.locs;
        
        if (data.gameController) {
            this.gameController = data.gameController;
        }
        if (data.firstNarrAdvance) {
            this.firstNarrAdvance = data.firstNarrAdvance;
        }

        this.initialize();
    }

    protected initialize() {
        var self = this
        var bg = this.parentScene.add.image(this.posX, this.posY, 'scrollbg').setDisplaySize(this.w, this.h).setOrigin(0);
        var storyText;
        if (this.id == -1) {
            storyText = this.parentScene.add.text(this.posX+10, this.posY+10, gameInstructionsText, gameInstrTextStyle);
        } else {
            storyText = this.parentScene.add.text(this.posX+10, this.posY+10, storyCardTexts[this.id], storyCardStyleText);
        }
        // Extra text for runestones legend
        var extraText;
        if (this.id == 6) {
            extraText = this.parentScene.add.text(this.posX+10, this.posY+130, `The locations of the stones have been discovered:\n${this.runestoneLocs}`, storyCardStyleText);
        }

        this.okButton = this.parentScene.add.image(this.posX+this.w-35, this.posY+this.h-35, 'okay');
        this.okButton.setInteractive({useHandCursor: true}).setDisplaySize(30, 30).setOrigin(0);

        // Start of game story and instructions, IDs 0, 1 and 2
        let name = this.id == -1 ? 'story' : `story${this.id}`;
        let continueCards = [-1, 0, 1, 3, 4]
        if (continueCards.includes(this.id)) {
            this.okButton.on('pointerdown', function (pointer) {
                // start the next story window
                let nextID = this.id + 1;
                BasicWindowManager.createWindow(self.parentScene, `story${nextID}`, StoryWindow,
                    { 
                        x: this.parentScene.getCameraX() + reducedWidth / 2 - storyCardWidths[nextID] / 2,
                        y: this.parentScene.getCameraY() + reducedHeight / 2 - storyCardHeights[nextID] / 2,
                        w: storyCardWidths[nextID],
                        h: storyCardHeights[nextID],
                        id: nextID,
                        gameController: this.gameController,
                        firstNarrAdvance: this.firstNarrAdvance
                    }
                );
                BasicWindowManager.removeWindow(name);
                this.destroyWindow();
            }, this);
        } else if (this.id == 2) {
            // Legend A5: determine placement of the Rune Stones Legend
            if (this.firstNarrAdvance) {
                this.gameController.logRunestoneLegendPos();
            }
            this.okButton.on('pointerdown', function (pointer) {
                this.parentScene.scene.bringToTop('collab')
                this.parentScene.scene.wake('collab')

                BasicWindowManager.removeWindow(name);
                this.destroyWindow();
            }, this);
        } else {
            this.okButton.on('pointerdown', function (pointer) {
                BasicWindowManager.removeWindow(name);
                this.destroyWindow();
            }, this);
        }

        // Animate in all window elements as a unit
        let elements = [bg, storyText, this.okButton];
        if (extraText) {
            elements.push(extraText);
        }
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