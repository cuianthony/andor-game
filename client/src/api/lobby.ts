import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class lobby {
    private socket;

    constructor(){
        this.socket = this.connect()
    }

    private connect() {
        return io.connect(BASE_API + "/lobby");
    }


    public addNewPlayerToLobby() {
        this.socket.emit("newPlayer");
    }
    
    public createGame(name, numPlayers, difficulty){
        this.socket.emit("createGame", name, numPlayers, difficulty)
    }
    
    public getGames(callback){
        this.socket.emit("getGames", callback)
    }
}




