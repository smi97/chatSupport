import { html } from "common-tags";

import Form from "../form";
import Input from "../form/elements/input";
import SubmitButton from "../form/elements/submitButton";
import AvatarSelect from "../avatarSelect";
import User from "../../modules/user";

import "./style.css";

const AVATAR_PREVIEW_TIMEOUT = 600;

export default class ProfileForm extends Form {
    constructor(parent, onSubmit) {
        super({
            parent,
            elements: [],
            onSubmit,
            extraClass: "profile-form",
        });
        this.parent = parent;
        this.onSubmit = onSubmit;
    }

    start = () => {
        const interval = setInterval(() => {
            if (User.getCurrentUser() !== undefined) {
                this.render();
                clearInterval(interval);
            }
        }, 200);
    };

    async _renderElements(form) {
        const user = User.getCurrentUser();
        form.innerHTML = html`
            <div class="form__row">
                <div class="form__column avatar-select-wrapper"></div>
                <div class="form__column">
                    ${new Input({
                        name: "name",
                        label: "Имя",
                        value: user.name,
                        tip:
                            'Попробуйте "trump", "lebedev", чтобы получить аватар',
                    }).renderString()}
                </div>
            </div>
            ${new Input({
                name: "password",
                label: "Сменить пароль",
                type: "password",
            }).renderString()}
            ${new Input({
                name: "password-repeat",
                label: "Повторите пароль",
                type: "password",
            }).renderString()}
            ${new SubmitButton("Сохранить").renderString()}
        `;

        this.avatarSelect = new AvatarSelect(
            form.querySelector(".avatar-select-wrapper"),
            await User.getAvatarUrl()
        );
        this.avatarSelect.render();

        form.querySelector(".form__field.name").addEventListener(
            "input",
            this._onNameTyped
        );
        form.querySelector(".avatar-input").addEventListener(
            "input",
            this._onAvatarLoaded
        );
        form.querySelector(".form__field.password").autocomplete =
            "new-password";
        form.querySelector(".form__field.password-repeat").autocomplete =
            "new-password";
    }

    _onNameTyped = e => {
        const name = e.target.value;
        if (name === "") {
            this.avatarSelect.render();
            return;
        }
        if (this.avatarPreviewTimeoutHandler !== null) {
            clearTimeout(this.avatarPreviewTimeoutHandler);
        }
        this.avatarPreviewTimeoutHandler = setTimeout(() => {
            this.avatarSelect.previewByName(name);
        }, AVATAR_PREVIEW_TIMEOUT);
    };

    _onAvatarLoaded = e =>
        (document.querySelector(
            ".avatar-input-wrapper img.avatar"
        ).src = URL.createObjectURL(e.target.files[0]));
}
