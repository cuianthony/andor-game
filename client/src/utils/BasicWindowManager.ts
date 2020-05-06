import { BasicWindow } from "../scenes/basicwindow";

export class BasicWindowManager {
    private static windowMap: Map<string, BasicWindow> = new Map(); // not sure if this works the way I intend

    public static createWindow(parentScene: Phaser.Scene, key: string, windowFunc, windowData) {
        var window = new windowFunc(key, parentScene, windowData);
        this.windowMap.set(key, window);
        return window;
    }

    public static hasWindow(key: string) {
        console.log('BasicWindowManager windowMap', this.windowMap)
        return this.windowMap.has(key);
    }

    public static removeWindow(key: string) {
        let window = this.windowMap.get(key);
        this.windowMap.delete(key);
        return window;
    }
}