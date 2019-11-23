import classNames from "classnames";

import BaseComponent from "../baseComponent";
import BaseStringComponent from "../baseStringComponent";

import "./style.css";

export class LinkButton extends BaseStringComponent {
    constructor({
        text,
        href = "",
        icon = null,
        extraClass = "",
        disabled = false,
    }) {
        super();
        this.text = text;
        this.href = href;
        this.icon = icon;
        this.extraClass = extraClass;
        this.disabled = disabled;
    }

    renderString() {
        const buttonClass = classNames(this.extraClass, {
            "button__type-disabled": this.disabled,
        });
        const icon = this.icon
            ? `<span class="button-icon">${this.icon}</span>`
            : "";
        return `
            <a class="button ${buttonClass}" href="${this.href}">
                ${icon}
                ${this.text}
            </a>
        `;
    }
}

export class Button extends BaseComponent {
    constructor(parent, { text, onClick, extraClass = "" }) {
        super(parent);
        this.text = text;
        this.onClick = onClick;
        this.extraClass = extraClass;
    }

    render() {
        const button = document.createElement("a");
        button.className = "button " + this.extraClass;
        button.innerText = this.text;
        button.addEventListener("click", this.onClick);

        this.parent.appendChild(button);
    }
}

export default class HomeButton {
    static renderString() {
        const buttonClass = classNames("button button__type-home", {
            hidden: location.pathname === "/",
        });
        return `
            <a class="${buttonClass}" href="/">
                <i class="fas fa-arrow-left"></i>
            </a>
        `;
    }
}
