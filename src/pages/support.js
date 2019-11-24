import { html } from "common-tags";

import BasePage from "./basePage";

import "../../src/components/leftMenu/leftMenu.css";
import "../../src/components/chat/chat.css";
import router, {routes} from "../modules/router";
import api from "../modules/api";

export default class Support extends BasePage {
    constructor() {
        super();
    }

    async start () {
        this.render();
        await this.renderContent();
    }

    async renderContent(parent) {

        api.supportChats().then(response => {
            console.log(response);
            parent.innerHTML = html`
            <div class="leftMenu">
            ${response.chats.map(chat => html`
            <a class="leftMenu__oneUser id_${chat.user.id}" href="http://localhost:3030/support/chats/${chat.user.id}/">
                    <p class="leftMenu__oneUser__name">${chat.user.name}</p>
                    <p class="leftMenu__oneUser__lastMessage">${chat.last_message ? chat.last_message.text : ""}</p>
            </a>`
            )}
            </div>
            <div class="chat"><p class="chat__placeholder">Выберите пользователя, чтобы начать чат</p></div>
        `;
            document.querySelectorAll("a").forEach(element => {
                element.addEventListener("click", () => {
                    if (document.querySelector(".active")) {
                        document.querySelector(".active").classList.remove("active");
                    }
                    element.classList.add("active");
                });
            });
            document.addEventListener("keydown", this._escape);
        });



    }

    _escape = event => {
        if (event.key === "Escape" || event.keyCode === 27) {
            document.removeEventListener("keydown", this._escape);
            router.redirect(routes.SUPPORT);
        }
    };
}
