import { safeHtml } from "common-tags";

import BasePage from "./basePage";
import "../../src/components/leftMenu/leftMenu.css";
import Chat from "../components/chat/chat";

export default class Index extends BasePage {
    renderContent(parent) {
        parent.innerHTML = safeHtml`
            <div class="chat">
                <p class="chat__placeholder">Отправьте сообщение</p>
            </div>
        `;

        this.chat = new Chat();
        this.chat.render();
    }
}
