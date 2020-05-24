import { game } from "../api/game";
import { BasicWindow } from "./basicwindow";

export class ChatWindow extends BasicWindow {
    private chatBox;
    private gameinstance: game;
    private posX: number;
    private posY: number;

    public constructor(parentScene: Phaser.Scene, data) {
        super(parentScene)

        this.gameinstance = data.controller
        this.posX = data.x;
        this.posY = data.y;
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

        this.initialize();
    }

    protected initialize() {
        var self = this;

        /* DOM element dimensions:
         * x: set x - 110, 707
         * y: set y - 130, 410
         * w: 218
         * h: 260
        */
        this.chatBox = this.parentScene.add.dom(this.posX, this.posY).createFromCache('chatform');

        this.chatBox.addListener('click');
        this.chatBox.on('click', function (event) {
            if (event.target.name === 'sendButton') {
                var inputText = this.getChildByName('nameField');
                //  Have they entered anything?
                if (inputText.value !== '') {
                    event.preventDefault();
                    self.gameinstance.send(inputText.value, function (msg) {
                        inputText.value = "";
                        updateChat(msg)
                    })
                }
            }
        });
        this.addElements([ this.chatBox ]);

        function updateChat(msg) {
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

    public disconnectListeners() {}
}