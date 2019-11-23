import { html } from "common-tags";

import BaseStringComponent from "../../baseStringComponent";

export default class SubmitButton extends BaseStringComponent {
    constructor(text, color = null) {
        super();
        this.text = text;
        this.color = color;
    }

    renderString() {
        const colorClass = this.color ? "button__color-" + this.color : "";
        return html`
            <div class="form__field-wrapper">
                <button
                    type="submit"
                    class="form__field button button__type-primary ${colorClass}"
                >
                    ${this.text}
                </button>
            </div>
        `;
    }
}
