import { html } from "common-tags";

import BasePage from "./basePage";

import "../../src/components/leftMenu/leftMenu.css";
import "../../src/components/chat/chat.css";

export default class Support extends BasePage {
    constructor() {
        super();
    }

    renderContent(parent) {
        parent.innerHTML = html`
            <div class="leftMenu">
                <div class="leftMenu__oneUser"></div>
            </div>
            <div class="chat"><p class="chat__placeholder">Выберите пользователя, чтобы начать чат</p></div>
        `;
    }
}
