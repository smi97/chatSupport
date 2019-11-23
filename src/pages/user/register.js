import { html } from "common-tags";

import BasePage from "../basePage";
import Form from "../../components/form";
import Input from "../../components/form/elements/input";
import SubmitButton from "../../components/form/elements/submitButton";
import User from "../../modules/user";
import Login from "./login";
import {STATUS_OK} from "../../modules/api";

export default class Register extends BasePage {
    constructor() {
        super();
        this.onRegisterFormSubmit = this.onRegisterFormSubmit.bind(this);
    }

    renderContent(parent) {
        document.title = "Register | LeMMaS";

        parent.innerHTML = html`
            <div class="plate plate__size-m">
                <h2 class="text__align-center text__size-big">Регистрация</h2>
                <div class="form-wrapper"></div>
            </div>
        `;
        const formElements = [
            new Input({
                name: "email",
                label: "Email",
                type: "email",
                required: true,
            }),
            new Input({ name: "name", label: "Name", required: true }),
            new Input({
                name: "password",
                label: "Пароль",
                type: "password",
                required: true,
            }),
            new Input({
                name: "password-repeat",
                label: "Повторите пароль",
                type: "password",
                required: true,
            }),
            new SubmitButton("Зарегистрироваться"),
        ];
        this.registerForm = new Form({
            parent: parent.querySelector(".form-wrapper"),
            elements: formElements,
            onSubmit: this.onRegisterFormSubmit,
        });
        this.registerForm.render();
    }

    async onRegisterFormSubmit(e) {
        e.preventDefault();

        const email = this.registerForm.getValue("email");
        const name = this.registerForm.getValue("name");
        const password = this.registerForm.getValue("password");
        const passwordRepeat = this.registerForm.getValue("password-repeat");

        if (password.length < 6) {
            this.registerForm.showError(
                "Пароль не должен быть короче 6 символов"
            );
            return;
        }

        if (password !== passwordRepeat) {
            this.registerForm.showError("Пароли не совпадают");
            return;
        }

        const response = await User.register(email, name, password);
        if (response.status === STATUS_OK) {
            Login.prototype.login(email, password);
            return;
        }
        const responseJSON = await response.json();
        if (
            responseJSON.body.message ===
            "user with this email already registered"
        ) {
            this.registerForm.showError(
                "Пользователь с таким email уже существует"
            );
        } else {
            this.registerForm.showError("Произошла неизвестная ошибка");
        }
    }
}
