import { html } from "common-tags";

import BaseComponent from "../baseComponent";

import "./style.css";

const SUCCESS_MESSAGE_CLASS = "form__message_success";
const ERROR_MESSAGE_CLASS = "form__message_error";

export default class Form extends BaseComponent {
    constructor({ parent, elements, onSubmit = null, extraClass = null }) {
        super(parent);
        this.elements = elements;
        this.onSubmit = onSubmit;
        this.extraClass = extraClass;
    }

    async render() {
        let formClass = "";
        formClass += this.extraClass ? this.extraClass : "";

        this.parent.innerHTML = html`
            <form class="form ${formClass}"></form>
            <div class="form__message"></div>
        `;
        const form = this.parent.querySelector(".form");
        this._renderElements(form);
        form.addEventListener("submit", this.onSubmit);

        this.message = this.parent.querySelector(".form__message");
    }

    getValue(fieldName) {
        return this.parent.querySelector("." + fieldName).value;
    }

    showOK(info) {
        this.message.innerHTML = `<i class="fas fa-check"></i> ${info}`;
        this.message.classList.remove(ERROR_MESSAGE_CLASS);
        this.message.classList.add(SUCCESS_MESSAGE_CLASS);
        setTimeout(() => {
            this.hideMessage();
        }, 3000);
    }

    showError(error) {
        this.message.innerHTML = `<i class="fas fa-times"></i> ${error}`;
        this.message.classList.remove(SUCCESS_MESSAGE_CLASS);
        this.message.classList.add(ERROR_MESSAGE_CLASS);
    }

    hideMessage() {
        this.message.classList.remove(SUCCESS_MESSAGE_CLASS);
        this.message.classList.remove(ERROR_MESSAGE_CLASS);
    }

    _renderElements(form) {
        form.innerHTML = html`
            ${this.elements.map(e => e.renderString())}
        `;
    }
}
