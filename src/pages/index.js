import { html } from "common-tags";

import BasePage from "./basePage";
//import { LinkButton } from "../components/buttons";

export default class Index extends BasePage {
    renderContent(parent) {
        document.title = "LeMMaS";
        parent.innerHTML = html`
            
        `;

    }
}
