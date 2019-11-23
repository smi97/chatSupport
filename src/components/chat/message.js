import {safeHtml} from "common-tags";

import "./message.css";

export default class Message {
    constructor (parent) {
        this.parent = parent;
    }

    render (message, my) {
        this.parent.innerHTML += safeHtml`
                <div class="message ${my ? "message__owner-me" : "message__owner-notme"}  message__new">
                    <p>${message}</p>
                </div>
        `;

        setTimeout(() => {
            const newMessage = this.parent.querySelector(".message__new");
            newMessage.classList.remove("message__new");
            console.log(this.parent.scrollHeight);
            this.parent.scrollTop = this.parent.scrollHeight;
        }, 500);
    }

    renderString (message, my) {
        return safeHtml`
                <div class="message ${my ? "message__owner-me" : "message__owner-notme"}">
                    <p>${message}</p>
                </div>
        `;
    }
}