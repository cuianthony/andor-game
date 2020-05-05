import { Window } from "./window";
import { game } from "../api/game";

export class Chat extends Window {
    private element;
    private gameinstance: game;

    public constructor(key, data, windowZone: Phaser.GameObjects.Zone) {
        super(key, {x: data.x, y: data.y, width: data.w, height: data.h}, windowZone);
        this.gameinstance = data.controller

        var self = this;
        this.gameinstance.recieve(function update(msg) {
            self.gameinstance.appendToChatLog(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            try {
                document.getElementById("history").append(paragraph);
            }
            catch {
                console.log('error in adding chat info to history')
            }
        })
    }

    public preload() {
        this.load.html('chatform', './assets/templates/chat.html');
    }

    protected initialize() {
        console.log(this)
        var self = this;

        this.element = this.add.dom(200, 170).createFromCache('chatform');

        this.element.addListener('click');
        this.element.on('click', function (event) {
            console.log("clicking")
            if (event.target.name === 'sendButton') {
                var inputText = this.getChildByName('nameField');
                //  Have they entered anything?
                if (inputText.value !== '') {
                    event.preventDefault();
                    self.gameinstance.send(inputText.value, function (msg) {
                        inputText.value = "";
                        update(msg)
                    })
                }
            }
        });

        function update(msg) {

            console.log(msg)
            self.gameinstance.appendToChatLog(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            try {
                document.getElementById("history").append(paragraph);
            }
            catch {
                console.log('error in adding chat info to history')
            }

        }

        this.gameinstance.getChatLog().forEach(element => {
            let p = document.createElement('p')
            p.append(element)
            document.getElementById("history").append(p)
        });

    }

}