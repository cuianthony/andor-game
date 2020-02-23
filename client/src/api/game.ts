import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class game {
    private name: string;
    private socket;

    constructor(name) {
        this.name = name
        this.socket = this.connect(this.name)

    }

    private connect(name) {
        return io.connect(BASE_API + `/${name}`);
    }

    public bindHero(herotype) {
        console.log(herotype, "inside game controller client")
        this.socket.emit("bind hero", herotype)
    }


}

