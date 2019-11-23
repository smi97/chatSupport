import BaseComponent from "../baseComponent";

import "./style.css";

const LOADER_SHOWN_CLASS = "loader-shown";

export default class Loader extends BaseComponent {
    constructor(blurElement, loaderParent) {
        const htmlElement = document.querySelector("html");
        super(!loaderParent ? htmlElement : loaderParent);
        this.blurElement = blurElement ? blurElement : document.body;
    }

    show() {
        this.blurElement.classList.add(LOADER_SHOWN_CLASS);

        this.loader = document.createElement("div");
        this.loader.className = "loader";

        const loaderInner = document.createElement("p");
        loaderInner.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
        loaderInner.className = "loader__inner";
        this.loader.appendChild(loaderInner);

        this.parent.appendChild(this.loader);
    }

    hide() {
        this.parent.removeChild(this.loader);
        this.blurElement.classList.remove(LOADER_SHOWN_CLASS);
    }
}
