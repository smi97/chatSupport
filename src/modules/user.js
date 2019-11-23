import API, {STATUS_OK} from "./api";

class User {
    constructor() {
        //this._updateCurrentUser();
    }

    async login(email, password) {
        const response = await API.loginUser(email, password);
        if (response.status === STATUS_OK) {
            this._updateCurrentUser();
        }
        return response;
    }

    register = (email, name, password) =>
        API.registerUser(email, name, password);

    async logout() {
        const response = await API.logoutUser();
        if (response.status === STATUS_OK) {
            this._setLogin(false);
            this.currentUser = null;
        }
        return response;
    }

    async update(name, password) {
        const response = await API.updateUser(name, password);
        if (response.status === STATUS_OK) {
            this._updateCurrentUser();
        }
        return response;
    }

    async updateAvatar(formData) {
        const response = await API.updateAvatar(formData);
        if (response.status === STATUS_OK) {
            this._updateCurrentUser();
        }
        return response;
    }

    getAvatarUrl = () =>
        !this.currentUser.avatar_path
            ? "/assets/img/userpic.png"
            : this.currentUser.avatar_path;

    _setLogin = loggedIn => (this.loggedIn = loggedIn);

    isLoggedIn = () => this.loggedIn;

    getCurrentUser = () => this.currentUser;

    async _updateCurrentUser() {
        const user = await API.currentUserProfile();
        this.currentUser = user;
        if (user) {
            this._setLogin(true);
        }
    }
}

export default new User();
