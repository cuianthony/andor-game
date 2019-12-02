import { Window } from "./window";
import * as io from "socket.io-client";
import { WindowManager } from "../utils/WindowManager";

export class Chat extends Window {
    private socket;
    private text;
    private element;
    public constructor (key, windowData={x:10, y:10, width: 350, height: 250}){
        super(key, windowData);
    }

    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }
    
    protected initialize(){
        var socket = io.connect("http://localhost:3000/");

        this.text = "";
        this.cameras.main.setBackgroundColor(0xffffff)

        this.element = this.add.dom(200,220).createFromCache('chatform');
        this.element.addListener('click');
        this.element.on('click', function (event) {
    
            if (event.target.name === 'playButton')
            {
                var inputText = this.getChildByName('nameField');
    
                //  Have they entered anything?
                if (inputText.value !== '')
                {
                    //  Turn off the click events
                    // this.removeListener('click');
    
                    //  Hide the login element
                    // this.setVisible(false);
    

                    console.log("a;dkhsflkb");
                    event.preventDefault();
                    socket.emit("send message", inputText.value, function() {
                        inputText.value = "";
                    });
                }
            }
    
        });

        socket.on("update messages", function(msg){
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            document.getElementById("history").append(paragraph);
        });

        console.log("chat window create", this)

    }

}