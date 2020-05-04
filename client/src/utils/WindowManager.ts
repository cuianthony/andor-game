export class WindowManager {

    public static createWindow(parentScene: Phaser.Scene, key: string, windowFunc, windowData) {
        var windowZone = parentScene.add.zone(windowData.x, windowData.y, windowData.w, windowData.h).setInteractive().setOrigin(0);
        var window = new windowFunc(key, windowData, windowZone);
        parentScene.input.setDraggable(windowZone);
        windowZone.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
            window.refresh()
        });
        console.log('window zone:', windowZone)

        parentScene.scene.add(key, window, true);
        // console.log('window', key, 'isVisible: ', parentScene.scene.isVisible(key));
        parentScene.scene.bringToTop(key);
        // console.log('active scenes: ', parentScene.game.scene.getScenes(true, false));
        return window;
    }

    // unused
    public static toggle(self, key: string) {
        if (self.scene.isVisible(key)) {
            self.scene.setVisible(false, key)
            self.scene.sendToBack(key)
            self.scene.sleep(key)
        }
        else {
            self.scene.bringToTop(key)
            self.scene.setVisible(true, key)
            self.scene.resume(key)
        }
        self.scene.setVisible(!self.scene.isVisible(key), key);
    }

    public static destroy(self, key: string) {
        self.scene.stop(key);
        self.scene.remove(key);
    }

    public static get(self, key: string) {
        return self.scene.get(key)
    }
}