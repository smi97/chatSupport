import { html } from "common-tags";

import { routes } from "../../modules/router";
import BaseStringComponent from "../baseStringComponent";
import HomeButton from "../buttons";

import "./style.css";

export default class Logo extends BaseStringComponent {
    renderString() {

        const logo_src = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? "/assets/img/lemmaslogo_mobile.png" : "/assets/img/lemmaslogo.png";
        return html`
            ${HomeButton.renderString()}
            <div class="logo">
                <a href="${routes.INDEX}">
                    <img
                        class="logo__image"
                        alt="Lemmas logo"
                        src=${logo_src}
                    />
                </a>
            </div>
        `;
    }
}
