import { safeHtml } from "common-tags";

import BasePage from "./basePage";

import "../../src/components/leftMenu/leftMenu.css";
import "../../src/components/chat/chat.css";
import router, {routes} from "../modules/router";
//import api from "../modules/api";

export default class Support extends BasePage {
    constructor() {
        super();
    }

    renderContent(parent) {
        /*const userList = api.supportChats();
        ${userList.map(player => safeHtml`
                   <div class="leaderboard__player ${
               currentUser && player.id === currentUser.id
                   ? "leaderboard__player_me"
                   : ""
           }">
        <span class="leaderboard__player-name">${
                player.name
            }</span>
            <span class="leaderboard__player-position">${i++}</span>
            </div>
                `
        )}*/

        parent.innerHTML = safeHtml`
            <div class="leftMenu">
           
          
                <a class="leftMenu__oneUser id_1" href="http://localhost:3030/support/chats/1/">
                    <p class="leftMenu__oneUser__name">Maxim</p>
                    <p class="leftMenu__oneUser__lastMessage">Hello!</p>
                </a>
                <a class="leftMenu__oneUser id_2" href="http://localhost:3030/support/chats/2/">
                    <p class="leftMenu__oneUser__name">Maxim</p>
                    <p class="leftMenu__oneUser__lastMessage">Hello!</p>
                </a>
            </div>
            <div class="chat"><p class="chat__placeholder">Выберите пользователя, чтобы начать чат</p></div>
        `;

        document.querySelectorAll("a").forEach(element => {
           element.addEventListener("click", () => {
               if(document.querySelector(".active")) {
                   document.querySelector(".active").classList.remove("active");
               }
               element.classList.add("active");
           });
        });
        document.addEventListener("keydown", this._escape);
    }

    _escape = event => {
        if (event.key === "Escape" || event.keyCode === 27) {
            document.removeEventListener("keydown", this._escape);
            router.redirect(routes.SUPPORT);
        }
    };
}
