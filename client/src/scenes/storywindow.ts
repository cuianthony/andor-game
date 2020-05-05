import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager"
import { storyCardWidths, storyCardHeights, 
        storyCardTexts, storyCardStyleText, storyCardStyleTitle, reducedWidth, reducedHeight } from '../constants'

export class StoryWindow extends Window {
    // private key;
    private id;
    private okButton: Phaser.GameObjects.Image;
    private runestoneLocs;
    private gameController;
    private firstNarrAdvance;

    private x;
    private y;
    private width;
    private height;

    // TODO: this is gross, change it
    private instructions = 
`PLAYING INSTRUCTIONS:\n\n
To move: left click on a tree\n
To fight: click the monster icon. This opens the fight menu. Closing this menu is considered ending the fight, so be careful not to leave the menu if you don’t want to end the battle!\n
To collect a farmer: left click\n
To use a well: left click \n
To use a wineskin: click your corresponding hero window in the upper left. Left click the wineskin. Your next move will not cost hours\n
To drop any item/farmers/gold: click your corresponding hero window in the upper left. Click drop next to the appropriate item. \n
To trade with another hero: You must be on the same tile. Click on their hero window. Select trade in the upper right corner. If you have a falcon, you may trade with any hero from any space\n
To move the prince: ctrl + left click \n
To see the items on a tile: shift + left click a tree\n
To activate fog: either end your turn on a tile with a fog or left click the fog.\n
To use your telescope, click on a fog from an adjacent space.\n
Bows are automatically considered when fights begin. \n
You will be prompted to use a shield if you have one where appropriate. \n
To interact with a merchant, left click the merchant icon on the appropriate tiles`

    private instrStyle = {
        fontSize: 12,
        color: '#000000',
        wordWrap: { width: 540, useAdvancedWrap: true }
    }

    public constructor(key: string, data, windowZone: Phaser.GameObjects.Zone) {
        super(key, {x: data.x, y: data.y, width: data.w, height: data.h}, windowZone);

        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
        this.runestoneLocs = data.locs;
        if (data.gameController) {
            this.gameController = data.gameController;
        }
        if (data.gameController) {
            this.gameController = data.gameController;
        }
        if (data.firstNarrAdvance) {
            this.firstNarrAdvance = data.firstNarrAdvance;
        }
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0);
        var storyText;
        if (this.id == -1) {
            storyText = this.add.text(10, 10, this.instructions, this.instrStyle);
        } else {
            storyText = this.add.text(10, 10, storyCardTexts[this.id], storyCardStyleText);
        }
        // Extra text for runestones legend
        var extraText;
        if (this.id == 6) {
            extraText = this.add.text(10, 130, `The locations of the stones have been discovered:\n${this.runestoneLocs}`, storyCardStyleText);
        }

        this.okButton = this.add.image(this.width-35, this.height-35, 'okay');
        this.okButton.setInteractive({useHandCursor: true}).setDisplaySize(30, 30).setOrigin(0);

        // Start of game story and instructions, IDs 0, 1 and 2
        let continueCards = [-1, 0, 1, 3, 4]
        if (continueCards.includes(this.id)) {
            this.okButton.on('pointerdown', function (pointer) {
                // start the next story window
                let nextID = this.id + 1;
                WindowManager.createWindow(self, `story${nextID}`, StoryWindow, {
                    x: reducedWidth / 2 - storyCardWidths[nextID] / 2,
                    y: reducedHeight / 2 - storyCardHeights[nextID] / 2,
                    w: storyCardWidths[nextID],
                    h: storyCardHeights[nextID],
                    id: nextID,
                    gameController: this.gameController,
                    firstNarrAdvance: this.firstNarrAdvance
                })
                // this.scene.remove(this.key)
                this.destroy();
            }, this);

            // if (this.id == -1) {
            //     this.okButton.on('pointerdown', function (pointer) {
            //         // start the next story window
            //         WindowManager.createWindow(self, `story0`, StoryWindow, {
            //             x: this.x + 300,
            //             y: this.y + 250,
            //             w: storyCardWidths[storyID],
            //             h: storyCardHeights[storyID],
            //             id: 0,
            //             gameController: this.gameController,
            //             firstNarrAdvance: this.firstNarrAdvance
            //         })
            //         this.scene.remove(this.key)
            //     }, this);
            // } else {
            //     this.okButton.on('pointerdown', function (pointer) {
            //         // start the next story window
            //         WindowManager.createWindow(self, `story${this.id+1}`, StoryWindow, {
            //             x: this.x + storyCardWidths[this.id]/2,
            //             y: this.y + storyCardHeights[this.id]/2,
            //             id: this.id+1,
            //             gameController: this.gameController,
            //             firstNarrAdvance: this.firstNarrAdvance
            //         })
            //         this.scene.remove(this.key)
            //     }, this);}
        } else if (this.id == 2) {
            // Legend A5: determine placement of the Rune Stones Legend
            if (this.firstNarrAdvance) {
                this.gameController.logRunestoneLegendPos();
            }
            this.okButton.on('pointerdown', function (pointer) {
                this.scene.bringToTop('collab')
                this.scene.wake('collab')
                // this.scene.remove(this.key)
                this.destroy();
            }, this);
        } else {
            this.okButton.on('pointerdown', function (pointer) {
                // this.scene.remove(this.key)
                this.destroy();
            }, this);
        }

        // Animate the "scene" in. Can't target the scene but can add everything to a container
        let storyContainer = this.add.container(0, 0, [bg, storyText, this.okButton]);
        if (extraText) {
            storyContainer.add(extraText);
        }
        storyContainer.alpha = 0;
        this.tweens.add({
            targets: storyContainer,
            duration: 500,
            alpha: 1
        })
    }
}