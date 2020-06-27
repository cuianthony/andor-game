export abstract class TransitionScene extends Phaser.Scene {
    public create() {
        this.cameras.main.fadeIn(500);
    }

    public fadeOut(callback: Function) {
        this.cameras.main.on('camerafadeoutcomplete', () => {
            callback();
        }, this);

        this.cameras.main.fadeOut(500);
    }
}