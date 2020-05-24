import { ContainerWindow } from "../containerwindows/containerwindow";

export class ContainerWindowManager {
    private static windowMap: Map<string, ContainerWindow> = new Map(); // not sure if this works the way I intend

    public static createWindow(parentScene: Phaser.Scene, key: string, windowFunc, windowData) {
        var window = new windowFunc(parentScene, key, windowData);
        this.windowMap.set(key, window);
        return window;
    }

    public static hasWindow(key: string) {
        return this.windowMap.has(key);
    }

    public static removeWindow(key: string) {
        let window = this.windowMap.get(key);
        this.windowMap.delete(key);
        return window;
    }
}