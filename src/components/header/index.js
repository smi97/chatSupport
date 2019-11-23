import { html } from "common-tags";

import BaseComponent from "../baseComponent";
import Logo from "../logo";
import Menu from "../menu";

import "./style.css";

export default class Header extends BaseComponent {
    render() {
        this.parent.innerHTML = html`
            ${new Logo().renderString()}
            <div class="menu"></div>
        `;
        new Menu(this.parent.querySelector(".menu")).start();
    }
}
