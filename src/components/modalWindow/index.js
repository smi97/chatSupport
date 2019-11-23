import { html } from "common-tags";

import { Button } from "../../components/buttons/index";

import "./style.css";

export default class ModalWindow {
    constructor(parent) {
        this.parent = parent;
    }

    start = (info, clickYes, clickNo) => {
        this.info = info;
        this.clickYes = clickYes;
        this.clickNo = clickNo;

        this.render();
    };

    render = () => {
        const modalWindowWrapper = document.createElement("div");
        modalWindowWrapper.className = "modalWindow__wrapper";
        this.parent.appendChild(modalWindowWrapper);

        modalWindowWrapper.innerHTML = html`
            <div class="modalWindow plate">
                <div class="modalWindow__text">${this.info}</div>
                <div class="modalWindow__buttons-wrapper"></div>
            </div>
        `;

        const buttonsWrapper = modalWindowWrapper.querySelector(
            ".modalWindow__buttons-wrapper"
        );

        const yesButton = new Button(buttonsWrapper, {
            text: "Да",
            onClick: this.clickYes,
            extraClass: "button__type-primary",
        });
        const noButton = new Button(buttonsWrapper, {
            text: "Нет",
            onClick: this.clickNo,
            extraClass: "button__transparency-transparent",
        });

        yesButton.render();
        noButton.render();
    };

    close = () => {
        this.parent.removeChild(
            document.body.querySelector(".modalWindow__wrapper")
        );
    };
}
