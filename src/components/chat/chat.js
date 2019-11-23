import { safeHtml } from "common-tags";

import BasePage from "../../pages/basePage";
import Support from "../../pages/support";

import Input from "../form/elements/input";
import SubmitButton from "../form/elements/submitButton";
import Form from "../form";
import Message from "./message";

export default class Chat extends BasePage {
    render() {
        if(!document.querySelector(".chat")) {
            (new Support()).render();
        }
        this.chat = document.querySelector(".chat");

        const id = location.pathname.replace("/support/chats/","").replace("/","");
        if(document.querySelector(`.id_${id}`)){
            document.querySelector(`.id_${id}`).classList.add("active");
        }

        const my = !location.pathname.startsWith("/support");

        this.chat.innerHTML = safeHtml`
            <div class="chat__messages">
                <div class="message ${my ? "message__owner-me" : "message__owner-notme"}">
                    <p>Hi, im User</p>
                </div>
            </div>
            <div class="chat__sendForm">
            </div>
        `;

        const formElements = [
            new Input({
                name: "Message",
                required: true,
            }),
            new SubmitButton("Send"),
        ];

        this.messageForm = new Form({
            parent: document.querySelector(".chat__sendForm"),
            elements: formElements,
            onSubmit: this.onMessageSent,
        });
        this.messageForm.render();

        this.chatMessages = this.chat.querySelector(".chat__messages");
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        this.socket = new WebSocket("ws://95.163.212.121/api/v1/private/game");
        this.socket.onopen = () => {
            console.log("[open] Соединение установлено");
            console.log("Отправляем данные на сервер");
            this.socket.send(`{"type" : "start"}`);
        };

        this.socket.onmessage = this._messageHandler;

        this.socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log('[close] Соединение прервано');
            }
        };

        this.socket.onerror = (error) => {
            console.log(`[error] ${error.message}`);
        };

        /*this.chat.querySelector(".Message").addEventListener(
            "input",
            this._onMessageTyped
        );*/
    }

    /*_onMessageTyped = e => {
        api.register();
    };*/

//{"id":0,"user_from_id":34,"user_to_id":1,"text":"hello support","time":"2019-11-23T13:16:01.4585217Z"}

    _messageHandler = event => {
        console.log(`[message] Данные получены с сервера: ${event.data}`);
        const data = JSON.parse(event.data);
        const user_id = this._getCookie("user_id");
        this.addMessage(data.text, user_id === data.user_to_id);
    };

    _getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2)
            return parts.pop().split(";").shift();
    }

    onMessageSent = e => {
        e.preventDefault();
        const message = this.messageForm.getValue("Message");
        this.addMessage(message, true);
        this.socket.send(message);
        this.messageForm.clear("Message");
    };

    addMessage (message, my) {
        const newMessage = new Message(this.chatMessages);
        newMessage.render(message, my);
    }
}
