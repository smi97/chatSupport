import { safeHtml } from "common-tags";

import BaseComponent from "../baseComponent";
import Loader from "../loader";
import { routes } from "../../modules/router";
import User from "../../modules/user";

import "./style.css";

export default class UserInfo extends BaseComponent {
    start() {
        const loader = new Loader(this.parent, this.parent.parentElement);
        loader.show();
        const interval = setInterval(() => {
            if (User.getCurrentUser() !== undefined) {
                this.render(User.getCurrentUser()).then(() => loader.hide());
                clearInterval(interval);
            }
        }, 200);
    }

    async render(currentUser) {
        if (currentUser === null) {
            return;
        }
        this.parent.innerHTML = `
            <a href="${routes.USER_PROFILE}" class="userinfo">
                <span class="userinfo__name">${safeHtml`${currentUser.name}`}</span>
                <img
                    class="userinfo__avatar"
                    src="${await User.getAvatarUrl()}"
                />
            </a>
        `;
    }
}
